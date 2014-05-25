var pathFinder = pathFinder || (function(gameMap) {
    var openTiles = [],
        walkableTiles = null;

    setMap(gameMap);
    console.log(walkableTiles);

    function createTile(x, y, walkable) {
        var parent = null,
            closed = false,
            tileData = {
                calculateDistance: calculateDistance,
                setParent: setParent,
                calculateTotal: calculateTotal,
                x: x,
                y: y,
                isWalkable: walkable,
                getParent: function () {
                    return parent;
                },
                isClosed: function () {
                    return closed;
                },
                close: function () {
                    closed = true;
                },
                gScore: 0,
                hScore: 0,
                fScore: 0
            };

        function calculateDistance(destTile) {
            var xDist = Math.abs(x - destTile.x),
                yDist = Math.abs(y - destTile.y);

            tileData.hScore = 10 * (xDist + yDist);
        }

        function setParent(parentTile) {
            parent = parentTile;
            tileData.gScore = parent.gScore() + 10;
        }

        function calculateTotal() {
            tileData.fScore = tileData.gScore + tileData.hScore;
        }

        return tileData;
    }
    
    function calculatePath(start, end) {
        var tile = createTile(null, start);

        //tile.g = 0;
        //tile.h = calculateHeuristic(tile, end);

        openTiles.push(tile);

        while (openTiles.length > 0) {
            tile = popSmallestTile();
            // closedTiles.add(tile);

            var neighbors = getNeighborTiles(tile);
            for (var i = 0; i < neighbors.length; i++) {
                // if neighbor is closed or unwalkable skip it.
                if(!isWalkable(neighbors[i])) {
                    continue;
                }

                // if not in open add to open set parent and calculate values.


                // if in open and G is lower set parent and recalculate values.
            }

        }
    }

    function getNeighborTiles(currentTile) {
        var neighbors = [];
        // Need to figure this part out.
        neighbors.push(walkableTiles[currentTile.x - 1][currentTile.y + 1]);
        neighbors.push(walkableTiles[currentTile.x - 1][currentTile.y]);
        neighbors.push(walkableTiles[currentTile.x - 1][currentTile.y - 1]);

        neighbors.push(walkableTiles[currentTile.x + 1][currentTile.y + 1]);
        neighbors.push(walkableTiles[currentTile.x + 1][currentTile.y]);
        neighbors.push(walkableTiles[currentTile.x + 1][currentTile.y - 1]);

        neighbors.push(walkableTiles[currentTile.x][currentTile.y + 1]);
        neighbors.push(walkableTiles[currentTile.x][currentTile.y - 1]);

        return neighbors;
    }

    function popSmallestTile() {
        if (openTiles.length === 0)
            return null;

        var smallestScore = openTiles[0].f(),
            index = 0;

        for (var i = 0; i < openTiles.length; i++) {
            if (smallestScore >= openTiles[i].f()) {
                continue;
            }

            index = i;
            smallestScore = openTiles[i].f();
        }

        return openTiles.splice(index, 1);
    }

    /*
    function isTileInList(tileList, tile) {
        for (var i = 0; i < tileList.length; i++) {
            var tmpTile = tileList[i];

            if (tmpTile.x === tile.x && tmpTile.y === tile.y) {
                return true;
            }
        }

        return false;
    }

    function isWalkable(tileLoc) {
        if (walkableTiles[tileLoc.x][tileLoc.y] === 0)
            return false;

        for (var i = 0; i < closedTiles.length; i++) {
            var t = closedTiles[i];

            if (t.x === tileLoc.x && t.y === tileLoc.y)
                return false;
        }

        return true;
    }

    // Cheat and just add 10 to the last known g score.
    function calculateStartDistance(startTile) {
        return 10 + startTile.g;
    }

    function calculateHeuristic(currentTile, endTile) {
        var xDist = Math.abs(currentTile.x - endTile.x),
            yDist = Math.abs(currentTile.y - endTile.y);

        return 10 * Math.max(xDist, yDist);
    }*/
     
    function setMap(map) {
        var mData = map.getMapData(),
            mDataWalkable = mData.getWalkableTiles();

        // Reset the tile array.
        walkableTiles = [];

        for (var x = 0; x < mDataWalkable.length; x++) {
            walkableTiles[x] = [];

            for (var y = 0; y < mDataWalkable[x].length; y++) {
                walkableTiles[x][y] = createTile(x, y, mDataWalkable[x][y]);
                walkableTiles[x][y].calculateDistance({ x: 19, y: 10 });
            }
        }
    }

    return {
        calculatePath: calculatePath,
        setMap: setMap
    };
});