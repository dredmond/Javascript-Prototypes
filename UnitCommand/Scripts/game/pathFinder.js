var pathFinder = pathFinder || (function(gameMap) {
    var openTiles = null,
        walkableTiles = null,
        navigationTiles = null;

    setMap(gameMap);
    console.log(walkableTiles);

    function createTile(x, y, walkable) {
        var parent = null,
            tileData = {
                debug: debug,
                calculateDistance: calculateDistance,
                setParent: setParent,
                calculateTotal: calculateTotal,
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

            tileData.hScore = (xDist + yDist) * 10;
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

        return tileData;
    }
    
    function calculatePath(start, end) {
        openTiles = [];
        navigationTiles = [];

        var tile = walkableTiles[start.x][start.y],
            endTile = walkableTiles[end.x][end.y],
            pathFound = false;

        tile.gScore = 0;
        tile.calculateDistance(endTile);
        tile.calculateTotal();

        openTiles.push(tile);

        while (openTiles.length > 0) {
            tile = popSmallestTile();

            // Some kind of error occured?
            if (tile === null || typeof tile === 'undefined')
                break;

            tile.closed = true;

            if (tile === endTile) {
                pathFound = true;
                break;
            }

            console.log('Parent Tile: \r\n' + tile.debug());

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

                    console.log('Neighbor Tile (Added): \r\n' + neighborTile.debug());
                    continue;
                }

                // if in open and G is lower set parent and recalculate values.
                var gScore = calculateGScore(tile, neighborTile);
                if (neighborTile.gScore > gScore) {
                    neighborTile.setParent(tile);
                    neighborTile.calculateTotal();

                    console.log('Neighbor Tile (Updated): \r\n' + neighborTile.debug());
                    continue;
                }
            }

            console.log('');
        }

        if (pathFound) {
            console.log('PATH FOUND!');

            var pathTile = endTile;
            while (pathTile != null) {
                navigationTiles.unshift(pathTile);
                pathTile = pathTile.getParent();
            }
        } else {
            console.log('NO PATH FOUND!');
        }

        return navigationTiles;
    }

    function calculateGScore(parent, child) {
        var weight = (parent.x === child.x || parent.y === child.y) ? 10 : 10.5;

        return parent.gScore + (weight);
    }

    function getNeighborTiles(currentTile) {
        var neighbors = [];

        var startX = currentTile.x - 1,
            startY = currentTile.y - 1,
            finalX = currentTile.x + 1,
            finalY = currentTile.y + 1;

        for (var x = startX; x <= finalX; x++) {
            for (var y = startY; y <= finalY; y++) {
                if (x === currentTile.x && y === currentTile.y)
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
            if (smallestTile.fScore < openTiles[i].fScore) {
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

    return {
        calculatePath: calculatePath,
        setMap: setMap
    };
});