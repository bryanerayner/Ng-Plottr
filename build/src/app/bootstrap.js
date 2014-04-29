/**
 * bootstraps angular onto the window.document node
 */
define([
    'require',
    'angular',
    'app',
    'domReady'
], function (require, ng, app, domReady) {
    'use strict';

    domReady(function() {
        ng.bootstrap(document, [app.name]);
    });

});