define(['home/index', 'angularMocks'], function(app, ngMock) {
    'use strict';


    describe('Design Node', function () {

        var elm,		// the jQLite element
            rootScope;	// the root scope that was inserted

        beforeEach(module('app.design.directives.designNode'));

        beforeEach(inject(['$rootScope', '$compile',
            function ($rootScope, $compile) {
                rootScope = $rootScope;
                rootScope.layout = {
                    left:0,
                    top:0,
                    width:0,
                    height:0,
                    zIndex:0
                };
                rootScope.nestOrder = 0;
            }]));

        function compileDirective(tpl) {
            if (!tpl) {
                tpl = '<design-node layout="layout" nestOrder = "neestOrder"></design-node>';
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
                expect(elm.scope().layout).toBeDefined();
            });
            it('should not define layout on $rootScope', function () {
                compileDirective();
                expect(rootScope.layout).not.toBeDefined();
            });

            it('should define nestOrder', function () {
                compileDirective();
                expect(elm.scope().nestOrder).toBeDefined();
            });
            it('should not define nestOrder on $rootScope', function () {
                compileDirective();
                expect(rootScope.nestOrder).not.toBeDefined();

            });

            describe('layout properties', function () {
                it('should contain left, width, height, and top', function () {
                    compileDirective();
                    var elmScope = elm.scope();
                    var layout = elmScope.layout;
                    expect(layout.left).toBeDefined();
                    expect(layout.width).toBeDefined();
                    expect(layout.height).toBeDefined();
                    expect(layout.top).toBeDefined();
                });
                it('should contain zIndex', function () {
                    compileDirective();
                    var elmScope = elm.scope();
                    var layout = elmScope.layout;
                    expect(layout.zIndex).toBeDefined();
                });
                it('should receive a camel cased or hyphenated initialziation as an attribute', function () {
                    compileDirective('<design-node initial-layout="zIndex:50;"></design-node>');
                    var elmScope = elm.scope();
                    var layout = elmScope.layout;
                    expect(layout.zIndex).toEqual(50);

                    compileDirective('<design-node initial-layout="z-index:50;"></design-node>');
                    elmScope = elm.scope();
                    layout = elmScope.layout;
                    expect(layout.zIndex).toEqual(50);
                });
                it('should take a hash of values', function () {
                    compileDirective('<design-node initial-layout="left:0px;top:0px;width:100%;height:100%;z-index:5;"></design-node>');
                    var elmScope = elm.scope();
                    var layout = elmScope.layout;
                    expect(layout.left).toEqual('0px');
                    expect(layout.top).toEqual('0px');
                    expect(layout.width).toEqual('100%');
                    expect(layout.height).toEqual('100%');
                    expect(layout.zIndex).toEqual(5);
                });
            });
            describe('nestOrder properties', function () {
                it('should be defaulted to 0', function () {
                    compileDirective();
                    var elmScope = elm.scope();
                    var nestOrder = elmScope.nestOrder;
                    expect(nestOrder).toEqual(0);
                });
                it('should receive a camel cased or hyphenated initialization as an attribute', function () {
                    compileDirective('<design-node initial-nestOrder = "5"></design-node>');
                    var elmScope = elm.scope();
                    var nestOrder = elmScope.nestOrder;
                    expect(nestOrder).toEqual(5);
                    compileDirective('<design-node initial-nest-Order = "5"></design-node>');
                    elmScope = elm.scope();
                    nestOrder = elmScope.nestOrder;
                    expect(nestOrder).toEqual(5);
                    compileDirective('<design-node initial-nest-order = "5"></design-node>');
                    elmScope = elm.scope();
                    nestOrder = elmScope.nestOrder;
                    expect(nestOrder).toEqual(5);
                });
            });


        });
    });
});