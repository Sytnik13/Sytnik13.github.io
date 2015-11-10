(function($, _){
    'use strict';

    var $minYearEl = $('#minYear'),
        $maxYearEl = $('#maxYear'),
        years = [],
        BASE_URL = 'http://www.carqueryapi.com/api/0.3/?callback=?';


    $.getJSON(BASE_URL,{
        cmd: 'getYears'
    }, function(data){

        years = fillYears(data);
        addOptions($minYearEl, years);

        $minYearEl.on('change', function(e){
            var val = +$(this).val();
            if (val) {
                resetOptions($maxYearEl, 'Select Max Year');
                addOptions($maxYearEl, years.filter(function(year){
                    return year >= val;
                }));
                $maxYearEl.removeAttr('disabled');
            } else {
                resetOptions($maxYearEl, 'Select Max Year');
                $maxYearEl.attr('disabled', 'disabled');
            }
        });

    });

    function fillYears(data){
        var min = +data.Years.min_year,
            max = +data.Years.max_year,
            result = [];
        for (; max >= min; max--) {
            result.push(max);
        }
        return result;
    }

    function addOptions($el, years){
        years.forEach(function(year){

            var template = '<option value="'+ year +'">'+ year +'</option>';
            $el.append(template);
        });
    }

    function resetOptions($el, text) {
        $el
            .empty()
            .append('<option value="0">'+ text +'</option>');
    }



})(jQuery, _);