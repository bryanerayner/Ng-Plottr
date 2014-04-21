var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/spec\.js$/.test(file)) {
        console.log(file);
      tests.push(file);
    }
  }
}


require.config({
   // Karma serves files from '/base'
   baseUrl: '/base/src/app',

  'generateSourceMaps': true,
  'useSourceUrl': true,

  paths: {
    angular: '../../vendor/angular/angular',
    angularResource: '../../vendor/angular-resource/angular-resource',
    angularBootstrap: '../../vendor/angular-bootstrap/ui-bootstrap-tpls.min',
    angularUIRouter: '../../vendor/angular-ui-router/release/angular-ui-router.min',
    angularUIUtils: '../../vendor/angular-ui-utils/ui-utils.min',
    angularMoment: '../../vendor/angular-moment/angular-moment.min',
    angularMocks: '../../vendor/angular-mocks/angular-mocks',
    restangular: '../../vendor/restangular/dist/restangular.min',
    domReady: '../../vendor/requirejs-domready/domReady',
    text: '../../vendor/requirejs-text/text',
    lodash: '../../vendor/lodash/dist/lodash.min',
    moment: '../../vendor/moment/min/moment.min',
    placeholders: '../../vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min',
    plusOne: '../common/plusOne/plusOne',
    angularTemplateCache: '../common/angular-templatecache/angular-templatecache',
    keystateService:'../common/keystate-service/keystate-srv',
      mousetrap:'../common/mousetrap/mousetrap',
      jrClass:'../common/jrClass/jrClass',
      mouseEventsService:'../common/mouseEvents-service/mouseEvents-srv'
  },
  shim: {
      'angular': { exports: 'angular' },
      'angularBootstrap': { deps: ['angular'] },
      'angularUIRouter': { deps: ['angular'] },
      'angularUIUtils': { deps: ['angular'] },
      'angularMoment': { deps: ['angular'] },
      'angularMocks': { deps: ['angular'] },

      'restangular': {
          'deps': [
              'angular',
              'lodash'
          ]
      },
      'placeholders': { deps: ['angular'] },
      'plusOne': { deps: ['angular'] },
      'keystateService': {deps: ['angular', 'lodash'] },
      'mouseEventsService': {deps: ['angular', 'lodash', 'jrClass'] }
  },
  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});