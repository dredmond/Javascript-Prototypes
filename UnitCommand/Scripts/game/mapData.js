var mapData = mapData || (function() {
    function createMap(mapInitData) {
        mapInitData = mapInitData || { };

        var mapHeight = mapInitData.height ? mapInitData.height : 10,
            mapWidth = mapInitData.width ? mapInitData.width : 10,
            totalTiles = mapInitData.height * mapInitData.width,
            mapName = mapInitData.name ? mapInitData.name : 'NewMap',
            tiles = mapInitData.tiles ? mapInitData.tiles : [],
            units = [];

        function setName(newName) {
            mapName = newName;
        }

        function getName() {
            return mapName;
        }

        function exportData() {
            return {
                name: mapName,
                height: mapHeight,
                width: mapWidth,
                tiles: tiles
            }
        }

        function normalizeMapLocation(x, y) {
            // Get cell location in the array.
            var cellIndex = coordsToArrayIndex(x, y);
            return arrayIndexToCoords(cellIndex);
        }

        function coordsToArrayIndex(x, y) {
            // Normalize x with width.
            x = x % mapWidth;
            y = y % mapHeight;

            var tileLocation = y * mapHeight + x;

            // Make sure the cell location is never negative.
            while (tileLocation < 0) {
                tileLocation += totalTiles;
            }

            return tileLocation;
        }

        function arrayIndexToCoords(index) {
            // Calculate the x and y location based on the cell location in the array.
            index = index % totalTiles;
            var y = Math.floor(index / mapHeight),
                x = index - y * mapHeight;

            return {
                x: x,
                y: y
            }
        }

        function getTile(tileLocation) {
            return tiles[coordsToArrayIndex(tileLocation.x, tileLocation.y)];
        }

        function setTile(tileLocation, value) {
            tiles[coordsToArrayIndex(tileLocation.x, tileLocation.y)] = value;
        }

        function getRelativeTile(tileStartLocation, xOffset, yOffset) {
            var loc = normalizeMapLocation(tileStartLocation.x + xOffset,
                                           tileStartLocation.y + yOffset);
            return getTile(loc);
        }

        function addUnit(unit) {
            units.push(unit);
        }

        function removeUnit(unit) {
            forEachUnit(function(i, tmpUnit) {
                if (unit === tmpUnit) {
                    units.splice(i, 1);
                    return false;
                }

                return true;
            });
        }

        function getUnitAt(location) {
            var foundUnit = null;

            forEachUnit(function (i, tmpUnit) {
                var currentLoc = tmpUnit.getLocation();

                if (location.x === currentLoc.x && location.y === currentLoc.y) {
                    foundUnit = tmpUnit;
                    return false;
                }

                return true;
            });

            return foundUnit;
        }

        function forEachUnit(unitAction) {
            for (var i = 0; i < units.length; i++) {
                if (!unitAction(i, units[i])) {
                    break;
                }
            }
        }

        return {
            getWidth: function() {
                 return mapWidth;
            },
            getHeight: function() {
                return mapHeight;
            },
            normalizeMapLocation: normalizeMapLocation,
            getRelativeTile: getRelativeTile,
            getTile: getTile,
            setTile: setTile,
            getWalkableTiles: function() {
                var wTiles = [];

                for (var x = 0; x < mapWidth; x++) {
                    wTiles[x] = [];

                    for (var y = 0; y < mapHeight; y++) {
                        var loc = { x: x, y: y },
                            t = getTile(loc);
                        loc.value = (t === tileTypes.grass || t === tileTypes.none) ? 1 : 0;

                        wTiles[x].push(loc);
                    }
                }

                return wTiles;
            },
            exportData: exportData,
            getName: getName,
            setName: setName,
            addUnit: addUnit,
            getUnitAt: getUnitAt,
            removeUnit: removeUnit,
            forEachUnit: forEachUnit,
            coordsToArrayIndex: coordsToArrayIndex,
            arrayIndexToCoords: arrayIndexToCoords
        }
    }

    // Map helper functions

    // Controller save, list, load, delete functions

    return {
        createMap: createMap
    }
})();

