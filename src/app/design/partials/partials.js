define([
  'require',
  'angular',
  'angularTemplateCache',
  'text!./design.tpl.html'
], function (require, ng, angularTemplateCache, deisgnTpl) {
  'use strict';
  var templates = {
      'design': {
        url: './src/app/design/partials/design.tpl.html',
        template: deisgnTpl
      }
    };

  var module = ng.module('app.design.partials', [
  ]);
  module.run(function($templateCache){
      angularTemplateCache.registerTemplates(ng, $templateCache, templates);
  });

  return module;
});