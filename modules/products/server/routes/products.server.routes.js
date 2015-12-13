'use strict';

/**
 * Module dependencies.
 */
var products = require('../controllers/products.server.controller');
var mws = require('../controllers/mws.server.controller');


module.exports = function (app) {
  // products collection routes
  app.route('/api/products')
    .get(products.list)
    .post(products.create);

  // sku route
  app.route('/api/sku')
    .get(products.listBySku);

  // brand route
  app.route('/api/brands')
    .get(products.listByBrand);

  // brand by sku route
  app.route('/api/brand')
    .get(products.listByBrandAndSku);

  // // makes api call for new timeframe
  // app.route('/api/mws')
  //   .get(products.orders);

  // calculate total revenue
  app.route('/api/revenue')
    .get(products.calculateTotalRevenue);

  // Single product routes
  app.route('/api/products/:productId')
    .get(products.read)
    .put(products.update)
    .delete(products.delete);



  // Finish by binding the product middleware
  app.param('productId', products.productByID);
};
