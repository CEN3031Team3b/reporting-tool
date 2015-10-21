'use strict';

// Configuring the products module
angular.module('products').run(['Menus',
  function (Menus) {
    // Add the products dropdown item
    Menus.addMenuItem('topbar', {
      title: 'products',
      state: 'products',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'List products',
      state: 'products.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Create products',
      state: 'products.create'
    });
  }
]);
