define([
  'require',
  'angular',
  'angularTemplateCache',
  'text!./about.tpl.html'
], function (require, ng, angularTemplateCache, aboutTpl) {
  'use strict';
  var templates = {
      'about': {
        url: './src/app/about/about.tpl.html',
        template: aboutTpl
      }
    };

  var module = ng.module('app.about.partials', [
  ]);
  module.run(function($templateCache){
      angularTemplateCache.registerTemplates(ng, $templateCache, templates);
  });

  return module;
});