'use strict';

(function () {
  // products Controller Spec
  describe('products Controller Tests', function () {
    // Initialize global variables
    var productsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      products,
      mockproduct;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _products_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      products = _products_;

      // create mock product
      mockproduct = new products({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An product about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the products controller.
      productsController = $controller('productsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one product object fetched from XHR', inject(function (products) {
      // Create a sample products array that includes the new product
      var sampleproducts = [mockproduct];

      // Set GET response
      $httpBackend.expectGET('api/products').respond(sampleproducts);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.products).toEqualData(sampleproducts);
    }));

    it('$scope.findOne() should create an array with one product object fetched from XHR using a productId URL parameter', inject(function (products) {
      // Set the URL parameter
      $stateParams.productId = mockproduct._id;

      // Set GET response
      $httpBackend.expectGET(/api\/products\/([0-9a-fA-F]{24})$/).respond(mockproduct);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.product).toEqualData(mockproduct);
    }));

    describe('$scope.craete()', function () {
      var sampleproductPostData;

      beforeEach(function () {
        // Create a sample product object
        sampleproductPostData = new products({
          title: 'An product about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An product about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (products) {
        // Set POST response
        $httpBackend.expectPOST('api/products', sampleproductPostData).respond(mockproduct);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the product was created
        expect($location.path.calls.mostRecent().args[0]).toBe('products/' + mockproduct._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/products', sampleproductPostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock product in scope
        scope.product = mockproduct;
      });

      it('should update a valid product', inject(function (products) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/products\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/products/' + mockproduct._id);
      }));

      it('should set scope.error to error response message', inject(function (products) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/products\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(product)', function () {
      beforeEach(function () {
        // Create new products array and include the product
        scope.products = [mockproduct, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/products\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockproduct);
      });

      it('should send a DELETE request with a valid productId and remove the product from the scope', inject(function (products) {
        expect(scope.products.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.product = mockproduct;

        $httpBackend.expectDELETE(/api\/products\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to products', function () {
        expect($location.path).toHaveBeenCalledWith('products');
      });
    });
  });
}());
