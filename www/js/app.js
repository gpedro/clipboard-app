// Ionic Starter App
/* global angular, cordova, StatusBar */
'use strict';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.factory('QuestionService', ['$http', function ($http) {
  function find() {
    return $http.get('js/auditoria.json');
  }

  return {
    find: find
  };
}])
.controller('MainController', ['$scope', 'QuestionService', function ($scope, QuestionService) {
  var vm = this;
  vm.question = '';
  vm.limpar = function () {
    vm.question = '';
    vm.result = [];
  };
  $scope.$watch('vm.question', function (value, old) {
    if (value !== old && value !== '') {
      QuestionService.find().then(function (result) {
        vm.result = result.data.filter(function (item) {
          return item.question.toLowerCase().indexOf(value.toLowerCase()) != -1;
        });
      });
    }
  });

}]);
//.controller('', function )
