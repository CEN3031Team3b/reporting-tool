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
    $scope.updateProduct = function (isValid) {
      
      if (isValid) {
        $scope.success = $scope.error = null;
        var product = new product($scope.products);

        product.$update(function (response) {
          $scope.success = true;
          $scope.products = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };  


      $scope.editing = [];
      $scope.save = function(){
        if(!$scope.newProduct || $scope.newProduct.length < 1) return;
        var product = new products({ name: $scope.newProduct, completed: false });

        product.$save(function(){
          $scope.products.push(product);
          $scope.newProduct = ''; // clear textbox
        });
      };
      $scope.update = function(index){
        var product = $scope.products[index];
        products.update({id: product._id}, product);
        $scope.editing[index] = false;
      };

      $scope.edit = function(index){
        $scope.editing[index] = angular.copy($scope.products[index]);
      };

      $scope.cancel = function(index){
        $scope.products[index] = angular.copy($scope.editing[index]);
        $scope.editing[index] = false;
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
      //console.log($scope.products);
    };

    // Find a list of skus
    $scope.findSKU = function () {
      $http({method: 'GET', url: 'api/sku'}).then(function(response) {
        $scope.products = response.data;
        $scope.loadInfo = false;
      });
      //console.log($scope.products);
    };

    // Find a list of brands (brand report )
    $scope.findBrand = function () {
      $http({method: 'GET', url: 'api/brands'}).then(function(response) {
        $scope.products = response.data;
        $scope.loadInfo = false;
      });
      //console.log($scope.products);
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
