define([
    'angular',
    'angularBootstrap',
    'angularUIRouter',
    'restangular',
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
        'restangular',
        'ui.router'
    ]);

    module.config(
        [ '$stateProvider', '$urlRouterProvider', 'RestangularProvider',

        function ( $stateProvider, $urlRouterProvider , RestangularProvider) {
        $urlRouterProvider.otherwise( '/home' );
            RestangularProvider.setBaseUrl('/api/v1');
            RestangularProvider.setRequestSuffix('.json');

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