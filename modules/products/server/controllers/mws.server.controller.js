'use strict';

var config = require('../../../../config/env/local');
    //db = require();


var MWS = require('mws-sdk'),
    client = new MWS.Client(config.accessKeyId, config.secretAccessKey, config.merchantId, {}),
    marketPlaceId = 'ATVPDKIKX0DER';


exports.orders = function(request, response) {
	var sf = new MWS.Orders.requests.ListOrders({'marketPlaceId': marketPlaceId});
	sf.params.MarketplaceId.value = marketPlaceId;
	sf.params.CreatedAfter.value = '2014-07-13';
	client.invoke(sf, function(RESULT){
  		console.log('--------');
  		//console.log(JSON.stringify(RESULT)); // displays result to console
  		console.log('--------');
  		//response.send(RESULT['ListOrdersResult']['Orders']['Order']['LastestShipDate'][0]); // displays result to page
      //response.send(RESULT);
      //var parsedData = JSON.parse(RESULT);
      //var dates = parsedData[0];
      //console.log(dates);
      // response.send(RESULT.ListOrdersResponse.ListOrdersResult.Orders.Order['LatestShipDate']);
      response.send(RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order[0]);
      console.log(JSON.stringify(RESULT.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order[0]));


	});
};
