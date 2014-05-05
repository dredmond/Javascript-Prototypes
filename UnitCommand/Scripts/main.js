$(function () {
    (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                       || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    }());

    var mainCanvas = document.getElementById('mainCanvas'),
        ctx = mainCanvas.getContext('2d'),
        headerSize = 0,
        lastResizeTime = new Date(),
        lastUpdateTime = null,
        updateInterval = 100,
        resizeInterval = 200;

    $(window).resize(function () {
        lastResizeTime = new Date();
    });

    function handleResize() {
        headerSize = mainCanvas.offsetTop;

        var newCanvasSize = $(window).height() - headerSize;

        $(mainCanvas).attr('height', newCanvasSize + 'px').attr('width', $(window).width() + 'px');
        var footerSize = $(document).height() - (newCanvasSize + headerSize);

        $(mainCanvas).attr('height', (newCanvasSize - footerSize) + 'px').attr('width', $(window).width() + 'px');
    }

    function update(dt) {

    }

    function draw() {
        ctx.fillStyle = '000000';
        ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

        ctx.font = '30px Verdana';
        ctx.fillStyle = 'white';

        var fontSize = ctx.measureText('Sample Text');
        ctx.fillText('Sample Text', (mainCanvas.width - fontSize.width) / 2, (mainCanvas.height - 30) / 2);
    }
    
    function gameLoop(gameTime) {
        requestAnimationFrame(gameLoop);

        if (!lastUpdateTime)
            lastUpdateTime = gameTime;

        var dt = gameTime - lastUpdateTime;
        if (dt < updateInterval)
            return;

        lastUpdateTime = gameTime;

        update(dt);
        draw();

        if (lastResizeTime != null && (new Date()) - lastResizeTime >= resizeInterval) {
            lastResizeTime = null;
            handleResize();
        }
    }

    requestAnimationFrame(gameLoop);

    $.ajax({
        url: '/api/UnitLogic/TestContoller',
        method: 'GET',
        data: { testVar: 'this is a test variable string.'},
        success: function(data) {
            var testDiv = $('<div>').html(data);
            $(body).append(testDiv);

            lastResizeTime = new Date();
        }
    });
});