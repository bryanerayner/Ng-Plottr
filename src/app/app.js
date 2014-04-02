define([
    'angular',
    'angularBootstrap',
    'angularUIRouter',
    'angularUIUtils',
    'plusOne',
    './home/index',
    './design/index',
    './about/index'
], function (ng) {
    'use strict';

    var module = ng.module('app', [
        'app.home',
        'app.about',
        'app.design',
        'ui.router'
    ]);

    module.config(
        [ '$stateProvider', '$urlRouterProvider',

        function ( $stateProvider, $urlRouterProvider ) {
        $urlRouterProvider.otherwise( '/home' );
    }]);

    module.controller( 'AppCtrl',
        ['$scope', '$location',

        function ( $scope, $location ) {
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if ( angular.isDefined( toState.data.pageTitle ) ) {
                $scope.pageTitle = toState.data.pageTitle + ' | Angular-Enterprise-Kickstart' ;
            }
        });
    }]);

    return module;
});