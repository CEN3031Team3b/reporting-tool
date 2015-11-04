'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise('not-found');

    // Home state routing
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'modules/core/views/home.client.view.html'
      })
      .state('home#features', {
        url: '/#features',
        templateUrl: 'modules/core/views/home.client.view.html'
      })
      .state('home#preview', {
        url: '/#preview',
        templateUrl: 'modules/core/views/home.client.view.html'
      })
      .state('home#contact', {
        url: '/#contact',
        templateUrl: 'modules/core/views/home.client.view.html'
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: 'modules/core/views/404.client.view.html'
      });
  }
]);
