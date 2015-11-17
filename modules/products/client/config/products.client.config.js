'use strict';

// Configuring the products module
angular.module('products').run(['Menus',
  function (Menus) {
    // Add the products dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Navigation',
      state: 'products',
      type: 'dropdown'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Sku Report',
      state: 'products.sku'
    });

    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Brand Report',
      state: 'products.brand'
    });
    Menus.addMenuItem('topbar', {
      title: 'Set Threshold',
      state: 'products',
      type: 'button'
    });
    Menus.addMenuItem('topbar', {
      title: 'Set Timeframe',
      state: 'products',
      type: 'button'
    });
  }
]);
