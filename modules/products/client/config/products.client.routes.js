'use strict';

// Setting up route
angular.module('products').config(['$stateProvider',
  function ($stateProvider) {
    // products state routing
    $stateProvider
      .state('products', {
        abstract: true,
        url: '/products',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('products.list', {
        url: '',
        templateUrl: 'modules/products/views/list-products.client.view.html'
      })
      .state('products.create', {
        url: '/create',
        templateUrl: 'modules/products/views/create-product.client.view.html'
      })
      .state('products.brand', {
        url: '/brand',
        templateUrl: 'modules/products/views/brand-products.client.view.html'
      })
      .state('products.sku', {
        url: '/sku',
        templateUrl: 'modules/products/views/sku-products.client.view.html'
      })
      .state('products.view', {
        url: '/:productId',
        templateUrl: 'modules/products/views/view-product.client.view.html'
      })
      .state('products.edit', {
        url: '/:productId/edit',
        templateUrl: 'modules/products/views/edit-product.client.view.html'
      });
  }
]);
