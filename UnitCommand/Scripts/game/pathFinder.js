var pathFinder = pathFinder || (function(gameMap) {
    var mData = gameMap.getMapData(),
        openTiles = [],
        closedTiles = [],
        //navigatedTiles = [],
        walkableTiles = mData.getWalkableTiles();

    //console.log(walkableTiles);

    function createTile(parentTile, tileLoc) {
        return {
            parent: parentTile,
            x: tileLoc.x,
            y: tileLoc.y,
            g: 0,
            h: 0,
            f: function() {
                return this.g + this.h;
            }
        }
    }

    function calculatePath(start, end) {
        var tile = createTile(null, start);

        tile.g = 0;
        tile.h = calculateHeuristic(tile, end);

        openTiles.push(tile);

        while (openTiles.length > 0) {
            tile = popSmallestTile();
            closedTiles.add(tile);

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
    }
        
    return {
        calculatePath: calculatePath,
        //changeMap: changeMap
    };
});