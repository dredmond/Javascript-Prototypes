var areaTypes = {
    empty: 0,
    basic: 1,
    start: 2,
    exit: 3,
    queued: 4,
    invalid: 5
};

var directions = {
    north: 1,
    east: 2,
    northEast: 3,
    south: 4,
    southEast: 6,
    west: 8,
    northWest: 9,
    southWest: 12
};

var connectionTypes = {
    unknown: 0,
    attached: 1,
    door: 2,
    wall: 3,
    bridge: 4
};

var connectionClass = jsExtender({
    constructor: function (type, direction, parentArea, childArea) {
        var proto = connectionClass.prototype;
            
        proto.appendFunctions({
            getType: function() {
                return type;
            },
            draw: function (ctx) {

            },
            update: function (currentGameTime, dt) {

            }
        });
    }
});

var connectionCollectionClass = jsExtender({
    constructor: function() {
        var connectionArray = [null, null, null, null],
            proto = connectionCollectionClass.prototype;

        function isValidDirection(direction) {
            return (direction >= 0 && direction < 4);
        }

        proto.appendFunctions({
            hasEmptyConnections: function() {
                return this.getEmptyConnectionDirections().length > 0;
            },
            getEmptyConnectionDirections: function() {
                var emptyConnections = [];
                for (var i = 0; i < connectionArray.length; i++) {
                    if (connectionArray[i] != null)
                        continue;

                    emptyConnections.push(i);
                }

                return emptyConnections;
            },
            hasConnections: function() {
                return this.getConnectionDirections().length > 0;
            },
            getConnectionDirections: function() {
                var emptyConnections = [];
                for (var i = 0; i < connectionArray.length; i++) {
                    if (connectionArray[i] == null)
                        continue;

                    emptyConnections.push(i);
                }

                return emptyConnections;
            },
            setConnection: function(direction, connection) {
                if (!isValidDirection(direction))
                    throw 'Invalid Direction: ' + direction;

                connectionArray[direction] = connection;
            },
            getConnection: function (direction) {
                if (!isValidDirection(direction))
                    throw 'Invalid Direction: ' + direction;

                return connectionArray[direction];
            },
            draw: function (ctx) {
                var connections = this.getConnectionDirections();
                for (var i = 0; i < connections.length; i++) {
                    var direction = connections[i];
                    connectionArray[direction].draw(ctx);
                }
            },
            update: function (currentGameTime, dt) {
                var connections = this.getConnectionDirections();
                for (var i = 0; i < connections.length; i++) {
                    var direction = connections[i];
                    connectionArray[direction].update(currentGameTime, dt);
                }
            }
        });
    }
});

var areaClass = jsExtender({
    constructor: function (type, x, y) {
        var objects = [],
            tiles = [],
            enemies = [],
            connections = connectionCollectionClass.create(),
            proto = areaClass.prototype;

        this.x = x;
        this.y = y;
        this.type = type;

        function getTiles() {
            return tiles;
        }

        function setTiles(tileX, tileY, tile) {
            if (jsExtender.isUndefinedOrNull(tiles[tileX])) {
                tiles[tileX] = [];
            }

            tiles[tileX][tileY] = tile;
        }

        function getConnections() {
            return connections;
        }

        function draw(ctx) {
            connections.draw(ctx);
        }

        function update(currentGameTime, dt) {
            connections.update(currentGameTime, dt);
        }

        proto.appendFunctions({
            getTiles: getTiles,
            setTile: setTiles,
            getConnections: getConnections,
            draw: draw,
            update: update
        });
    }
});

