/**
 * Created by bryanerayner on 2014-04-03.
 */
define(['design/index', 'angularMocks', 'lodash'], function (app, ngMock, _) {
    'use strict';

    describe('Controller: DesignCtrl', function () {
        var createController, createDefaultController;
        var controllerFactory, $scope, mockApi, uiState, Restangular, $httpBackend, designRestService, $stateParams, DesignRestService;

        createController = function (_$stateParams_) {
            $stateParams = $stateParams || _$stateParams_;
            return controllerFactory('DesignCtrl', {
                $scope: $scope,
                $stateParams: $stateParams,
                DesignRestService:DesignRestService
            });
        };

        createDefaultController = function(){
           return createController({
                designId:0
            });
        };

        // Mock the designRestService
        beforeEach(function(){
            mockApi = {
                plot: {
                    name:'User Session',
                    templateLanguage: 'Handlebars'
                },
                plotModes: [
                    {
                        id: 0,
                        name: 'User Session Control',
                        mockData: 1,
                        plotDesign:0
                    }
                ],
                defaults:{
                    plotMode:0
                },
                mockData: [
                    {
                        id: 0,
                        name: 'Logged In User',
                        data: {
                            loggedIn: true
                        }
                    },
                    {
                        id: 1,
                        name: 'Logged Out User',
                        data: {
                            loggedIn: false
                        }
                    }
                ],
                plotVariables: [
                    {
                        name: 'name',
                        type: 'string',
                        template: '{{name}}'
                    },
                    {
                        name: 'sessionChangeAction',
                        type: 'inline',
                        template: '{{#if loggedIn}}Logout{{else}}Login{{/if}}'
                    },
                    {
                        name:'year',
                        type: 'string',
                        template:''
                    }
                ],
                files: [
                    {
                        name: 'sprites',
                        type: '.png',
                        path: '../sprites.png'
                    }
                ],
                plotDesigns: [
                    {
                        id:0,
                        modeName:'Sign Up / Register',
                        className:'register',
                        width: 400,
                        height: 300,
                        designNodes: [
                            {
                                id: 0,
                                name: 'Welcome Hero',
                                type: 'h1',
                                roles: ['hero', 'header'],
                                layout: {left: 0, top: 20, width: 200, height: 50, zIndex: 0, nestOrder: 0},
                                innerContent: {
                                    nodes: [
                                        {
                                            type: 'text',
                                            content: 'Welcome, {{name}}'
                                        }
                                    ]
                                },
                                inlineStyles: {
                                    fontSize: '1.3em',
                                    color: '#121212'
                                },
                                referencedStyles: [],
                                group: 0
                            },
                            {
                                id: 1,
                                name: 'Action Button',
                                type: 'div',
                                roles: ['btn', 'logout'],
                                layout: {left: 220, top: 20, width: 50, height: 50, zIndex: 0, nestOrder: 0},
                                innerContent: {
                                    nodes: [
                                        {
                                            type: 'text',
                                            content: '{{sessionChangeAction}}'
                                        }
                                    ]
                                },
                                inlineStyles: {
                                    backgroundImage: 'file("sprites")',
                                    backgroundPosition: '-23px -24px'
                                },
                                referencedStyles: [],
                                group: 0
                            },
                            {
                                id: 2,
                                name: 'Copyright Text',
                                type: 'p',
                                layout: {left: 0, top: 250, width: 300, height: 50, zIndex: 0, nestOrder: 0},
                                innerContent: {
                                    nodes: [
                                        {
                                            type: 'text',
                                            content: '&copy;, {{year}}'
                                        }
                                    ]
                                },
                                inlineStyles: {
                                    fontSize: '1em',
                                    color: '#121212'
                                },
                                referencedStyles: [],
                                group: 1

                            }
                        ]
                    }
                ],
                groups: [
                    {
                        id:0,
                        name:'Action Text',
                        type:'header',
                        layout: {left: 0, top: 20, width: 270, height: 50, zIndex: 0, nestOrder: 0}
                    },
                    {
                        id:1,
                        name:'Footer Text',
                        type:'footer',
                        layout: {left: 0, top: 250, width: 300, height: 50, zIndex: 0, nestOrder: 0},
                    }
                ]

            };
            uiState = {
                selectedNodes:[],
                selectedTool:'edit'
            };

        });



        // Load the module that the controller you are testing is in
        beforeEach(module('app.design'));





        // inject is used for resolving references that you need to use in your tests, don't use this as a normal beforeEach, this beforeEach is used to resolve references
        beforeEach(inject(function (_$controller_, _$rootScope_, _$stateParams_, _$httpBackend_, _Restangular_, _DesignRestService_) {

            $httpBackend = _$httpBackend_;
            Restangular = _Restangular_;

            $stateParams = _$stateParams_;

            DesignRestService = _DesignRestService_;

            $scope = _$rootScope_.$new();

            //instead of instantiating the controller using $controller, we are saving a reference for it & calling it in the createController function and later will use in each unit test
            controllerFactory = _$controller_;
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });


        //The actual before each for setting up common variables, dependencies or functions


        describe('Loading design-nodes', function(){
            it('should create currentContext in scope', function () {
                var ctrl = createDefaultController();
                expect(scope.currentContext).toBeDefined();
            });
            it('should populate currentContext with the default design-nodes', function () {
                var ctrl = createDefaultController();
                expect(scope.currentContext.designNodes).toEqual(mockApi.plotDesigns[0].designNodes);
            });
            it('should populate currentContext with the ID of the default design', function () {
                var ctrl = createDefaultController();
                expect(scope.currentContext.plotMode).toEqual(0);
            });
            it('should populate currentContext with uiState', function () {
                var ctrl = createDefaultController();
                expect(scope.currentContext.uiState).toEqual(uiState);
            });
        });

        describe('UI Interactions', function(){
            it('should begin with nothing selected and the edit tool enabled', function(){
               createDefaultController();
                expect(scope.uiState.selectedNodes).toEqual([]);
                expect(scope.uiState.selectedTool).toEqual('edit');
            });
            //it('should define a function ')
        });

        describe('Edit mode', function(){
            it('should be selectable', function(){
                var ctrl = createDefaultController();
                scope.ui.selectTool('edit');
                expect(scope.uiState.selectedTool).toEqual('edit');
            });
            it('should update selection when firing event.click on designNodes', function(){
                var ctrl = createDefaultController();
                scope.ui.selectTool('edit');
                //First click - select
                scope.ui.event.click(scope.currentContext.designNodes[0], '');
                expect(scope.uiState.selectedNodes).toEqual([0]);

                //Second click - deselect
                scope.ui.event.click(scope.currentContext.designNodes[0], '');
                expect(scope.uiState.selectedNodes).toEqual([]);
            });
        });

    });

});