$(function () {
    var mainCanvas = document.getElementById('mainCanvas'),
        ctx = mainCanvas.getContext('2d'),
        lastResizeTime = new Date(),
        lastUpdateTime = null,
        updateInterval = 1,
        resizeInterval = 200,
        gameMap = map.createMap({
            tileSize: 50,
            dataSettings: {
                height: 20,
                width: 20,
                tiles: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 1, 1, 1, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 1, 1, 1, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 2, 2, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 2, 3, 3, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 4, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0
                ]
            }
        }),
        oldMapOffset = null,
        mouseDragStart = null;

    // Hook the window resize event and store 
    // the time it was last called. This will reduce lag
    // while resizing the canvas since it can be called multiple times
    // for a single resize.
    $(window).resize(function () {
        lastResizeTime = new Date();
    });

    mainCanvas.addEventListener('contextmenu', function (evt) {
        evt.preventDefault();
    });

    mainCanvas.addEventListener('mousedown', function (evt) {
        evt.preventDefault();
        console.log(evt);

        if (evt.button === 2) {
            mouseDragStart = evt;
            oldMapOffset = gameMap.getMapOffset();
        }
    });

    mainCanvas.addEventListener('mousemove', function (evt) {
        evt.preventDefault();

        if (oldMapOffset !== null) {
            gameMap.setMapOffset({
                x: oldMapOffset.x + evt.x - mouseDragStart.x,
                y: oldMapOffset.y + evt.y - mouseDragStart.y
            });
        }
    });

    mainCanvas.addEventListener('mouseup', function (evt) {
        evt.preventDefault();
        console.log(evt);

        oldMapOffset = null;
    });

    // Handle the resize event. We want to size the canvas so it sits 
    // nicely between all other elements on the page. We do this by calculating the space
    // above and below the canvas in comparison to the window height.
    function handleResize() {
        // Get total space above canvas
        var headerSize = mainCanvas.offsetTop;

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
        gameMap.setViewSize({
            height: mainCanvas.height,
            width: mainCanvas.width
        });
    }

    function update(gameTime, dt) {

        // Update the map.
        gameMap.update(gameTime, dt);
    }

    function draw() {
        ctx.fillStyle = '000000';
        ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

        ctx.save();

        // Draw the map
        gameMap.draw(ctx);

        ctx.restore();
    }

    function gameLoop(gameTime) {
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

        // Check if the lastResizeTime is set and check if the delta is above our
        // resizeInterval. If it is resize the canvas.
        if (lastResizeTime != null && (new Date()) - lastResizeTime >= resizeInterval) {
            lastResizeTime = null;
            handleResize();
        }
    }

    var u = unit(gameMap);
    u.setLocation({ x: 2, y: 14 });
    u.moveTo({ x: 15, y: 19 });
    u.navigate();

    gameMap.addUnit(u);

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