var unit = unit || (function (gameMap) {
    var currentLocation = { x: 0, y: 0 },
        destinationLocation = { x: 19, y: 19 },
        speed = 1.5,
        state = 0,
        health = 10,
        equipment = {},
        carrying = null,
        tileSize = gameMap.getTileSize(),
        unitSize = 5,
        unitSizeDiameter = unitSize + unitSize,
        navigationTiles = [],
        pFinder = pathFinder(gameMap),
        lastNavigationTime = 0,
        lastSearchState = pathFinder.searchStatusTypes.searching;

    function navigate() {
        pFinder.calculatePath(currentLocation, destinationLocation);
        lastSearchState = pathFinder.searchStatusTypes.searching;
    }

    function debugNavData() {
        console.log('Path Info: (State: ' + lastSearchState + ')');
        for (var x in navigationTiles) {
            console.log(navigationTiles[x].debug());
        }
    }

    function update(currentGameTime, dt) {
        lastNavigationTime += dt;

        if (lastNavigationTime >= 1000) {
            lastNavigationTime = 0;

            pFinder.nextStep();

            var s = pFinder.currentStatus();

            if (s === pathFinder.searchStatusTypes.searching) {
                navigationTiles = pFinder.getCurrentPath();
            }

            if (s !== lastSearchState) {
                navigationTiles = pFinder.getCurrentPath();
                lastSearchState = s;
                debugNavData();
            }
        }
    }

    function draw(ctx) {
        ctx.save();

        var startPos = centerUnit(gameMap.getDisplayOffset(currentLocation)),
            endPos = centerUnit(gameMap.getDisplayOffset(destinationLocation));

        debug(ctx, startPos, endPos);

        ctx.beginPath();
        ctx.arc(startPos.x + unitSize, startPos.y + unitSize, unitSize, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(endPos.x + unitSize, endPos.y + unitSize, unitSize, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();

        ctx.restore();
    }

    function centerUnit(location) {
        var offset = Math.round((tileSize - unitSizeDiameter) / 2);

        return {
            x: location.x + offset,
            y: location.y + offset
        };
    }

    function moveTo(location) {
        destinationLocation = location;
    }

    function setLocation(location) {
        currentLocation = location;
    }

    function getLocation() {
        return currentLocation;
    }

    function debug(ctx, startPos, endPos) {
        var tileSizeMid = gameMap.getHalfTileSize();
        if (navigationTiles.length > 1) {
            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = 'rgba(255, 0, 0, .5)';
            ctx.lineWidth = 5;

            var tile = navigationTiles[0];
            ctx.moveTo(tile.x * tileSize + tileSizeMid, tile.y * tileSize + tileSizeMid);

            for (var i = 1; i < navigationTiles.length; i++) {
                var tile2 = navigationTiles[i];

                ctx.lineTo(tile2.x * tileSize + tileSizeMid, tile2.y * tileSize + tileSizeMid);

            }
            ctx.stroke();
        }

        pFinder.draw(ctx, tileSize);

        //ctx.beginPath();
        //ctx.moveTo(startPos.x + unitSize, startPos.y + unitSize);
        //ctx.lineTo(endPos.x + unitSize, endPos.y + unitSize);
        //ctx.strokeStyle = 'blue';
        //ctx.stroke();
    }

    return {
        update: update,
        draw: draw,
        setLocation: setLocation,
        getLocation: getLocation,
        moveTo: moveTo,
        navigate: navigate
    };
});