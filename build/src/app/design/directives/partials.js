/**
 * Created by bryanerayner on 2014-04-01.
 */
define([
    'require',
    'angular',
    'angularTemplateCache',
    'text!./design-node.tpl.html'
], function (require, ng, angularTemplateCache, deisgnNodeTpl) {
    'use strict';
    var templates = {
        'design': {
            url: './src/app/design/directives/design-node.tpl.html',
            template: deisgnNodeTpl
        }
    };

    var module = ng.module('app.design.directives.partials', [
    ]);
    module.run(function($templateCache){
        angularTemplateCache.registerTemplates(ng, $templateCache, templates);
    });

    return module;
});