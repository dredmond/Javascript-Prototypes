var areaTypes = {
    empty: 0,
    basic: 1,
    start: 2,
    exit: 3
};

var directions = {
    north: 0,
    east: 1,
    south: 2,
    west: 3
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

        proto.appendFunctions({
            getConnections: function() {
                return connections;
            },
            draw: function (ctx) {
                connections.draw(ctx);
            },
            update: function(currentGameTime, dt) {
                connections.update(currentGameTime, dt);
            }
        });
    }
});

var mapGenerator = (function (extension) {
    var mapClass = jsExtender({
        constructor: function (difficulty) {
            var areas = [],
                areaDisplaySize = 40,
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
                return true;
            }

            function removeArea(area) {
                if (area.x < 0 || area.y < 0 || area.x >= maxAreas || area.y >= maxAreas)
                    return false;

                if (!areaExists(area.x, area.y))
                    return false;

                areas[area.x][area.y] = null;
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

                    available.push({ x: testArea.x, y: testArea.y });
                }

                testArea = { x: x, y: y - 1 };
                for (; testArea.y <= y + 1; testArea.y+=2) {
                    if (testArea.y == y || !isAreaValid(testArea))
                        continue;

                    available.push({ x: testArea.x, y: testArea.y });
                }

                return available;
            }

            function getAllNeighborLocations(area) {
                var available = [];
                var x = area.x,
                    y = area.y;

                var testArea = { x: x - 1, y: y };
                for (; testArea.x <= x + 1; testArea.x += 2) {
                    if (testArea.x == x || !isAreaInMapBoundry(testArea))
                        continue;

                    available.push({ x: testArea.x, y: testArea.y });
                }

                testArea = { x: x, y: y - 1 };
                for (; testArea.y <= y + 1; testArea.y += 2) {
                    if (testArea.y == y || !isAreaInMapBoundry(testArea))
                        continue;

                    available.push({ x: testArea.x, y: testArea.y });
                }

                return available;
            }

            function generateMap(totalAreas) {
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

                console.log(areas);

                //createLinearMap();
                createCellularAutomataMap(totalAreas, 0);


                // Build Max Allowed Counters
                // Exit = 1 - We can only ever have 1 exit.
                // Secrets = ?
                // Keys = ?
                // Doors = ?
                // Shops = ?

                // Steps to Create Map
                // 1. Select random cell for starting area.
                // 2. Get neighbor cells and select one randomly.
                // 3. If cell doesn't exist create it. (Repeat step 2)
                // 4. Increment cell count and distance from starting cell.

                // Cell Creation Steps
                // 1. Randomly decide on area type. (Normal, Secret, Key, Shop, Exit, etc.)
                // 2. Check if rules allow that room type to exist in the chosen location. (Otherwise, Repeat Step 1)
                // 3. Negate room counter for the selected type.
                // 4. Return to Map Creation Step.
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

                var areaStack = [];

                startArea.dist = 0;
                var currentArea = startArea;
                var i = 0;
                var farthestArea = null,
                    dist = 0;

                var fn = function () {
                    if (i >= totalAreas || currentArea == null) {
                        if (steps > 0 && currentArea !== null) {
                            currentArea = startArea;
                            i = 0;
                            steps--;
                        } else {
                            farthestArea.type = areaTypes.exit;
                            showMap();
                            return;
                        }
                    }

                    i++;

                    var availableNeighbors = getAvailableNeighborLocations(currentArea);
                    areaStack.push.apply(areaStack, availableNeighbors);

                    var nextArea = getRandomNeighbor(areaStack);
                    availableNeighbors = getAvailableNeighborLocations(nextArea);

                    // Remove area's with too many neighbors or with no neighbors.
                    //if (availableNeighbors.length == 0 || availableNeighbors.length == 4) {
                        //currentArea = areaStack.pop();

                        // Too many neigbors so remove
                        // removeArea(currentArea);
                    //} else {


                        //if (availableNeighbors.length == 0 || availableNeighbors.length == 4) {
                        //    // removeArea(nextArea);
                        //} else {
                    if (availableNeighbors.length >= 2) {
                        addArea(nextArea);
                        currentArea = nextArea;
                        nextArea.dist = dist;
                        dist++;
                    } else {
                        dist--;
                    }

                    if (farthestArea == null || dist >= farthestArea.dist) {
                        farthestArea = currentArea;
                    }

                        //}
                    //}

                    setTimeout(fn, 500);
                    showMap();
                };

                setTimeout(fn, 500);

                // Rules:
                // Start with all cells around starting cell as off.
                // If cell has 1 neighbor active then it is also active.
                // If cell has 4 neighbors active than it is not active.
                // If cell has 3 neighbors active than it 
            }

            function showMap() {
                var map = $('#mapArea');
                map.empty();

                for (var x = 0; x < areas.length; x++) {
                    for (var y = 0; y < areas[x].length; y++) {
                        var area = $('<div>');

                        if (!areaExists(x, y)) {
                            displayArea(map, { x: x, y: y }, 'orange', '');
                            continue;
                        }

                        var areaTmp = areas[x][y];

                        switch (areaTmp.type) {
                            case areaTypes.basic:
                                displayArea(map, areaTmp, 'white', areaTmp.id);
                                break;
                            case areaTypes.start:
                                displayArea(map, areaTmp, 'green', 'START');
                                break;
                            case areaTypes.exit:
                                displayArea(map, areaTmp, 'red', 'END');
                                break;
                            default:
                                break;
                        }

                        map.append(area);
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

            proto.appendFunctions({
                test: function () {
                    console.log('this is a test');
                },
                test2: function() {
                    console.log('test2 from mapClass.');
                }
            });

            if (!proto.generateMap)
                proto.generateMap = generateMap;

            if (!proto.showMap)
                proto.showMap = showMap;
        }
    });

    return mapClass.extend(extension);
});