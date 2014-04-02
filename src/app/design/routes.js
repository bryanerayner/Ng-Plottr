define(['angular', './module', './controllers/index'], function(ng, module, controllers){
	'use strict';

	module.config([ '$stateProvider', function ($stateProvider){
		$stateProvider.state('design', {
			url: '/design',
			views:{
				'main':{
					controller:'DesignCtrl',
					templateUrl: './src/app/design/partials/design.tpl.html'
				}
			},
            data:{ pageTitle: 'Design' }
		});
	}]);
});