$(function () {
    var mainCanvas = document.getElementById('mainCanvas'),
        ctx = mainCanvas.getContext('2d'),
        lastResizeTime = new Date(),
        lastUpdateTime = null,
        updateInterval = 10,
        resizeInterval = 200,
        gameMap = map.createMap({
            tileSize: 35,
            dataSettings: {
                height: 15,
                width: 15,
                tiles: [
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0,
                     0, 0, 0, 0, 0, 0, 4, 4, 0, 1, 1, 1, 0, 2, 0,
                     4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 1, 1, 0, 2, 0,
                     0, 0, 0, 0, 0, 0, 4, 4, 0, 2, 2, 0, 0, 2, 0,
                     0, 0, 0, 3, 3, 0, 4, 4, 0, 2, 3, 3, 0, 2, 0,
                     0, 0, 0, 3, 3, 0, 0, 0, 0, 2, 3, 3, 0, 2, 0,
                     0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 3, 3, 0, 0, 0,
                     0, 0, 4, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 2, 2,
                     0, 0, 4, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 2, 0,
                     0, 0, 3, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2, 0,
                     0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0
                ]
            }
        }),
        oldMapOffset = null,
        mouseDragStart = null,
        selectedUnits = [],
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

    mainCanvas.addEventListener('mousedown', function (evt) {
        evt.preventDefault();
        //console.log(evt);

        if (evt.button === 2) {
            mouseDragStart = evt;
            oldMapOffset = gameMap.getMapOffset();
            return;
        }

        if (evt.button === 0) {
            var x = evt.x - canvasOffsets.left,
                y = evt.y - canvasOffsets.top;

            for (var i in selectedUnits) {
                var unit = selectedUnits[i],
                    loc = gameMap.canvasToMapCoords(x, y);

                unit.moveTo(loc);
            }
            return;
        }
    });

    window.addEventListener('mousemove', function (evt) {
        evt.preventDefault();

        if (oldMapOffset !== null) {
            gameMap.setMapOffset({
                x: oldMapOffset.x + evt.x - mouseDragStart.x,
                y: oldMapOffset.y + evt.y - mouseDragStart.y
            });
        }
    });

    window.addEventListener('mouseup', function (evt) {
        evt.preventDefault();
        //console.log(evt);

        oldMapOffset = null;
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
    u.setLocation({ x: 0, y: 14 });
    u.moveTo({ x: 14, y: 12 });

    selectedUnits.push(u);
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