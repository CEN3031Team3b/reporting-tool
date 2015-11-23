'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 product = mongoose.model('product'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/*
 * Configuration for MWS connection
 */
 var config = require('../../../../config/env/local'),
 MWS = require('mws-sdk'),
 client = new MWS.Client(config.accessKeyId, config.secretAccessKey, config.merchantId, {}),
 marketPlaceId = 'ATVPDKIKX0DER';

/**
 * Create a product
 */
 exports.create = function (req, res) {
  var product = new product(req.body);
  product.user = req.user;

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Show the current product
 */
 exports.read = function (req, res) {
  res.json(req.product);
};

/**
 * Update a product
 */
 exports.update = function (req, res) {
  var product = req.product;

  product.sku = req.body.sku;
  product.quantity = req.body.quantity;
  product.price = req.body.price;
  product.purchaseDate = req.body.purchaseDate;
  product.orderID = req.body.orderID;
  product.user = req.user;

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Delete an product
 */
 exports.delete = function (req, res) {
  var product = req.product;

  product.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/*
 *  Makes API call to get info on items in an order
 */
 function listOrderItems(orderID, newDate){
  // initialize api call for the list of items in a particular order
  var sf1 = new MWS.Orders.requests.ListOrderItems({'orderID': orderID});
  sf1.params.AmazonOrderId.value = orderID;
  client.invoke(sf1, function(RESULT2){
    var j = 0;

  //INNER LOOP1 START- looping through all items in each order
  for(j = 0; j < RESULT2.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem.length; j++) {
    var newSku = RESULT2.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[j].SellerSKU[0],
    newQty = RESULT2.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[j].QuantityShipped[0],
    newPrice = RESULT2.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[j].ItemPrice[0].Amount[0];

    //creating new product
    var newProduct = new product({
      sku: newSku,
      quantity: newQty,
      price: newPrice,
      purchaseDate: newDate,
      orderID: orderID
    });

    // have associated user for this product
    //newProduct.user = request.user;

    //saving new product to local database
    newProduct.save();

    console.log('SKU: ' + newSku);
    console.log('qty: ' + newQty);
    console.log('price: ' + newPrice);
    console.log('date: ' + newDate);
    /*RESULT.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[0] // returns first item of order*/
  }
  //INNER LOOP1 END
});
}

/*
 *  Returns if data in our db
 */
 function inDB(num, orderID, newDate){
  if(num === 0) {
    console.log('\n\nOrder doesn\'t exist\n\n');
    //call to add to db
    listOrderItems(orderID, newDate);
  }
  else {
    console.log('\n\nOrder already exists\n\n');
  }
}

/**
 * Find product by order id
 */
 function productByOrderID (req, res, next, orderID, newDate) {

  if (orderID === '') {
    return res.status(400).send({
      message: 'order id is invalid'
    });
  }

  product.findOne({'orderID': orderID}).exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return next(0, orderID, newDate);
    }
    //req.product = product;
    next(product);
  });
}

//Makes Amazon MWS API calls when needed
function orders(request, response, CreatedAfter, CreatedBefore){
  var sf = new MWS.Orders.requests.ListOrders({'marketPlaceId': marketPlaceId});
  
  //assigning values to ensure we only get amazon information with criteria below
  sf.params.MarketplaceId.value = marketPlaceId;
  sf.params.CreatedAfter.value = '2014-07-10';
  sf.params.CreatedBefore.value = '2014-07-20';
  sf.params.FulfillmentChannel.value = 'AFN';
  sf.params.OrderStatus.value = 'Shipped';

  //making the request to amazon
  client.invoke(sf, function(RESULT){
    var i = 0;

      //CHECK WHERE RESULT IS EMPTY
      if(RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].length === 0) {
        console.log('There are no items ordered for specified date range.');
      }
      else {
        //OUTER LOOP START - looping through all orders in response
        for(i = 0; i < RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order.length; i++) {

          /* console.log(JSON.stringify(RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order[i])); // returns the first order in response information */
          
          //stores order id number so inner loop can get individual products from the order
          // stores date order was made
          var orderID = RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order[i].AmazonOrderId[0],
              newDate = RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order[i].PurchaseDate[0];
          /*console.log(orderID);*/

          productByOrderID(request, response, inDB, orderID, newDate);
        }
        //OUTER LOOP END
      }
    });
}

// Queries database and updates profitMargin and productMargin attributes
function margins() {
  // query all documents in DB
  product.find(function(err, results) {
    if (err) 
      console.log(err);

    // cycle through every document and update attributes
    for(var i = 0; i < results.length; i++) {
      results[i].profitMargin = (results[i].price - results[i].fbaAmt - results[i].cost)/results[i].price; // profit margin
      results[i].productMargin = results[i].cost/results[i].price; // product margin
      results[i].save(function(err) {
        if (err) 
          console.log(err);
      });
    }
  });
}

/**
 * List of products
 */
 exports.list = function (req, res) {
  //if date doesn't exist in our DB, call orders with the dates that are missing
  orders();

  product.find().sort('-sku').populate('user', 'displayName').exec(function (err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(products);
    }
  });
};

/**
 * product middleware
 */
 exports.productByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'product is invalid'
    });
  }

  product.findById(id).populate('user', 'displayName').exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};
