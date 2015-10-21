'use strict';

// products controller
angular.module('products').controller('productsController', ['$scope', '$stateParams', '$location', 'Authentication', 'products',
  function ($scope, $stateParams, $location, Authentication, products) {
    $scope.authentication = Authentication;

    // Create new product
    $scope.create = function () {
      // Create new product object
      var product = new products({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      product.$save(function (response) {
        $location.path('products/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing product
    $scope.remove = function (product) {
      if (product) {
        product.$remove();

        for (var i in $scope.products) {
          if ($scope.products[i] === product) {
            $scope.products.splice(i, 1);
          }
        }
      } else {
        $scope.product.$remove(function () {
          $location.path('products');
        });
      }
    };

    // Update existing product
    $scope.update = function () {
      var product = $scope.product;

      product.$update(function () {
        $location.path('products/' + product._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of products
    $scope.find = function () {
      $scope.products = products.query();
    };

    // Find existing product
    $scope.findOne = function () {
      $scope.product = products.get({
        productId: $stateParams.productId
      });
    };
  }
]);
