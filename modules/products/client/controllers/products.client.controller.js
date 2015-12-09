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
angular.module('products').controller('productsController', ['$scope', '$stateParams', '$location', 'Authentication', 'products', '$http',
  function ($scope, $stateParams, $location, Authentication, products, $http) {
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
      var product = $scope.products;

      product.$update(function () {
        $location.path('products/' + product._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    //may not need this
    $scope.updateCost = function(productToChange, index) {
      console.log('im being called');

      var elementID ='cost' + index;
      var element = document.getElementById(elementID).value; 
      element = Number(element); 
      console.log('New cost to be set: ' + element);

     productToChange.cost = element;
     console.log('cost set!');

    };

    

    $scope.updateProductProfile = function (x, index, isValid) {
      if (isValid) {
        var productToChange = x;
        console.log(x);
        $scope.updateCost(productToChange, index);

        var updatedProduct = new products(productToChange);
        console.log(updatedProduct);

        $http.post('/api/products/' + updatedProduct._id, updatedProduct)
        .then(function(result) {
          console.log(result);
          console.log("Success Post"); 
        });    
      }
    };

    // $scope.update = function () {
    //   var product = $scope.product;
    //   updateCost();
    //   product.update(function () {
    //     $location.path('products/' + product._id);
    //   }, function (errorResponse) {
    //     $scope.error = errorResponse.data.message;
    //   });
    // };


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

    // Find a list of skus
    $scope.findSKU = function () {
      $http({method: 'GET', url: 'api/sku'}).then(function(response) {
        $scope.products = response.data;
        $scope.loadInfo = false;
      });
      console.log($scope.products);
    };

    // Find a list of brands (brand report )
    $scope.findBrand = function () {
      $http({method: 'GET', url: 'api/brands'}).then(function(response) {
        $scope.products = response.data;
        $scope.loadInfo = false;
      });
      console.log($scope.products);
    };

    // Find a list of skus for a brand
    $scope.findBrandSKUs = function () {
      $http({method: 'GET', url: 'api/brand'}).then(function(response) {
        $scope.products = response.data;
        $scope.loadInfo = false;
      });
    };

    // Find existing product
    $scope.findOne = function () {
      $scope.product = products.get({
        productId: $stateParams.productId
      });
    };
  }]);
