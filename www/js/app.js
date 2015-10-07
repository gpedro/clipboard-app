// Ionic Starter App
/* global angular, cordova, StatusBar */
'use strict';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .factory('QuestionService', ['$http', function ($http) {
    function find() {
      return $http.get('js/auditoria.json');
    }

    function findByKeyword(keyword, field) {
      return this.find().then(function (result) {
        return result.data.filter(function (item) {
          var index = item[field];
          var match = index.toLowerCase().indexOf(keyword.toLowerCase());
          var found = match != -1;
          if (found) {
            item[field] = index.substr(0, match) + '<span class="highlight">' + index.substr(match, keyword.length) + '</span>' + index.substr(match + keyword.length);
          }
          return found;
        });
      });
    }

    return {
      find: find,
      findByKeyword: findByKeyword
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

    var search = function () {
      QuestionService.findByKeyword(vm.keyword, vm.filter).then(function (result) {
        vm.result = result;
      });
    };

    vm.search = search;

    vm.changeFilter = function (filter) {
      vm.filter = filter;
      search();
    };

    vm.isSelected = function (filter) {
      return vm.filter === filter;
    };

    $scope.$watch('vm.keyword', function (value, old) {
      if (value !== old && value !== '') {
        search();
      }
    });

  }]);
