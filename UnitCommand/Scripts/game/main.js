$(function () {
    var mainCanvas = document.getElementById('mainCanvas'),
        ctx = mainCanvas.getContext('2d'),
        lastResizeTime = new Date(),
        lastUpdateTime = null,
        updateInterval = 1,
        resizeInterval = 200,
        gameMap = map.createMap({
            height: 20,
            width: 20,
            cellSize: 20
        }),
        cellMovedElapsed = 0,
        tileTypes = {
            none: 0,
            grass: 1,
            stones: 2,
            water: 3,
            trees: 4
        },
        locationXy = {
            x: 0,
            y: 0
        },
        units = [],
        rightMouseDown = false,
        mapOffset = {
            x: 0,
            y: 0
        },
        oldMapOffset = {
            x: 0,
            y: 0
        },
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
            rightMouseDown = true;
            mouseDragStart = evt;
            oldMapOffset.x = mapOffset.x;
            oldMapOffset.y = mapOffset.y;
        }
    });

    mainCanvas.addEventListener('mousemove', function (evt) {
        evt.preventDefault();
        //console.log(x);

        if (rightMouseDown) {
            mapOffset.x = oldMapOffset.x + evt.x - mouseDragStart.x;
            mapOffset.y = oldMapOffset.y + evt.y - mouseDragStart.y;
        }
    });

    mainCanvas.addEventListener('mouseup', function (evt) {
        evt.preventDefault();
        console.log(evt);

        rightMouseDown = false;
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
    }

    function update(gameTime, dt) {
        //cellMovedElapsed += dt;

        /*if (cellMovedElapsed > 10) {
            cellMovedElapsed = 0;
            gameMap.setCell(locationXy, tileTypes.none);

            locationXy.x += 1;
            locationXy.y += 1;

            gameMap.setCell(locationXy, tileTypes.trees);
        }*/

        for (var i = 0; i < units.length; i++) {
            units[i].update(gameTime, dt);
        }
    }

    function draw() {
        ctx.fillStyle = '000000';
        ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

        ctx.save();

        var gridWidth = gameMap.getWidth(),
            gridHeight = gameMap.getHeight(),
            cellSize = gameMap.getCellSize();

        var gridXOffset = Math.round((mainCanvas.width - gridWidth * cellSize) / 2),
            gridYOffset = Math.round((mainCanvas.height - gridHeight * cellSize) / 2);

        ctx.translate(gridXOffset + mapOffset.x, gridYOffset + mapOffset.y);

        drawMap();

        gameMap.forEachUnit(function(i, unit) {
            unit.draw(ctx);
        });

        ctx.restore();
    }

    function drawLine(x, y, x1, y1, color, width) {
        width = width ? width : 1;

        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x1, y1);
        ctx.lineWidth = width;
        ctx.stroke();
    }
   
    function drawMap() {
        var gridWidth = gameMap.getWidth(),
            gridHeight = gameMap.getHeight();

        for (var i = 0; i < gridWidth; i++) {
            for (var j = 0; j < gridHeight; j++) {
                drawCell(i, j);
            }
        }
    }

    function drawCell(x, y) {
        var location = {
                x: x,
                y: y
            },
            cellSize = gameMap.getCellSize();
        

        switch (gameMap.getCell(location)) {
            case tileTypes.grass:
                ctx.fillStyle = 'rgba(0, 255, 0, 1)';
                break;
            case tileTypes.stones:
                ctx.fillStyle = 'rgba(100, 100, 100, 1)';
                break;
            case tileTypes.water:
                ctx.fillStyle = 'rgba(0, 0, 255, 1)';
                break;
            case tileTypes.trees:
                ctx.fillStyle = 'rgba(0, 125, 0, 1)';
                break;
            default:
                ctx.fillStyle = 'rgba(150, 150, 150, 1)';
                break;
        }

        location = gameMap.getDisplayOffset(location);

        ctx.beginPath();
        ctx.rect(location.x, location.y, cellSize, cellSize);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fill();
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

    gameMap.addUnit(unit(gameMap));

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