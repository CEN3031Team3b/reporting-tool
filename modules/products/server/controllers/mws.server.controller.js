'use strict';

// variables for configuration
var config = require('../../../../config/env/local'),
    path = require('path'),
    mongoose = require('mongoose'),
    product = mongoose.model('product'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

// variables to set up mws client
var MWS = require('mws-sdk'),
    client = new MWS.Client(config.accessKeyId, config.secretAccessKey, config.merchantId, {}),
    marketPlaceId = 'ATVPDKIKX0DER';

//function that makes call to amws for specified date range
exports.orders = function(request, response) {
	var sf = new MWS.Orders.requests.ListOrders({'marketPlaceId': marketPlaceId});
	
  //assigning values to ensure we only get amazon information with criteria below
  sf.params.MarketplaceId.value = marketPlaceId;
	sf.params.CreatedAfter.value = '2014-07-13';
  sf.params.FulfillmentChannel.value = 'AFN';
  sf.params.OrderStatus.value = 'Shipped';

  //making the request to amazon
	client.invoke(sf, function(RESULT){
      var i = 0;

      //OUTER LOOP START - looping through all orders in response
      for(i = 0; i < RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order.length; i++) {

        /* console.log(JSON.stringify(RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order[i])); // returns the first order in response information */
        
        //stores order id number so inner loop can get individual products from the order
        // stores date order was made
        var orderID = RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order[i].AmazonOrderId[0],
            newDate = RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order[i].PurchaseDate[0];
        /*console.log(orderID);*/
      
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
            newProduct.user = request.user;

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

            console.log('SKU: ' + newSku);
            console.log('qty: ' + newQty);
            console.log('price: ' + newPrice);
            console.log('date: ' + newDate);
            /*RESULT.ListOrderItemsResponse.ListOrderItemsResult[0].OrderItems[0].OrderItem[0] // returns first item of order*/
          }
          //INNER LOOP1 END
        });
      }
      //OUTER LOOP END
	});
};
