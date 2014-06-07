var pathFinder = pathFinder || (function(gameMap) {
    var openTiles = null,
        walkableTiles = null,
        currentTile = null,
        endTile = null,
        searchStatusTypes = pathFinder.searchStatusTypes,
        currentStatus = searchStatusTypes.searching,
        walkedTiles = null,
        allowDiagonals = false;

    setMap(gameMap);
    //console.log(walkableTiles);

    function createTile(x, y, walkable) {
        var parent = null,
            tileData = {
                debug: debug,
                calculateDistance: calculateDistance,
                setParent: setParent,
                calculateTotal: calculateTotal,
                reset: reset,
                x: x,
                y: y,
                isWalkable: walkable,
                getParent: function () {
                    return parent;
                },
                closed: false,
                gScore: 0,
                hScore: 0,
                fScore: 0
            };

        function calculateDistance(destTile) {
            var xDist = Math.abs(x - destTile.x),
                yDist = Math.abs(y - destTile.y);

            tileData.hScore = (xDist + yDist);
        }

        function setParent(parentTile) {
            parent = parentTile;
            tileData.gScore = calculateGScore(parentTile, tileData);
        }

        function calculateTotal() {
            tileData.fScore = tileData.gScore + tileData.hScore;
        }

        function debug() {
            return 'x: ' + tileData.x + '\r\n' +
                'y: ' + tileData.y + '\r\n' +
                'gScore: ' + tileData.gScore + '\r\n' +
                'hScore: ' + tileData.hScore + '\r\n' +
                'fScore: ' + tileData.fScore + '\r\n';
        }

        function reset() {
            parent = null;
            tileData.closed = false;
            tileData.gScore = 0;
            tileData.fScore = 0;
            tileData.hScore = 0;
        }

        return tileData;
    }
    
    function calculatePath(start, end) {
        openTiles = [];
        walkedTiles = [];

        for (var x in walkableTiles) {
            for (var y in walkableTiles[x]) {
                walkableTiles[x][y].reset();
            }
        }

        if (!(gameMap.inBounds(start.x, start.y) && gameMap.inBounds(end.x, end.y))) {
            currentStatus = searchStatusTypes.noPath;
            return;
        }

        var tile = walkableTiles[start.x][start.y];
        endTile = walkableTiles[end.x][end.y];
        currentStatus = searchStatusTypes.searching;

        if (!tile.isWalkable || !endTile.isWalkable) {
            currentStatus = searchStatusTypes.noPath;
            return;
        }

        tile.gScore = 0;
        tile.calculateDistance(endTile);
        tile.calculateTotal();

        openTiles.push(tile);
    }

    function nextStep() {
        if (currentStatus !== searchStatusTypes.searching)
            return true;

        if (openTiles.length === 0) {
            currentStatus = searchStatusTypes.noPath;
            return true;
        }

        var tile = popSmallestTile();

        // Some kind of error occured?
        if (tile === null || typeof tile === 'undefined') {
            currentStatus = searchStatusTypes.noPath;
            return true;
        }

        currentTile = tile;
        tile.closed = true;

        // Push current tile to the walked tile list.
        walkedTiles.push(tile);

        if (tile === endTile) {
            currentStatus = searchStatusTypes.pathFound;
            return true;
        }

        //console.log('Parent Tile: \r\n' + tile.debug());

        var neighbors = getNeighborTiles(tile);
        for (var i = 0; i < neighbors.length; i++) {
            var neighborTile = neighbors[i];

            // if neighbor is closed or unwalkable skip it.
            if (neighborTile.closed || !neighborTile.isWalkable) {
                continue;
            }

            var inOpenSet = isTileInList(openTiles, neighborTile);

            // if not in open add to open set parent and calculate values.
            if (!inOpenSet) {
                neighborTile.setParent(tile);
                neighborTile.calculateDistance(endTile);
                neighborTile.calculateTotal();

                openTiles.push(neighborTile);

                //console.log('Neighbor Tile (Added): \r\n' + neighborTile.debug());
                continue;
            }

            // if in open and G is lower set parent and recalculate values.
            var gScore = calculateGScore(tile, neighborTile);
            if (neighborTile.gScore > gScore) {
                neighborTile.setParent(tile);
                neighborTile.calculateTotal();

                //console.log('Neighbor Tile (Updated): \r\n' + neighborTile.debug());
                continue;
            }
        }

        return false;
    }

    function draw(ctx, tileSize) {
        for (var x in walkableTiles) {
            for (var y in walkableTiles[x]) {
                var tile = walkableTiles[x][y];

                ctx.font = '10px Georgia';
                ctx.fillStyle = 'ffffff';
                ctx.fillText(tile.isWalkable ? '1' : '0', x * tileSize + 2, y * tileSize + 8);

                if (tile.fScore === 0)
                    continue;

                ctx.fillStyle = '000000';
                var textSize = ctx.measureText(tile.fScore);
                ctx.fillText(tile.fScore, x * tileSize + (tileSize - textSize.width - 2), y * tileSize + 8);

                ctx.fillText(tile.gScore, x * tileSize + 2, y * tileSize + (tileSize - 4));

                textSize = ctx.measureText(tile.hScore);
                ctx.fillText(tile.hScore, x * tileSize + (tileSize - textSize.width - 2), y * tileSize + (tileSize - 4));

                if (tile.closed) {
                    ctx.fillStyle = 'rgba(255, 0, 0, .25)';
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }
        }
    }

    function calculateGScore(parent, child) {
        var weight = (parent.x === child.x || parent.y === child.y) ? 1 : 1.5;

        return parent.gScore + (weight);
    }

    function getNeighborTiles(tile) {
        var neighbors = [];

        var startX = tile.x - 1,
            startY = tile.y - 1,
            finalX = tile.x + 1,
            finalY = tile.y + 1;

        for (var x = startX; x <= finalX; x++) {
            for (var y = startY; y <= finalY; y++) {
                if (x === tile.x && y === tile.y)
                    continue;

                if (!allowDiagonals && !(x === tile.x || y === tile.y))
                    continue;

                if (gameMap.inBounds(x, y)) {
                    neighbors.push(walkableTiles[x][y]);
                }
            }
        }

        return neighbors;
    }

    function popSmallestTile() {
        if (openTiles.length === 0)
            return null;

        var smallestTile = openTiles[0],
            index = 0;

        for (var i = 0; i < openTiles.length; i++) {
            if (smallestTile.fScore === openTiles[i].fScore && smallestTile.hScore < openTiles[i].hScore) {
                continue;
            } else if (smallestTile.fScore < openTiles[i].fScore) {
                continue;
            }

            index = i;
            smallestTile = openTiles[i];
        }

        openTiles.splice(index, 1);

        return smallestTile;
    }

    function isTileInList(tileList, tile) {
        for (var i = 0; i < tileList.length; i++) {
            var tmpTile = tileList[i];

            if (tmpTile === tile) {
                return true;
            }
        }

        return false;
    }
     
    function setMap(map) {
        var mData = map.getMapData(),
            mDataWalkable = mData.getWalkableTiles();

        // Reset the tile array.
        walkableTiles = [];

        for (var x = 0; x < mDataWalkable.length; x++) {
            walkableTiles[x] = [];

            for (var y = 0; y < mDataWalkable[x].length; y++) {
                walkableTiles[x][y] = createTile(x, y, mDataWalkable[x][y]);
            }
        }
    }

    function setAllowDiagonals(value) {
        allowDiagonals = value;
    }

    return {
        calculatePath: calculatePath,
        nextStep: nextStep,
        setMap: setMap,
        draw: draw,
        currentStatus: function() {
            return currentStatus;
        },
        getCurrentPath: function () {
            var navigationTiles = [];

            var pathTile = currentTile;
            while (pathTile != null) {
                navigationTiles.unshift(pathTile);
                pathTile = pathTile.getParent();
            }

            return navigationTiles;
        },
        setAllowDiagonals: setAllowDiagonals
    };
});

pathFinder.searchStatusTypes = {
    searching: 0,
    pathFound: 1,
    noPath: 2
};