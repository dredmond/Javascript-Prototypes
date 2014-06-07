var unit = unit || (function (gameMap) {
    var currentLocation = { x: 0, y: 0 },
        destinationLocation = { x: 19, y: 19 },
        speed = 50,
        state = 0,
        health = 10,
        equipment = {},
        carrying = null,
        tileSize = gameMap.getTileSize(),
        unitSize = 5,
        unitSizeDiameter = unitSize + unitSize,
        navigationTiles = [],
        pFinder = pathFinder(gameMap),
        lastNavigationStepTime = 0,
        lastMovementTime = 0,
        lastSearchState = pathFinder.searchStatusTypes.searching,
        currentWorldPosition = { x: 0, y: 0 },
        nextWorldPosition = null,
        isMoving = false,
        pathIndex = 1;

    pFinder.setAllowDiagonals(true);

    function navigate() {
        pathIndex = 1;
        pFinder.calculatePath(currentLocation, destinationLocation);
        lastSearchState = pathFinder.searchStatusTypes.searching;
    }

    function debugNavData() {
        //console.log('Path Info: (State: ' + lastSearchState + ')');
        for (var x in navigationTiles) {
            //console.log(navigationTiles[x].debug());
        }
    }

    function update(currentGameTime, dt) {
        lastNavigationStepTime += dt;
        lastMovementTime += dt;

        while (lastNavigationStepTime >= 1000) {
            lastNavigationStepTime -= 1000;

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

        while (lastMovementTime >= 10) {
            var updateTime = 10;
            lastMovementTime -= 10;

            if (lastSearchState === pathFinder.searchStatusTypes.pathFound) {
                followPath(updateTime / 1000);
            }
        }
    }

    function draw(ctx) {
        ctx.save();

        var startPos = currentWorldPosition,
            endPos = centerUnit(gameMap.getDisplayOffset(destinationLocation));

        debug(ctx, startPos, endPos);

        ctx.beginPath();
        ctx.arc(endPos.x + unitSize, endPos.y + unitSize, unitSize, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(startPos.x + unitSize, startPos.y + unitSize, unitSize, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
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
        destinationLocation.x = location.x;
        destinationLocation.y = location.y;
    }

    function setLocation(location) {
        currentLocation.x = location.x;
        currentLocation.y = location.y;
        currentWorldPosition = centerUnit(gameMap.getDisplayOffset(currentLocation));
    }

    function getLocation() {
        return currentLocation;
    }

    function followPath(dt) {
        if (pathIndex >= navigationTiles.length) {
            navigationTiles = [];
            return;
        }

        isMoving = true;

        var nextTile = navigationTiles[pathIndex];

        currentLocation = gameMap.worldToMapCoords(currentWorldPosition.x, currentWorldPosition.y);
        nextWorldPosition = centerUnit(gameMap.getDisplayOffset(nextTile));

        var x = currentWorldPosition.x - nextWorldPosition.x,
            y = currentWorldPosition.y - nextWorldPosition.y,
            x2 = x * x,
            y2 = y * y,
            dist = Math.sqrt(x2 + y2),
            angle = Math.atan2(y, x) + Math.PI;

        var cosAngle = Math.cos(angle),
            sinAngle = Math.sin(angle);

        var nextX = currentWorldPosition.x + cosAngle * speed * dt,
            nextY = currentWorldPosition.y + sinAngle * speed * dt;
        console.log(nextWorldPosition);
        console.log(currentLocation);
        console.log(nextTile.x, nextTile.y);
        console.log('x: ' + nextX);
        console.log('y: ' + nextY);
        console.log('dist: ' + dist);
        currentWorldPosition.x = nextX;
        currentWorldPosition.y = nextY;

        if (dist <= 5) {
            pathIndex++;
            isMoving = false;
        }

        //currentWorldPosition.x += Math.cos(angle) * dt * speed;
        //currentWorldPosition.y += Math.sin(angle) * dt * speed;
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