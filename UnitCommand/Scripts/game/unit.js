var unit = unit || (function (gameMap) {
    var currentLocation = { x: 0, y: 0 },
        destinationLocation = { x: 19, y: 19 },
        speed = 5,
        maxSpeedMod = 15,
        state = 0,
        health = 10,
        equipment = {},
        carrying = null,
        tileSize = gameMap.getTileSize(),
        unitSize = 10,
        unitSizeDiameter = unitSize + unitSize,
        navigationTiles = [],
        navigationTilesBuffer = [],
        pFinder = pathFinder(gameMap),
        lastNavigationStepTime = 0,
        lastMovementTime = 0,
        lastSearchState = pathFinder.searchStatusTypes.searching,
        currentWorldPosition = { x: 0, y: 0 },
        nextWorldPosition = null,
        needsToRecalculatePath = false,
        pathIndex = 1;

    pFinder.setAllowDiagonals(false);

    function navigate() {
        pathIndex = 1;
        pFinder.calculatePath(currentLocation, destinationLocation);
        lastSearchState = pathFinder.searchStatusTypes.searching;
    }

    function distance(source, destination) {
        var dist = tileDistance(source, destination),
            x2 = dist.x * dist.x,
            y2 = dist.y * dist.y;
            
        return Math.sqrt(x2 + y2);
    }

    function tileDistance(source, destination) {
        var x = source.x - destination.x,
            y = source.y - destination.y;

        return {
            x: x,
            y: y
        };
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

        if (needsToRecalculatePath && nextWorldPosition == null) {
            needsToRecalculatePath = false;
            navigate();
        }

        pFinder.nextStep();

        while (lastNavigationStepTime >= 300) {
            lastNavigationStepTime -= 300;

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
                followPath(updateTime);
            }
        }
    }

    function draw(ctx) {
        ctx.save();

        var startPos = currentWorldPosition,
            endPos = centerUnit(gameMap.getDisplayOffset(destinationLocation));

        debug(ctx, startPos, endPos);

        if (navigationTiles.length > 0) {
            ctx.beginPath();
            ctx.arc(endPos.x + unitSize, endPos.y + unitSize, unitSize, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'red';
            ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(startPos.x + unitSize, startPos.y + unitSize, unitSize, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(50, 225, 50, 1)';
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
        needsToRecalculatePath = true;
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
            pFinder.clear();
            navigationTiles = [];
            return;
        }

        if (nextWorldPosition === null) {
            var nextTile = navigationTiles[pathIndex];
            nextWorldPosition = centerUnit(gameMap.getDisplayOffset(nextTile));
        }

        currentLocation = gameMap.worldToMapCoords(currentWorldPosition.x, currentWorldPosition.y);

        var dist = distance(currentWorldPosition, nextWorldPosition),
            tileDist = tileDistance(currentWorldPosition, nextWorldPosition),
            angle = Math.atan2(tileDist.y, tileDist.x) + Math.PI,
            finalDist = distance(currentWorldPosition, centerUnit(gameMap.getDisplayOffset(navigationTiles[navigationTiles.length - 1])));

        var cosAngle = Math.cos(angle),
            sinAngle = Math.sin(angle);

        var speedModifier = Math.min(finalDist * .9, maxSpeedMod);

        var movementX = cosAngle * speed * dt * speedModifier,
            movementY = sinAngle * speed * dt * speedModifier;

        var nextX = currentWorldPosition.x + movementX / 1000,
            nextY = currentWorldPosition.y + movementY / 1000;

        //console.log('x: ' + nextX);
        //console.log('y: ' + nextY);
        //console.log('dist: ' + dist);
        currentWorldPosition.x = nextX;
        currentWorldPosition.y = nextY;

        if (dist <= 1) {
            pathIndex++;
            nextWorldPosition = null;
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
        moveTo: moveTo
    };
});