$(function () {
    var mainCanvas = document.getElementById('mainCanvas'),
        ctx = mainCanvas.getContext('2d'),
        lastResizeTime = new Date(),
        lastUpdateTime = null,
        updateInterval = 1,
        resizeInterval = 200,
        gridCellSize = 25,
        gameMap = map.createMap({
            height: 10,
            width: 10,
            cells: [
                0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
                0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
                0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.0,
                0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 1.0, 0.5,
                0.0, 0.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                0.0, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
                0.5, 1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
                1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
                0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
                0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
            ]
        }),
        cellMovedElapsed = 0;

    // Hook the window resize event and store 
    // the time it was last called. This will reduce lag
    // while resizing the canvas since it can be called multiple times
    // for a single resize.
    $(window).resize(function () {
        lastResizeTime = new Date();
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
        cellMovedElapsed += dt;

        if (cellMovedElapsed > 1) {
            cellMovedElapsed = 0;

            /*var prevPrevCell = moveToRelativeCell(cellLocation, -1, 0);
            var prevCell = moveToRelativeCell(cellLocation, 0, 0);
            var nextCell = moveToRelativeCell(cellLocation, 1, 0);
            setCell(prevPrevCell.x, prevPrevCell.y, 0);
            setCell(nextCell.x, nextCell.y, 1);
            setCell(prevCell.x, prevCell.y, 2);

            for (var x = 0; x <= 10; x++) {
                var cell = moveToRelativeCell(cellLocation, -x, 0);
                setCell(cell.x, cell.y, (10.0 - x) / 10.0);
            }

            cellLocation = nextCell;*/
        }
    }

    function draw() {
        ctx.fillStyle = '000000';
        ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

        var gridWidth = gameMap.getWidth(),
            gridHeight = gameMap.getHeight();

        var gridXOffset = (mainCanvas.width - gridWidth * gridCellSize) / 2,
            gridYOffset = (mainCanvas.height - gridHeight * gridCellSize) / 2;

        for (var i = 0; i <= gridWidth; i++) {
            drawLine(i * gridCellSize + gridXOffset,
                     0 + gridYOffset,
                     i * gridCellSize + gridXOffset,
                     gridHeight * gridCellSize + gridYOffset,
                     '888888');
            
            for (var j = 0; j <= gridHeight; j++) {
                drawLine(0 + gridXOffset,
                         j * gridCellSize + gridYOffset,
                         gridWidth * gridCellSize + gridXOffset,
                         j * gridCellSize + gridYOffset,
                         '888888');

                if (i < gridWidth && j < gridHeight && gameMap.getCell({ x: i, y: j }) > 0) {
                    ctx.fillStyle = 'rgba(0, 255, 0, ' + gameMap.getCell({ x: i, y: j }) + ')';
                    ctx.fillRect(i * gridCellSize + gridXOffset, j * gridCellSize + gridYOffset, gridCellSize, gridCellSize);
                }
            }
        }

        // Left
        /*drawLine(gridXOffset - 2.5, gridYOffset - 4.9,
                 gridXOffset - 2.5,
                 gridHeight * gridCellSize + gridYOffset + 4.9,
                 'FF0000', 5);

        // Top
        drawLine(gridXOffset - 2.5,
                 gridYOffset - 2.5,
                 gridWidth * gridCellSize + gridXOffset + 2.5,
                 gridYOffset - 2.5,
                 'FF0000', 5);

        // Right
        drawLine(gridWidth * gridCellSize + gridXOffset + 2.5,
                 gridYOffset - 4.9,
                 gridWidth * gridCellSize + gridXOffset + 2.5,
                 gridWidth * gridCellSize + gridYOffset + 4.9,
                 'FF0000', 5);

        // Bottom
        drawLine(gridXOffset - 2.5,
                 gridWidth * gridCellSize + gridYOffset + 2.5,
                 gridWidth * gridCellSize + gridXOffset + 2.5,
                 gridWidth * gridCellSize + gridYOffset + 2.5,
                 'FF0000', 5);
        */

        ctx.font = '30px Verdana';
        ctx.fillStyle = 'white';

        var fontSize = ctx.measureText('Sample Text');
        ctx.fillText('Sample Text', (mainCanvas.width - fontSize.width) / 2, (mainCanvas.height) / 2);
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
        //update(gameTime, dt);
        draw();

        // Check if the lastResizeTime is set and check if the delta is above our
        // resizeInterval. If it is resize the canvas.
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