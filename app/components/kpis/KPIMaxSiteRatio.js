/**
 * @class KPIMaxSiteRatio
 * @memberOf FSCounterAggregatorApp
 * @description Retrieve the site which have the biggest amount of data
 */
(function() {

    angular.module('FSCounterAggregatorApp').
	controller('KPIMaxSiteRatio', [
	    "ComputeService",
	    function(
		ComputeService
	    ) {

		this.getDefaultIndicatorId = function() {
		    return "in";
		};

		this.getLabel = function(id) {
		    return "";
		};

		/**
		 * @function compute
		 * @memberOf FSCounterAggregatorApp.KPIMaxSiteRatio
		 * @description Returns the site which have the biggest
		 * amount of data
		 */
		this.compute = function(query) {

            if(!query.indicator)
                query.indicator = this.getDefaultIndicatorId();

            var res = {
            query: query,
            value: 0
            };

            var felt = function(elt) {
                return elt[query.indicator];
            };

            var siteSums = _.map(query.data, function(siteData){return ComputeService.cSum(siteData.data, felt);});
            var maxIdx = _.indexOf(siteSums, _.max(siteSums));

            res.value = maxIdx>=0 ? query.data[maxIdx].id:"n/a";
            return res;
		};

	    }]);
}());
