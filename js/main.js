(function($, _){
    'use strict';

    var $minYearEl = $('#minYears'),
        $maxYearEl = $('#maxYears');

    $minYearEl.on('change', function(e) {
        $maxYearEl.removeArr('disabled');
        alert('asdasd');
    });

})(jQuery, _);
