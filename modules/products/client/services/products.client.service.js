'use strict';

//products service used for communicating with the products REST endpoints
angular.module('products').factory('products', ['$resource',
  function ($resource) {
    return $resource('api/products/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
