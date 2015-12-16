'use strict';

(function() {
	describe('TabController', function() {
    module('products');

		var $controller;

		inject(function(_$controller_) {
			$controller = _$controller_;
		});

    beforeEach(function() {
      var controller = $controller('TabController');
    });

		it('should have the right value for this.tab', function() {
			expect(controller.tab).toEqual(1);
		});
    it('should set this.tab value after calling this.setTab(value)', function() {
      controller.setTab(5);
      expect(controller.tab).toEqual(5);
    });
    it('should return true if tabname === this.tab', function() {
      controller.setTab(1);
      expect(controller.isSet(1)).toBe(1);
    });
	});

  describe('productsController', function() {
    module('products');

    var $controller;

    inject(function(_$controller_) {
      $controller = _$controller_;
    });

    beforeEach(function() {
      var $scope = {};
      var controller = $controller('productsController', { $scope: $scope });
    });

    it("should set the proper index to false when $scope.cancel is called", function() {
      $scope.cancel(0);
      expect($scope.editing[0]).toBe(false);
    });
    it("should increment $scope.totalDisplayed by 20 when $scope.loadMore is called", function() {
      $scope.totalDisplayed = 0;
      $scope.loadMore();
      expect($scope.totalDisplayed).toEqual(20);
    });
    it("should set $scope.loadInfo to false when $scope.findSKU, $scope.findBrand, or $scope.findRevenue is called", function() {
      $scope.loadInfo = true;
      $scope.findSKU();
      expect($scope.loadInfo).toBe(false);
      $scope.loadInfo = true;
      $scope.findBrand();
      expect($scope.loadInfo).toBe(false);
      $scope.loadInfo = true;
      $scope.findRevenue();
      expect($scope.loadInfo).toBe(false);
    });
  });
}());