$(function () {
    var mainCanvas = document.getElementById('mainCanvas'),
        ctx = mainCanvas.getContext('2d'),
        lastResizeTime = new Date(),
        lastUpdateTime = null,
        updateInterval = 10,
        resizeInterval = 50,
        level = null,
        canvasOffsets = {
            top: mainCanvas.offsetTop,
            left: mainCanvas.offsetLeft
        };

    // Hook the window resize event and store 
    // the time it was last called. This will reduce lag
    // while resizing the canvas since it can be called multiple times
    // for a single resize.
    $(window).resize(function () {
        lastResizeTime = new Date();
    });

    window.addEventListener('contextmenu', function (evt) {
        evt.preventDefault();
    });

    window.addEventListener('keydown', function(evt) {
        evt.preventDefault();

        if (level !== null)
            level.inputEvent(evt);
    });

    window.addEventListener('keyup', function (evt) {
        evt.preventDefault();

        if (level !== null)
            level.inputEvent(evt);
    });

    window.addEventListener('keypress', function (evt) {
        evt.preventDefault();

        if (level !== null)
            level.inputEvent(evt);
    });

    mainCanvas.addEventListener('mousedown', function (evt) {
        evt.preventDefault();

        if (level !== null)
            level.inputEvent(evt);

    });

    window.addEventListener('mousemove', function (evt) {
        evt.preventDefault();

        if (level !== null)
            level.inputEvent(evt);
    });

    window.addEventListener('mouseup', function (evt) {
        evt.preventDefault();

        if (level !== null)
            level.inputEvent(evt);
    });

    // Handle the resize event. We want to size the canvas so it sits 
    // nicely between all other elements on the page. We do this by calculating the space
    // above and below the canvas in comparison to the window height.
    function handleResize() {
        canvasOffsets = {
            top: mainCanvas.offsetTop,
            left: mainCanvas.offsetLeft
        };

        // Get total space above canvas
        var headerSize = canvasOffsets.top;

        // Calculate the canvas size based on the
        // current window height.
        var newCanvasSize = $(window).height() - headerSize;

        // Resize the canvas with the new size.
        $(mainCanvas).attr('height', newCanvasSize + 'px').attr('width', $(window).width() + 'px');

        // Calculate the space below the new canvas
        // using the document's height.
        var footerSize = $(document).height() - (newCanvasSize + headerSize);

        // Do the final resize that removes the footer height from the canvas.
        $(mainCanvas).attr('height', (newCanvasSize - footerSize) + 'px').attr('width', $(window).width() + 'px');

        // Update the map viewsize settings.
        if (level !== null) {
            level.resize({
                height: mainCanvas.height,
                width: mainCanvas.width
            });
        }
    }

    function update(gameTime, dt) {
        if (level !== null)
            level.update(gameTime, dt);

        ui.update(gameTime, dt);
    }

    function draw() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

        if (level !== null)
            level.draw(ctx);

        ui.draw(ctx);
    }

    function gameLoop(gameTime) {
        // Check if the lastResizeTime is set and check if the delta is above our
        // resizeInterval. If it is resize the canvas.
        if (lastResizeTime != null && (new Date()) - lastResizeTime >= resizeInterval) {
            lastResizeTime = null;
            handleResize();
        }

        // Request the next update from the browser.
        requestAnimationFrame(gameLoop);

        // If lastUpdateTime isn't set use the current gameTime.
        if (!lastUpdateTime)
            lastUpdateTime = gameTime;

        // Calculate the delta based on the lastUpdateTime and the gameTime.
        // If it is below our updateInterval do nothing.
        var dt = gameTime - lastUpdateTime;
        if (dt < updateInterval)
            return;

        // Store current gameTime so we can get the delta on the next call.
        lastUpdateTime = gameTime;

        // Run the update logic and 
        // draw the screen to the canvas.
        update(gameTime, dt);
        draw();
    }

    level = level1(mainCanvas);

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

// Helper functions for setting up requestAnimationFrame.
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