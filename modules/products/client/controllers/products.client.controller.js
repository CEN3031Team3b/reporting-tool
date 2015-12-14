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
//fjdslk
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

    //may not need this
   //  $scope.updateCost = function(productToChange, index) {
   //    //console.log('im being called');

   //    var elementID ='cost' + index;
   //    var element = document.getElementById(elementID).value; 
   //    element = Number(element); 
   //    //console.log('New cost to be set: ' + element);

   //   productToChange.cost = element;
   //   //console.log('cost set!');
   // };

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
        console.log('index');
        var product = $scope.products[index];
        products.update();
        $scope.editing[index] = false;
      };
      // $scope.update = function (index) {
      //   var product = $scope.products[index];

      //   product.$update(function () {
      //     $location.path('products/' + product.sku);
      //   }, function (errorResponse) {
      //     $scope.error = errorResponse.data.message;
      //   });
      // };
      $scope.edit = function(index){
        $scope.editing[index] = angular.copy($scope.products[index]);
      };
    // $scope.updateProductProfile = function (x, index, isValid) {
    //   if (isValid) {
    //     var productToChange = x;
    //     //console.log(x);
    //     $scope.updateCost(productToChange, index);

    //     var updatedProduct = new products(productToChange);
    //     console.log(updatedProduct);

    //     $http.post('/api/products/' + updatedProduct._id, updatedProduct)
    //     .then(function(result) {
    //       console.log(result);
    //       //console.log('Success Post'); 
    //     });    
    //   }
    // };

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
