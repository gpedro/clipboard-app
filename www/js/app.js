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
  vm.filter = 'question';
  vm.keyword = '';

  vm.clear = function () {
    vm.keyword = '';
    vm.result = [];
  };

  var search = function (value) {
    QuestionService.find().then(function (result) {
      vm.result = result.data.filter(function (item) {
        var field = vm.filter;
        var index = item[field];
        var match = index.toLowerCase().indexOf(value.toLowerCase());
        var found =  match != -1;
        if (found) {
          item[field] = index.substr(0, match) + '<span class="highlight">' + index.substr(match, value.length) +  '</span>' + index.substr(match + value.length) ;
        }

        return found;
      });
    });
  };

  vm.search = function () {
    search(vm.keyword);
  };

  vm.changeFilter = function(filter){
    vm.filter = filter;
    vm.search();
  };

  vm.isSelected = function(filter){
    return vm.filter === filter;
  };

  $scope.$watch('vm.keyword', function (value, old) {
    if (value !== old && value !== '') {
      search(value);
    }
  });

}]);
