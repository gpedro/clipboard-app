// Ionic Starter App
/* global angular, cordova, StatusBar */
'use strict';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])
  .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {

    // Default Route
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('home', {
      url: '/',
      controller: 'DisciplineController as vm',
      templateUrl: 'views/disciplines.html'
    });

    $stateProvider.state('questions', {
      url: '/discipline/:index',
      controller: 'QuestionsController as vm',
      templateUrl: 'views/questions.html',
      resolve: {
        questions: ['DisciplineService', '$stateParams', function (DisciplineService, $stateParams) {
          return DisciplineService.getQuestionsByIndex($stateParams.index).then(function (result) {
            return result.data;
          });
        }],

        discipline: ['DisciplineService', '$stateParams', function (DisciplineService, $stateParams) {
          return DisciplineService.findByIndex($stateParams.index).then(function (result) {
            return result.name;
          });
        }]
      }
    });
  }])
  .run(['$ionicPlatform', function ($ionicPlatform) {
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
  }])
  .filter('shuffle', function () {
    // -> Fisher–Yates shuffle algorithm
    var shuffleArray = function(array) {
      var m = array.length, t, i;

      // While there remain elements to shuffle
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }

      return array;
    };

    return function (input) {
      if (input instanceof Array) {
        return shuffleArray(input);
      }

      return input;
    };
  })
  .factory('DisciplineService', ['$http', function ($http) {
    function findAll() {
      return $http.get('js/disciplines.json');
    }

    function findByIndex(index) {
      return findAll().then(function (result) {
        return result.data[index];
      });
    }

    function getQuestionsByIndex(index) {
      return findByIndex(index).then(function (result) {
        return $http.get('js/' + result.data);
      });
    }

    return {
      findAll: findAll,
      findByIndex: findByIndex,
      getQuestionsByIndex: getQuestionsByIndex
    };
  }])
  .controller('DisciplineController', ['DisciplineService', '$state', function (DisciplineService, $state) {
    var vm = this;

    vm.showQuestions = function (index) {
      $state.go('questions', { index: index });
    };

    DisciplineService.findAll().then(function (result) {
      vm.disciplines = result.data;
    });
  }])
  .controller('QuestionsController', ['questions', 'discipline', '$scope', function (questions, discipline, $scope) {
    var vm = this;

    vm.discipline = discipline;
    vm.filter = 'question';
    vm.keyword = '';

    vm.clear = function () {
      vm.keyword = '';
      vm.result = [];
    };

    var search = function () {
      var keyword = vm.keyword;
      var questionsShadow = angular.copy(questions);
      var field = vm.filter;
      vm.result = questionsShadow.filter(function (item) {
        var index = item[field];
        var match = index.toLowerCase().indexOf(keyword.toLowerCase());
        var found = match != -1;
        if (found) {
          item[field] = index.substr(0, match) + '<span class="highlight">' + index.substr(match, keyword.length) + '</span>' + index.substr(match + keyword.length);
        }
        if (field === 'question' && item.hasOwnProperty('itens')) {
          var itens = item.itens;
          itens.forEach(function (itemDesc, index) {
            match = itemDesc.toLowerCase().indexOf(keyword.toLowerCase());
            found = match != -1;
            if (found) {
              item.itens[index] = itemDesc.substr(0, match) + '<span class="highlight">' + itemDesc.substr(match, keyword.length) + '</span>' + itemDesc.substr(match + keyword.length);
            }
          });

        }
        return found;
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
