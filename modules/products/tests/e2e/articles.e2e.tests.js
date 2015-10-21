'use strict';

describe('products E2E Tests:', function () {
  describe('Test products page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/products');
      expect(element.all(by.repeater('product in products')).count()).toEqual(0);
    });
  });
});
