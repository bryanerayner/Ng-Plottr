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
        restangular: '../../vendor/restangular/dist/restangular.min',

        domReady: '../../vendor/requirejs-domready/domReady',
        text: '../../vendor/requirejs-text/text',

        lodash: '../../vendor/lodash/dist/lodash.min',
        moment: '../../vendor/moment/min/moment.min',
        plusOne: '../common/plusOne/plusOne',
        angularTemplateCache: '../common/angular-templatecache/angular-templatecache',
        keystateService:'../common/keystate-service/keystate-srv',
        mouseEventsService:'../common/mouseEvents-service/mouseEvents-srv',
        mousetrap:'../common/mousetrap/mousetrap',
        jrClass:'../common/jrClass/jrClass'

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
        "plusOne": {
            deps: ["angular"]
        },
        "keystateService":{
            deps: ["angular", "lodash"]
        },
        "mouseEventsService":{
            deps: ["angular", "lodash", "jrClass"]
        }
    },

    priority: [
		"angular"
	],

    // kick start application
    deps: ["./bootstrap"]



});
