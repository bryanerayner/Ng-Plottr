define(['home/index', 'angularMocks'], function(app, ngMock) {
    'use strict';


    describe('Design Node', function () {

        var elm,		// the jQLite element
            rootScope;	// the root scope that was inserted

        beforeEach(module('app.design.directives.designNode'));

        beforeEach(inject(['$rootScope', '$compile', '$httpBackend',
            function ($rootScope, $compile, $httpBackend) {
                $httpBackend.whenGET('./src/app/design/directives/design-node.tpl.html').respond(
                    '{{calculated.innerContent()}}'
                );
                rootScope = $rootScope;
                rootScope.node = {
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
                };
                rootScope.controller = {

                };
            }]));

        function compileDirective(tpl) {
            if (!tpl) {
                tpl = '<design-node node="node" controller="controller"></design-node>';
            }
            tpl = '<div>' + tpl + '</div>';

            inject(['$compile', function ($compile) {
                var form = $compile(tpl)(rootScope);
                elm = form.find('design-node');
            }]);

            rootScope.$digest();
        }


        describe('scope initialization', function () {

            it('should have an isolated scope', function () {
                compileDirective();
                expect(elm.scope()).toBeDefined();
            });

            it('should define layout', function () {
                compileDirective();
                expect(elm.scope().node.layout).toBeDefined();
            });

            describe('layout properties', function () {
                it('should contain left, width, height, top, zIndex, and nestOrder', function () {
                    compileDirective();
                    var elmScope = elm.scope();
                    var layout = elmScope.node.layout;
                    expect(layout.left).toBeDefined();
                    expect(layout.width).toBeDefined();
                    expect(layout.height).toBeDefined();
                    expect(layout.top).toBeDefined();
                    expect(layout.zIndex).toBeDefined();
                    expect(layout.nestOrder).toBeDefined();
                });
                it('should set these values to defaults if they are not defined', function () {
                    rootScope.node.layout = 'somethingWrong';
                    expect(rootScope.node.layout).toEqual('somethingWrong');
                    compileDirective();
                    var elmScope = elm.scope();
                    var layout = elmScope.node.layout;
                    expect(layout.left).toEqual(0);
                    expect(layout.width).toEqual(50);
                    expect(layout.height).toEqual(50);
                    expect(layout.top).toEqual(50);
                    expect(layout.zIndex).toEqual(0);
                    expect(layout.nestOrder).toEqual(0);

                });
                it('should bubble changes from layout to the rootScope', function () {
                    compileDirective();
                    var elmScope = elm.scope();
                    var layout = elmScope.node.layout;
                    layout.left = 5000;
                    elmScope.$apply();
                    expect(rootScope.node.layout.left).toEqual(5000);

                    layout.top = 1000;
                    elmScope.$apply();
                    expect(rootScope.node.layout.top).toEqual(1000);

                    layout.width = 60;
                    elmScope.$apply();
                    expect(rootScope.node.layout.width).toEqual(60);

                    layout.height = 500;
                    elmScope.$apply();
                    expect(rootScope.node.layout.height).toEqual(500);

                    layout.zIndex = 5;
                    elmScope.$apply();
                    expect(rootScope.node.layout.zIndex).toEqual(5);

                    layout.nestOrder = 2;
                    elmScope.$apply();
                    expect(rootScope.node.layout.nestOrder).toEqual(2);
                });

                it('should bubble changes from rootScope to layout', function () {
                    compileDirective();
                    var elmScope = elm.scope();
                    var layout = elmScope.node.layout;
                    rootScope.node.layout.left = 5000;
                    rootScope.$apply();
                    expect(layout.left).toEqual(5000);

                    rootScope.node.layout.top = 1000;
                    rootScope.$apply();
                    expect(layout.top).toEqual(1000);

                    rootScope.node.layout.width = 60;
                    rootScope.$apply();
                    expect(layout.width).toEqual(60);

                    rootScope.node.layout.height = 500;
                    rootScope.$apply();
                    expect(layout.height).toEqual(500);

                    rootScope.node.layout.zIndex = 5;
                    rootScope.$apply();
                    expect(layout.zIndex).toEqual(5);

                    rootScope.node.layout.nestOrder = 2;
                    rootScope.$apply();
                    expect(layout.nestOrder).toEqual(2);
                });
            });


        });

        describe('layout style mapping', function(){
//            it('should map left and top in pixels', function(){
//            });
        });
    });
});