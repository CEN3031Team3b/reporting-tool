'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 product = mongoose.model('product'),
 db = require('../../../../config/env/development'),
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
    if(typeof(RESULT2.ListOrderItemsResponse) !== 'undefined'){

      var j = 0;

      //INNER LOOP1 START- looping through all items in each order
      for(j = 0; j < RESULT2.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem.length; j++) {
        var newSku = RESULT2.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[j].SellerSKU[0],
        newPrice,
        newQty = RESULT2.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[j].QuantityShipped[0];
        if( typeof(RESULT2.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[j].ItemPrice[0].Amount[0]) !== 'undefined') {
          newPrice = RESULT2.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[j].ItemPrice[0].Amount[0];
        }
        //creating new product
        var newProduct = new product({
          sku: newSku,
          quantity: newQty,
          price: newPrice,
          purchaseDate: newDate,
          orderID: orderID,
          revenue: newPrice * newQty,
          cost: newPrice * (1/2),
          profitMargin: (newPrice - 0 - newPrice*(1/2))/newPrice, //eventually substitute 0 ith fbaAmt
          productMargin: newPrice*(1/2)/newPrice
        });

        // have associated user for this product
        //newProduct.user = request.user;

        //saving new product to local database
        newProduct.save();

        // console.log('SKU: ' + newSku);
        // console.log('qty: ' + newQty);
        // console.log('price: ' + newPrice);
        // console.log('date: ' + newDate);
        /*RESULT.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[0] // returns first item of order*/
      }
      //INNER LOOP1 END
    }
    else {
      console.log('You\'re being throttled in ListOrderItems. Please try again later.');   
    }
  });
}

