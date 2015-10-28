'use strict';

var config = require('../../../../config/env/local');

var MWS = require('mws-sdk'),
    client = new MWS.Client(config.accessKeyId, config.secretAccessKey, config.merchantId, {}),
    marketPlaceId = 'ATVPDKIKX0DER';


exports.orders = function(request, response) {
	var sf = new MWS.Orders.requests.ListOrders({'marketPlaceId': marketPlaceId});
	sf.params.MarketplaceId.value = marketPlaceId;
	sf.params.CreatedAfter.value = '2014-07-13';
	client.invoke(sf, function(RESULT){
  		console.log('--------');
  		console.log(JSON.stringify(RESULT));
  		console.log('--------');
	});
};
