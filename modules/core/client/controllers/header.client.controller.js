'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    var button = document.getElementById("info");
var myDiv = document.getElementById("myDiv");

function show() {
    myDiv.style.visibility = "visible";
}

function hide() {
    myDiv.style.visibility = "hidden";
}

function toggle() {
    if (myDiv.style.visibility === "hidden") {
        show();
    } else {
        hide();
    }
}

hide();

button.addEventListener("click", toggle, false);
  }
]);
