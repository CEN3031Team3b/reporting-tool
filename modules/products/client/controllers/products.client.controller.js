'use strict';

angular.module('products').controller('TabController', function(){
    this.tab = 1;

    this.setTab = function(newValue){
      this.tab = newValue;
    };

    this.isSet = function(tabName){
      return this.tab === tabName;
    };
  });

// products controller
angular.module('products').controller('productsController', ['$scope', '$stateParams', '$location', 'Authentication', 'products',
  function ($scope, $stateParams, $location, Authentication, products) {
    $scope.authentication = Authentication;
    $scope.loadInfo = true;
    // Create new product
    $scope.create = function () {

        // Redirect after save
        product.$save(function (response) {
          $location.path('products/' + response._id);

          // Clear form fields
          $scope.sku = '';
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

    $scope.totalDisplayed = 20;

    $scope.loadMore = function () {
      $scope.totalDisplayed += 20;  
    };
    

    // Find a list of products
    $scope.find = function () {
      $scope.products = products.query(function(){
        $scope.loadInfo = false;
      });
      console.log($scope.products);
    };

    // Find existing product
    $scope.findOne = function () {
      $scope.product = products.get({
        productId: $stateParams.productId
      });
    };
  }]);
