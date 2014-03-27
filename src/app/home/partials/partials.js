define([
  'require',
  'angular',
  'angularTemplateCache',
  'text!./home.tpl.html'
], function (require, ng, angularTemplateCache, homeTpl) {
  'use strict';
  var templates = {
      'home': {
        url: './src/app/home/partials/home.tpl.html',
        template: homeTpl
      }
    };

  var module = ng.module('app.home.partials', [
  ]);
  module.run(function($templateCache){
      angularTemplateCache.registerTemplates(ng, $templateCache, templates);
  });

  return module;
});