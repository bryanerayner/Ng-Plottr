describe( 'Design Route E2E', function() {

	var ptor = protractor.getInstance();

	beforeEach(function() {
		ptor.get('/#');
		ptor.get('/#/design/');
	});

	it('expect index to be design', function() {
		expect(ptor.getCurrentUrl()).toMatch('/design');
		expect(ptor.getTitle()).toBe('Plottr | Design');
	});

	it('expect design to have a new route in it', function() {
		ptor.get('/#/design/new');
		expect(ptor.getCurrentUrl()).toMatch('/design/new');
		expect(ptor.getTitle()).toBe('Plottr | New Design');
	});

});
