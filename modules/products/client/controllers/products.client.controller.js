'use strict';


angular.module('products').controller('TabController', function(){
    this.tab = 1;
    //sets the tab for the dashboard view
    this.setTab = function(newValue){
      this.tab = newValue;
    };
    //returns true if the tab is set
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

      //controls if you are in editing/input mode or not
      $scope.editing = [];
      //submits
      $scope.save = function(){
        if(!$scope.newProduct || $scope.newProduct.length < 1) return;
        var product = new products({ name: $scope.newProduct, completed: false });

        product.$save(function(){
          $scope.products.push(product);
          $scope.newProduct = ''; // clear textbox
        });
      };

      //attempts to update the cost/brand in the backend
      $scope.update = function(index){
        console.log('index');
        var product = $scope.products[index];
        products.update();
        $scope.editing[index] = false;
      };

      //allows user to input a new Brand or Cost value for the product
      $scope.edit = function(index){
        $scope.editing[index] = angular.copy($scope.products[index]);
      };

      //allows user to exit the input mode
      $scope.cancel = function(index){
        $scope.products[index] = angular.copy($scope.editing[index]);
        $scope.editing[index] = false;
      };


    $scope.totalDisplayed = 20;
    //allows the user to load the next 20 products/brands
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

    $scope.totalRevenue = 0;
    //finds the total revenue
    $scope.findRevenue = function () {
      $http({method: 'GET', url: 'api/revenue'}).then(function(response) {
        $scope.totalRevenue = response.data[0].revenue;
        $scope.loadInfo = false;
      });
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
