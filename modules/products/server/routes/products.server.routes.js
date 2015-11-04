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

  // Single product routes
  app.route('/api/products/:productId')
    .get(products.read)
    .put(products.update)
    .delete(products.delete);

  app.route('/api/mws/orders')
    .get(mws.orders)
    //.get(mws.orderItems)
    .post(products.create);

  // app.route('/api/mws/orders')
  //   //.get(mws.orders)
  //   .get(mws.orderItems);

  // Finish by binding the product middleware
  app.param('productId', products.productByID);
};