/*
 *  Returns if data in our db
 */
 function inDB(num, orderID, newDate){
  if(num === 0) {
    console.log('Order doesn\'t exist in the database, placing it now.');
    //call to add to db
    listOrderItems(orderID, newDate);
  }
  else {
    console.log('Order already exists in the database.');
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

function changeDate(date){
  var day = date.getDate(),
      month = date.getMonth() + 1;

  if(day.toString().length < 2)
    day = '0' + day;

  if(month.toString().length < 2)
    month = '0' + month;

  return date.getFullYear() + '-' + month + '-' + day;
}


/*
 *  Makes API call to get next 100 orders
 */
 function listNextOrders(request, response, firstNextToken, x){

  var sf2 = new MWS.Orders.requests.ListOrdersByNextToken({'NextToken': firstNextToken});
  var tokenTracker = 0;
  var nextToken = firstNextToken;
  //loop for calling ListOrdersByNextTokenResponse multiple times... requires more than 100 orders.
  for (tokenTracker = 0; tokenTracker !== -1 && x < 1; x++) {
    sf2.params.NextToken.value = nextToken;
    console.log('about to call via next token');
    console.log(nextToken); 
    console.log('-------------------');
    client.invoke(sf2, function(RESULT){

        //console.dir(RESULT);

        if(typeof(RESULT.ListOrdersByNextTokenResponse) !== 'undefined'){
          var i = 0;

          //CHECK WHERE RESULT IS EMPTY 
          // console.dir(RESULT.ListOrdersByNextTokenResponse);
          // console.dir(RESULT.ListOrdersByNextTokenResponse.ListOrdersResult[0]);
          // console.dir(RESULT.ListOrdersByNextTokenResponse.ListOrdersResult[0].Orders[0]);
          // console.dir(RESULT.ListOrdersByNextTokenResponse.ListOrdersResult[0].Orders[0].length);
          if(RESULT.ListOrdersByNextTokenResponse.ListOrdersByNextTokenResult[0].Orders[0].length === 0) {
            console.log('There are no items ordered for specified date range.');
          }
          else {

            //OUTER LOOP START - looping through all orders in response
            for(i = 0; i < RESULT.ListOrdersByNextTokenResponse.ListOrdersByNextTokenResult[0].Orders[0].Order.length; i++) {
              
              //stores order id number so inner loop can get individual products from the order
              // stores date order was made
              var orderID = RESULT.ListOrdersByNextTokenResponse.ListOrdersByNextTokenResult[0].Orders[0].Order[i].AmazonOrderId[0],
                  newDate = RESULT.ListOrdersByNextTokenResponse.ListOrdersByNextTokenResult[0].Orders[0].Order[i].PurchaseDate[0];

              //check if there is a next token
              //if no nexttoken, break loop and stop querying MWS
              if(typeof(RESULT.ListOrdersByNextTokenResponse.ListOrdersByNextTokenResult[0].NextToken[0]) === 'undefined') {
                tokenTracker = -1;
                console.log('\nThere is no NextToken to continue querying.');
              }    
              else {
                nextToken = RESULT.ListOrdersByNextTokenResponse.ListOrdersByNextTokenResult[0].NextToken[0];
                tokenTracker = 2;
              }

              //3rd loop, iterates through every item in a specific order where OrderID = orderID
              productByOrderID(request, response, inDB, orderID, newDate);

            }  //OUTER LOOP END
            
          }
        }

        else {
          console.log('\nYou\'re being throttled in the NextToken query. Please try again later.\n');    
        }



      });

  }    //for loop ender  

}


//Makes Amazon MWS API calls when needed
function orders(request, response, CreatedAfter, CreatedBefore) {
  var tokenTracker = -1;
  var sf = new MWS.Orders.requests.ListOrders({'marketPlaceId': marketPlaceId});  

  //assigning values to ensure we only get amazon information with criteria below
  sf.params.MarketplaceId.value = marketPlaceId;
  var convertedCreatedAfter = changeDate(CreatedAfter),
      convertedCreatedBefore = changeDate(CreatedBefore),
      nextToken = '';
  sf.params.CreatedAfter.value =  convertedCreatedAfter; //'2014-07-10';
  sf.params.CreatedBefore.value = convertedCreatedBefore; //'2014-07-29';
  sf.params.FulfillmentChannel.value = 'AFN';
  sf.params.OrderStatus.value = 'Shipped';

  //making the request to amazon
  client.invoke(sf, function(RESULT){

    //console.dir(RESULT);

    if(typeof(RESULT.ListOrdersResponse) !== 'undefined'){
      var i = 0;

      //CHECK WHERE RESULT IS EMPTY 
      //RESULT.ErrorResponse.Error[0].Code[0] === 'RequestThrottled'
      //typeof(RESULT.ListOrdersResponse) === 'undefined'
      if(RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].length === 0) {
        console.log('There are no items ordered for specified date range.');
      }
      else {
        //OUTER LOOP START - looping through all orders in response
        for(i = 0; i < RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order.length; i++) {

          /* console.log(JSON.stringify(RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order[i])); 
          // returns the first order in response information */
          
          //stores order id number so inner loop can get individual products from the order
          //stores date order was made
          var orderID = RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order[i].AmazonOrderId[0],
              newDate = RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order[i].PurchaseDate[0];


          productByOrderID(request, response, inDB, orderID, newDate);
        }
        //OUTER LOOP END

        //check if there is a next token
        //if no nextToken, break loop and stop querying MWS
        if(typeof(RESULT.ListOrdersResponse.ListOrdersResult[0].NextToken[0]) !== 'undefined') {
            nextToken = RESULT.ListOrdersResponse.ListOrdersResult[0].NextToken[0];
            console.log('There is a next token');
            console.log(nextToken);
            tokenTracker = 2;
            listNextOrders(request, response, nextToken, 0);
        }   
        else {
            tokenTracker = -1;
            console.log('\nThere is no NextToken to continue ordering.\n');
        }

      }
    }
    else {
      console.log('\nYou\'re being throttled. Please try again later.\n');    
    }


  });
  

  //first 100 orders are done at this point and the next token is stored to var nextToken
  //the ListOrdersByNextToken function provided by amazon takes only 1 argument, the NextToken
  // console.log('attempting to check if tokenTracker === 2');
  // console.log(tokenTracker);
  // if (tokenTracker === 2) {
  //   //listNextOrders(nextToken);    
  // }

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
 * AKA list orders report
 */

 exports.list = function (req, res) {
  //if date doesn't exist in our DB, call orders with the dates that are missing
  //orders(req, res, req.user.fromTimeFrame, req.user.toTimeFrame);
  //date needs to be in a different format 
  //needs to be yyyy-mm-dd

  //console.log(req.user.toTimeFrame);

  // console.log(db.db.product.aggregate([
  //                    { $match: { sku: 'Wac-835175-Natural Nude-Size 38 ' } },
  //                    { $group: { total: { $sum: '$price' } } },
  //                    { $sort: { total: -1 } }
  //                  ]));


  product.find().sort('profitMargin').exec(function (err, products) {
    if (err) {
      console.log('fail');
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var filtered_products = products.filter(function (el) {
        console.log(el.cost);
        return (el.purchaseDate >= req.user.fromTimeFrame &&
               el.purchaseDate <= req.user.toTimeFrame);
      });
      res.json(filtered_products);
    }
  });
};

/**
 * list by sku 
 * AKA SKU Report
 */
exports.listBySku = function (req, res) {
  orders(req, res, req.user.fromTimeFrame, req.user.toTimeFrame);
  product.aggregate([
    {
      $group: {
        _id: '$sku',
        revenue: {$sum:  '$revenue'},
        quantity: {$sum: '$quantity'},
        brand: {$first: '$brand'},
        fbaAmt: {$sum: '$fbaAmt'},
        fbaPct: {$avg: '$fbaPct'},
        profitMargin: {$avg: '$profitMargin'},
        productMargin: {$avg: '$productMargin'},
        cost: {$first: '$cost'}
      }
    },
    {
      $sort: {
        profitMargin: 1,
        _id: 1
      }
    }
    ], function (err, result) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        else {
          //console.dir(result);
          res.json(result);
        }
    });
};

/**
 * list by brand
 * AKA Brand report
 */
exports.listByBrand = function (req, res, searchBrand) {
  orders(req, res, req.user.fromTimeFrame, req.user.toTimeFrame);
  product.aggregate([
    {
      $match: {
        brand: searchBrand
      }
    },
    {
      $group: {
        _id: '$brand',
        revenue: {$sum:  '$revenue'},
        quantity: {$sum: '$quantity'},
        fbaAmt: {$sum: '$fbaAmt'},
        fbaPct: {$avg: '$fbaPct'},
        profitMargin: {$avg: '$profitMargin'},
        productMargin: {$avg: '$productMargin'}
      }
    },
    {
      $sort: {
        profitMargin: 1,
        _id: 1
      }
    }
    ], function (err, result) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        else {
          // console.dir(result);
          res.json(result);
        }
    });
};

/**
 * list by brand and sku
 * AKA click brand on sku report
 */
exports.listByBrandAndSku = function (req, res, searchBrand) {
  product.aggregate([
    {
      $match: {
        brand: searchBrand
      }
    },
    {
      $group: {
        _id: '$sku',
        revenue: {$sum:  '$revenue'},
        quantity: {$sum: '$quantity'},
        fbaAmt: {$sum: '$fbaAmt'},
        fbaPct: {$avg: '$fbaPct'},
        profitMargin: {$avg: '$profitMargin'},
        productMargin: {$avg: '$productMargin'}
      }
    },
    {
      $sort: {
        profitMargin: 1,
        _id: 1
      }
    }
    ], function (err, result) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        else {
          //console.dir(result);
          res.json(result);
        }
    });
};

/**
 * calculate total revenue
 * for the dashboard
 */
// exports.calculateTotalRevenue = function (req, res, searchBrand) {
//   product.aggregate([
//     {
//       $sum:  '$revenue'
//     }
//     ], function (err, result) {
//         if (err) {
//           return res.status(400).send({
//             message: errorHandler.getErrorMessage(err)
//           });
//         }
//         else {
//           console.dir(result);
//           res.json(result);
//         }
//     });
// };

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
