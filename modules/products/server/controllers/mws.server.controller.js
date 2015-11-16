'use strict';

// variables for configuration
var config = require('../../../../config/env/local'),
    productServer = require('./products.server.controller'),
    path = require('path'),
    mongoose = require('mongoose'),
    product = mongoose.model('product'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

// variables to set up mws client
var MWS = require('mws-sdk'),
    client = new MWS.Client(config.accessKeyId, config.secretAccessKey, config.merchantId, {}),
    marketPlaceId = 'ATVPDKIKX0DER',
    orderID = '';


exports.orders = function(request, response) {
	var sf = new MWS.Orders.requests.ListOrders({'marketPlaceId': marketPlaceId});
	sf.params.MarketplaceId.value = marketPlaceId;
	sf.params.CreatedAfter.value = '2014-07-13';
  sf.params.FulfillmentChannel.value = 'AFN';
  sf.params.OrderStatus.value = 'Shipped';
	client.invoke(sf, function(RESULT){
      //response.send(RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order[0]);
      var i = 0;

      for(i = 0; i < RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order.length; i++) {

        console.log(JSON.stringify(RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order[i])); // returns the first order in response information
        orderID = RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order[i].AmazonOrderId[0];
        console.log(orderID);
      
        // api call for the list of items in a particular order
        var sf1 = new MWS.Orders.requests.ListOrderItems({'orderID': orderID});
        sf1.params.AmazonOrderId.value = orderID;
        client.invoke(sf1, function(RESULT){
          //response.send(RESULT.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[0]);
          var newSku = RESULT.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[0].SellerSKU[0],
              newQty = RESULT.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[0].QuantityShipped[0],
              newPrice = RESULT.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[0].ItemPrice[0].Amount[0];

          //creating new product
          var newProduct = new product({
            sku: newSku,
            quantity: newQty,
            price: newPrice
          });

          //NOT WORKING BECAUSE PRODUCTS NEED AT LEAST ONE DOCUMENT

          //saving new product to local database
          newProduct.save(function (err) {
            if (err) {
              return response.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              response.json(product);
            }
          });

          //response.send(newProduct);
          // response.send(qty);
          // response.send(price);
          console.log('SKU: ' + newSku);
          console.log('qty: ' + newQty);
          console.log('price: ' + newPrice);
           //RESULT.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[0] // returns first item of order
        });
      }

      

	});
};
