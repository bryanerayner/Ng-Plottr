describe( 'AppE2E', function() {

    var ptor = protractor.getInstance();

    beforeEach(function() {
        ptor.get("/#");
    });

    it('expect index to be home', function() {
        expect(ptor.getCurrentUrl()).toMatch("/home");
        expect(ptor.getTitle()).toBe("Home | Angular-Enterprise-Kickstart");
    });

});
