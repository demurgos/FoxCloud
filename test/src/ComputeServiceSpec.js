describe('ComputeServiceSpec', function() {

    beforeEach(module('FSCounterAggregatorApp'));

    var mockComputeService;

    beforeEach(inject(function(ComputeService) {
	mockComputeService = ComputeService;
    }));

    it('service exists', function() {
	expect(mockComputeService).toBeDefined();
    });

//    describe('ComputeService test', function() {
//    });

});
