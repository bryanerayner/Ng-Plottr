define(['angular', './module', 'lodash', './tools-selection', 'mousetrap'], function (ng, module, _, tool_selection) {

    module.factory("DesignTools", ['KeystateService', 'UIEvents', function(KeystateService, UIEvents){

        var $scope;


        var service = {

            registerScope:function(newScope)
            {
                $scope = newScope;
            },

            releaseScope:function(){
                delete $scope;
            }

        };



        return service;

    }]);

});
