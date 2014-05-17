﻿var pathFinder = pathFinder || (function(gameMap) {
    var mData = gameMap.getMapData(),
        openTiles = [],
        closedTiles = [],
        navigatedTiles = [],
        walkableTiles = mData.getWalkableTiles();

    function createTile(location) {
        return {
            x: location.x,
            y: location.y,
            g: 0,
            h: 0,
            f: function() {
                return this.g + this.h;
            }
        }
    }

    function calculatePath(start, end) {
        var goalTile = createTile(end),
            tile = createTile(start);

        tile.g = 0;
        tile.h = calculateHeuristic(tile, goalTile);

        openTiles.push(tile);

        while (openTiles.length > 0) {
            
        }
    }

    function getNeighborTiles(currentTile) {
        
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
        changeMap: changeMap
    };
});