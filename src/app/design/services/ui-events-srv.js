define(['angular', './module', 'lodash', 'jrClass', './classes/EventMap', './classes/EventsObject'], function (ng, module, _, Class, EventMap, EventsObject) {
    'use strict';

    /**
     * UIEvents
     * @name app.design.services:UIEvents
     *
     * @description
     *
     * A service for listening to UI Events across the application. Provides EventMap (for organizing event state) as well
     * as EventObject (a wrapper around a $scope).
     */
    module.factory( 'UIEvents', [function () {


        var service = {};




        service.EventMap = EventMap;


        service.EventsObject = EventsObject;


        return service;
    }]);

});
