var map = map || (function() {
    function createMap(mapInitData) {
        var totalCells = mapInitData.height * mapInitData.width,
            mapHeight = mapInitData.height ? mapInitData.height : 10,
            mapWidth = mapInitData.width ? mapInitData.width : 10,
            mapName = mapInitData.name ? mapInitData.name : 'NewMap',
            cells = mapInitData.cells ? mapInitData.cells : [],
            cellSize = mapInitData.cellSize ? mapInitData.cellSize : 20,
            units = [];

        function setName(newName) {
            mapName = newName;
        }

        function getName() {
            return mapName;
        }

        function getMapData() {
            return {
                name: mapName,
                height: mapHeight,
                width: mapWidth,
                cells: cells
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

            var cellLocation = y * mapHeight + x;

            // Make sure the cell location is never negative.
            while (cellLocation < 0) {
                cellLocation += totalCells;
            }

            return cellLocation;
        }

        function arrayIndexToCoords(index) {
            // Calculate the x and y location based on the cell location in the array.
            index = index % totalCells;
            var y = Math.floor(index / mapHeight),
                x = index - y * mapHeight;

            return {
                x: x,
                y: y
            }
        }

        function getCell(cellLocation) {
            return cells[coordsToArrayIndex(cellLocation.x, cellLocation.y)];
        }

        function setCell(cellLocation, value) {
            cells[coordsToArrayIndex(cellLocation.x, cellLocation.y)] = value;
        }

        function getRelativeCell(cellStartLocation, xOffset, yOffset) {
            var loc = normalizeMapLocation(cellStartLocation.x + xOffset,
                                           cellStartLocation.y + yOffset);
            return getCell(loc);
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

        function getDisplayOffset(location) {
            return {
                x: location.x * cellSize,
                y: location.y * cellSize
            };
        }

        return {
            getWidth: function() {
                 return mapWidth;
            },
            getHeight: function() {
                return mapHeight;
            },
            getCellSize: function() {
                return cellSize;
            },
            normalizeMapLocation: normalizeMapLocation,
            getRelativeCell: getRelativeCell,
            getCell: getCell,
            setCell: setCell,
            getMapData: getMapData,
            getName: getName,
            setName: setName,
            addUnit: addUnit,
            getUnitAt: getUnitAt,
            removeUnit: removeUnit,
            forEachUnit: forEachUnit,
            getDisplayOffset: getDisplayOffset
        }
    }

    // Map helper functions

    // Controller save, list, load, delete functions

    return {
        createMap: createMap
    }
})();