var mapGenerator = (function (extension) {
    var mapClass = jsExtender({
        constructor: function (difficulty) {
            var areas = [],
                areaList = [],
                areaDisplaySize = 44,
                tileSize = 4,
                maxAreas = 0,
                proto = mapClass.prototype,
                areaId = 0;

            function getRandom(minVal, maxVal) {
                return Math.floor(Math.min(Math.random() * maxVal + minVal, maxVal));
            }

            function areaExists(x, y) {
                return areas[x][y] !== null;
            }

            function addArea(area) {
                if (area.x < 0 || area.y < 0 || area.x >= maxAreas || area.y >= maxAreas)
                    return false;

                if (areaExists(area.x, area.y))
                    return false;

                area.id = areaId++;
                areas[area.x][area.y] = area;
                areaList.push(area);
                return true;
            }

            function inMapBoundry(x, y) {
                return (x >= 0 && x < maxAreas && y >= 0 && y < maxAreas);
            }

            function isAreaInMapBoundry(area) {
                return inMapBoundry(area.x, area.y);
            }

            function createRandomNeighbor(parentArea) {
                var neighbors = getAvailableNeighborLocations(parentArea);
                if (neighbors.length == 0)
                    return null;

                var randVal = getRandom(0, neighbors.length);
                var loc = neighbors[randVal];
                var childArea = areaClass.create(areaTypes.basic, loc.x, loc.y);

                return childArea;
            }

            function getRandomNeighbor(areaStack) {
                var childArea = null;

                while (areaStack.length > 0) {
                    var randVal = getRandom(0, areaStack.length);
                    var loc = areaStack[randVal];
                    areaStack.splice(randVal, 1);

                    if (areaExists(loc.x, loc.y))
                        continue;

                    childArea = areaClass.create(areaTypes.basic, loc.x, loc.y);
                    break;
                }

                return childArea;
            }

            function isAreaValid(area) {
                return (isAreaInMapBoundry(area) && !areaExists(area.x, area.y));
            }

            function getAvailableNeighborLocations(area) {
                var available = [];
                var x = area.x,
                    y = area.y;
                    
                var testArea = { x: x - 1, y: y };
                for (; testArea.x <= x + 1; testArea.x += 2) {
                    if (testArea.x == x || !isAreaValid(testArea))
                        continue;

                    available.push({ x: testArea.x, y: testArea.y, type: areaTypes.queued });
                }

                testArea = { x: x, y: y - 1 };
                for (; testArea.y <= y + 1; testArea.y += 2) {
                    if (testArea.y == y || !isAreaValid(testArea))
                        continue;

                    available.push({ x: testArea.x, y: testArea.y, type: areaTypes.queued });
                }

                return available;
            }

            function getDirectionLocation(direction, area) {
                var offset = { x: area.x, y: area.y };

                if ((direction & directions.north) == directions.north) {
                    offset.y++;
                }

                if ((direction & directions.south) == directions.south) {
                    offset.y--;
                }

                if ((direction & directions.east) == directions.east) {
                    offset.x++;
                }

                if ((direction & directions.west) == directions.west) {
                    offset.x--;
                }

                return offset;
            }

            function getNeighborLookup(area) {
                var neighbors = [];

                for (var d in directions) {
                    var direction = directions[d];
                    var loc = getDirectionLocation(direction, area);

                    if (!isAreaInMapBoundry(loc)) {
                        neighbors[direction] = -1;
                    } else if (areaExists(loc.x, loc.y)) {
                        neighbors[direction] = 1;
                    } else {
                        neighbors[direction] = 0;
                    }
                }

                return neighbors;
            }

            function isAreaAllowed(area) {
                var neighbors = getNeighborLookup(area),
                    totalNeighbors = 0;

                for (var i = 0; i < neighbors.length; i++) {
                    if (neighbors[i] == 1)
                        totalNeighbors++;
                }

                switch (area.type) {
                    case areaTypes.start:
                    case areaTypes.basic:
                        /*  sR -> [[ NW,  N, NE ]
                                   [  W,  R,  E ]
                                   [ SW,  S, SE ]]

                            R -> E
                            R -> N
                            R -> S
                            R -> W
                            

                            North && ((NorthWest && West) || (NorthEast && East))
                            1 1 0 = 0
                            1 x 0
                            0 0 0

                            0 1 1 = 0
                            0 x 1
                            0 0 0

                            South && ((SouthWest && West) || (SouthEast && East))
                            0 0 0 = 0
                            0 x 1
                            0 1 1

                            0 0 0 = 0
                            1 x 0
                            1 1 0
                         */
                        if ((neighbors[directions.north] == 1 || neighbors[directions.south] == 1) && (neighbors[directions.east] == 1 || neighbors[directions.west] == 1))
                            return false;
                        break;

                    case areaTypes.exit:

                        if (totalNeighbors > 1)
                            return false;
                        break;
                }

                return true;
            }

            function generateMap(totalAreas) {
                areas = [];
                areaList = [];

                // Get total map size.
                if (!totalAreas || totalAreas < difficulty) {
                    totalAreas = getRandom(difficulty, difficulty * 3);
                }

                console.log(totalAreas);

                // Initialize the map areas.
                maxAreas = Math.ceil(totalAreas / 2);
                for (var x = 0; x < maxAreas; x++) {
                    areas[x] = [];
                    for (var y = 0; y < maxAreas; y++) {
                        areas[x][y] = null;
                    }
                }

                //createLinearMap();
                createCellularAutomataMap(totalAreas, 1);

                // Get list of cells (Neighbors) (Different for random tiles)
                // Add to queue
                // Pull randomly from queue
                // Check requirements for cell   (Different for all algorithms)
                // Add cell.
            }

            function createLinearMap() {
                var startArea = areaClass.create(areaTypes.start, getRandom(0, maxAreas), getRandom(0, maxAreas));
                addArea(startArea);

                var currentArea = startArea;
                for (var i = 0; i < difficulty; i++) {
                    var nextArea = createRandomNeighbor(currentArea);

                    if (!nextArea || !addArea(nextArea))
                        break;

                    currentArea = nextArea;
                }

                if (currentArea && currentArea !== startArea) {
                    currentArea.type = areaTypes.exit;
                }
            }

            function createCellularAutomataMap(totalAreas, steps) {
                var startLoc = { x: getRandom(0, maxAreas), y: getRandom(0, maxAreas) };
                var startArea = areaClass.create(areaTypes.start, startLoc.x, startLoc.y);
                addArea(startArea);

                var areaStack = [],
                    invalidStack = [];

                startArea.dist = 0;
                var currentArea = startArea;
                var i = 0;

                var fn = function () {
                    if (i >= totalAreas || currentArea == null) {
                        if (steps > 0 && currentArea !== null) {
                            currentArea = startArea;
                            i = 0;
                            steps--;
                        } else {
                            var exitLoc = null;
                            areaStack = [];

                            for (i = areaList.length - 1; i >= 0; i--) {
                                availableNeighbors = getAvailableNeighborLocations(areaList[i]);
                                pushCells(areaStack, availableNeighbors);
                            }

                            while (areaStack.length > 0) {
                                exitLoc = getRandomNeighbor(areaStack);
                                exitLoc.type = areaTypes.exit;

                                if (exitLoc && isAreaAllowed(exitLoc)) {
                                    addArea(exitLoc);
                                    break;
                                }
                            }

                            for (i = areaList.length - 1; i >= 0; i--) {
                                createAreaCells(areaList[i]);
                            }

                            showMap();
                            showCells(areaStack);
                            showCells(invalidStack);
                            return;
                        }
                    }

                    i++;

                    var availableNeighbors = getAvailableNeighborLocations(currentArea);
                    pushCells(areaStack, availableNeighbors);

                    var nextArea = getRandomNeighbor(areaStack);

                    // Break out of loop since we didn't find any more areas.
                    if (nextArea == null)
                        currentArea = null;

                    if (nextArea && isAreaAllowed(nextArea)) {
                        addArea(nextArea);
                        currentArea = nextArea;
                    } else if (nextArea) {
                        nextArea.type = areaTypes.invalid;
                        pushCell(invalidStack, nextArea);
                    }

                    setTimeout(fn, 250);
                    showMap();
                    showCells(areaStack);
                    showCells(invalidStack);
                };

                setTimeout(fn, 250);
            }

            function createAreaCells(area) {
                var size = 11,
                    neighbors = getNeighborLookup(area);

                for (var x = 0; x < size; x++) {
                    for (var y = 0; y < size; y++) {
                        var tile = {
                            type: tileTypes.none
                        };

                        if (x == 0 || x == size - 1 || y == 0 || y == size - 1) {
                            tile.type = tileTypes.wall;

                            if (x == 0 && y == 5 && neighbors[directions.west] == 1) {
                                tile.type = tileTypes.door;
                            }
                        }

                        area.setTile(x, y, tile);
                    }
                }
            }

            function pushCell(stack, cell) {
                if (!cellExists(stack, cell)) {
                    stack.push(cell);
                }
            }

            function pushCells(stack, cells) {
                for (var i = 0; i < cells.length; i++) {
                    if (!cellExists(stack, cells[i])) {
                        stack.push(cells[i]);
                    }
                }
            }

            function cellExists(stack, cell) {
                for (var i = 0; i < stack.length; i++) {
                    if (stack[i].x == cell.x && stack[i].y == cell.y) {
                        return true;
                    }
                }

                return false;
            }

            function showCells(cellList) {
                var map = $('#mapArea');

                for (var i = 0; i < cellList.length; i++) {
                    var cell = cellList[i];

                    switch(cell.type) {
                        case areaTypes.queued:
                            displayArea(map, cell, 'gray', '');
                            break;
                        case areaTypes.invalid:
                            displayArea(map, cell, 'black', '');
                            break;
                    }
                }
            }

            function showMap() {
                var map = $('#mapArea');
                map.empty();

                for (var x = 0; x < areas.length; x++) {
                    for (var y = 0; y < areas[x].length; y++) {
                        if (!areaExists(x, y)) {
                            displayArea(map, { x: x, y: y }, 'orange', '');
                            continue;
                        }

                        var areaTmp = areas[x][y],
                            area = null;

                        switch (areaTmp.type) {
                            case areaTypes.basic:
                                area = displayArea(map, areaTmp, 'white', areaTmp.id);
                                break;
                            case areaTypes.start:
                                area = displayArea(map, areaTmp, 'green', 'START');
                                break;
                            case areaTypes.exit:
                                area = displayArea(map, areaTmp, 'red', 'END');
                                break;
                            default:
                                break;
                        }

                        if (area == null)
                            continue;

                        var tiles = areaTmp.getTiles();

                        if (tiles.length > 0) {
                            for (var tileX = 0; tileX < tiles.length; tileX++) {
                                for (var tileY = 0; tileY < tiles[tileX].length; tileY++) {
                                    var tile = tiles[tileX][tileY];
                                    var tileDiv = $('<div class="area-tile">').css('top', tileY * tileSize).css('left', tileX * tileSize);
                                    switch (tile.type) {
                                        case tileTypes.none:
                                            tileDiv.css('background-color', 'white');
                                            break;
                                        case tileTypes.wall:
                                            tileDiv.css('background-color', 'black');
                                            break;
                                        case tileTypes.door:
                                            tileDiv.css('background-color', 'brown');
                                            break;
                                    }
                                    area.append(tileDiv);
                                }
                            }
                        }
                    }
                }
            }

            function displayArea(map, loc, color, text) {
                var area = $('<div>');
                area.addClass('map-area').css('top', loc.y * (areaDisplaySize + 2)).css('left', loc.x * (areaDisplaySize + 2));
                area.css('background-color', color);
                area.html(text);
                map.append(area);

                return area;
            }

            function test() {
                console.log('this is a test');
            }

            function test2() {
                console.log('test2 from mapClass.');
            }

            proto.appendFunctions({
                test: test,
                test2: test2
            });

            if (!proto.generateMap)
                proto.generateMap = generateMap;

            if (!proto.showMap)
                proto.showMap = showMap;
        }
    });

    return mapClass.extend(extension);
});