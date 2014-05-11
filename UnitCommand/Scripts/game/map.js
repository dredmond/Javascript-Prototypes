var map = map || (function() {
    function createMap(mapInitData) {
        var totalCells = mapInitData.height * mapInitData.width,
            mapHeight = mapInitData.height ? mapInitData.height : 10,
            mapWidth = mapInitData.width ? mapInitData.width : 10,
            mapName = mapInitData.name ? mapInitData.name : 'NewMap',
            cells = mapInitData.cells ? mapInitData.cells : [];

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

        return {
            getWidth: function() {
                 return mapWidth;
            },
            getHeight: function() {
                return mapHeight;
            },
            normalizeMapLocation: normalizeMapLocation,
            getRelativeCell: getRelativeCell,
            getCell: getCell,
            setCell: setCell,
            getMapData: getMapData,
            getName: getName,
            setName: setName
        }
    }

    // Map helper functions

    // Controller save, list, load, delete functions

    return {
        createMap: createMap
    }
})();

