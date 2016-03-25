/*
 * Transform a site id to its name (or "" if no site available)
 **/

(function() {

 angular.module('FSCounterAggregatorApp')
    .filter("Hour12h", function()
    {
        return function(h)
        {
            if (isNaN(h))
                return h;
            else
            {
                var ampm = h>=12 ? "pm" : "am";
                var digit = h % 12; if(digit===0) digit = 12;

                return digit + ampm;
            }
        };
    })
    .filter("Hour24h", function()
    {
        return function(h)
        {
            if (isNaN(h))
                return h;
            else
                return h + "h";
        };
    });
}());
