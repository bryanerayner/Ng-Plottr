require.config({

    // optimizer configuration
    'generateSourceMaps': true,
    'preserveLicenseComments': false,
    'useSourceUrl': true,

    // runtime paths and shims
    paths: {
        angular: '../../vendor/angular/angular',

        angularResource: '../../vendor/angular-resource/angular-resource',
        angularBootstrap: '../../vendor/angular-bootstrap/ui-bootstrap-tpls.min',
        angularUIRouter:  '../../vendor/angular-ui-router/release/angular-ui-router.min',
        angularUIUtils:  '../../vendor/angular-ui-utils/ui-utils.min',
        angularMoment:  '../../vendor/angular-moment/angular-moment.min',
        restangular: '../../vendor/restangular/dist/restangular',

        domReady: '../../vendor/requirejs-domready/domReady',
        text: '../../vendor/requirejs-text/text',

        lodash: '../../vendor/lodash/dist/lodash.min',
        moment: '../../vendor/moment/min/moment.min',
        placeholders: '../../vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min',
        plusOne: '../common/plusOne/plusOne',
        angularTemplateCache: '../common/angular-templatecache/angular-templatecache'

    },
    shim: {
        "angular": {
            exports: "angular"
        },
        "angularBootstrap": {
            deps: ["angular"]
        },
        "angularUIRouter": {
            deps: ["angular"]
        },
        "angularUIUtils": {
            deps: ["angular"]
        },
        "angularMoment": {
            deps: ["angular"]
        },
        "restangular": {
            'deps': ["angular", "lodash"]
        },
        "placeholders": {
            deps: ["angular"]
        },
        "plusOne": {
            deps: ["angular"]
        }
    },

    priority: [
		"angular"
	],

    // kick start application
    deps: ["./bootstrap"],



});
