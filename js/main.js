(function($, _){
    'use strict';

    var $minYearEl = $('#minYear'),
        $maxYearEl = $('#maxYear'),
        $makeSearchForm = $('#makeSearchForm'),
        $loader = $('#loader'),
        $makesTable = $('#makesTable'),
        $makesList = $('#makesList'),
        years = [],
        BASE_URL = 'http://www.carqueryapi.com/api/0.3/?callback=?';

    $.ajaxSetup({
        beforeSend: function(){
            $loader.show();
        },
        complete: function(){
            $loader.hide();
        }
    });

    getData('getYears')
        .then(function(data){
            years = fillYears(data);
            addOptions($minYearEl, years);
            $minYearEl.removeAttr('disabled');
        });

    $makeSearchForm.on('submit', function(e){
        e.preventDefault();
        var formFields = $(this).serializeArray();
        var request = {};
        formFields.forEach(function(field){

            if (!field.value) return;
            if (field.name == 'min_year') field.name = 'year'; //TODO: Fix it later!
            request[field.name] = field.value;


        });

        getData('getMakes', request)
            .then(function(data){
                var cars = data.Makes.map(function(car){
                    return {
                        make: car.make_display,
                        country: car.make_country,
                        id: car.make_id
                    }
                });
                console.log(cars);
                fillTable(cars);
                var $getModelsByIdBtns = $('[data-make-id]');
                $getModelsByIdBtns.on('click', function(e){
                    e.preventDefault();
                    var request = {
                        make: $(this).data('make-id')
                    }

                    getData('getModels', request)
                        .then(function(data){
                            console.log(data);
                        });
                })
            });
    });

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
            .append('<option value="">'+ text +'</option>');
    }

    function getData(cmd, request){
        var req = request || {};
        req.cmd = cmd;
        return $.getJSON(BASE_URL, req);
    }

    function fillTable(cars){
        $makesList.empty();
        cars.forEach(function(car){
            var template = '<tr>'+
                '<td class="va-middle">'+ car.make +'</td>'+
                '<td class="va-middle">'+ car.country +'</td>'+
                '<td class="va-middle text-right">'+
                '<a class="btn btn-primary" data-make-id="'+ car.id +'">Get Models</a>'+
                '</td>'+
                '</tr>';
            $makesList.append(template);
        });

    }


})(jQuery, _);