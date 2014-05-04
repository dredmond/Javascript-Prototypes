$(function () {
    var mainCanvas = document.getElementById('mainCanvas'),
        ctx = mainCanvas.getContext('2d'),
        headerSize = 65;

    $(window).resize(function() {
        $(mainCanvas).attr('height', ($(window).height() - headerSize) + 'px').attr('width', $(window).width() + 'px');
        update();
    });

    $(mainCanvas).attr('height', ($(window).height() - headerSize) + 'px').attr('width', $(window).width() + 'px');
    
    function update() {
        ctx.fillStyle = '000000';
        ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

        ctx.font = '30px Verdana';
        ctx.fillStyle = 'white';
        ctx.fillText('Sample Text', mainCanvas.width / 2 - (30 * 5), (mainCanvas.height / 2) - 30);
    }

    update();
    
    $.ajax({
        url: '/api/UnitLogic/TestContoller',
        method: 'GET',
        data: { testVar: 'this is a test variable string.'},
        success: function(data) {
            var testDiv = $('<div>').html(data);
            $(body).append(testDiv);
        }
    });
});