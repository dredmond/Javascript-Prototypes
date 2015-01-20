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
    constructor: function (type) {
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

        proto.appendFunctions({
            getConnections: function() {
                return connections;
            },
            getType: function() {
                return type;
            },
            setType: function(areaType) {
                type = areaType;
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
                areaDisplaySize = 50,
                maxAreas = 0,
                proto = mapClass.prototype;

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

                areas[area.x][area.y] = area;
                return true;
            }

            function inMapBoundry(x, y) {
                return (x >= 0 && x < maxAreas && y >= 0 && y < maxAreas);
            }

            function isAreaInMapBoundry(area) {
                return inMapBoundry(area.x, area.y);
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

                buildMapGraph(null, difficulty);

                //var startNode = buildMapGraph(null, maxAreas, maxAreas, 15);
                //console.log(startNode);


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

                // Map Grammar
                // S -> R
                // 
            }

            function buildMapGraph(startLoc, totalNodes) {
                if (jsExtender.isUndefinedOrNull(startLoc)) {
                    startLoc = {
                        x: getRandom(0, maxAreas),
                        y: getRandom(0, maxAreas),
                        type: areaTypes.start
                    };

                    addArea(startLoc);
                }

                var currentLoc = startLoc;

                for (var i = 0; i < totalNodes; i++) {
                    var availableChildren = getAvailableLocations(currentLoc);
                    var randVal = getRandom(0, availableChildren.length);
                    var child = availableChildren[randVal];
                    child.type = areaTypes.basic;
                    currentLoc = child;
                    addArea(child);
                }
            }

            function getAvailableLocations(loc) {
                var children = [],
                    north = { x: loc.x, y: loc.y + 1 },
                    south = { x: loc.x, y: loc.y - 1 },
                    east = { x: loc.x + 1, y: loc.y },
                    west = { x: loc.x - 1, y: loc.y }

                if (isAreaInMapBoundry(north) && !areaExists(north.x, north.y))
                    children.push(north);

                if (isAreaInMapBoundry(south) && !areaExists(south.x, south.y))
                    children.push(south);

                if (isAreaInMapBoundry(east) && !areaExists(east.x, east.y))
                    children.push(east);

                if (isAreaInMapBoundry(west) && !areaExists(west.x, west.y))
                    children.push(west);

                return children;
            }

            function getChildrenLocations(loc) {
                var children = [],
                    north = { x: loc.x, y: loc.y + 1 },
                    south = { x: loc.x, y: loc.y - 1 },
                    east = { x: loc.x + 1, y: loc.y },
                    west = { x: loc.x - 1, y: loc.y }

                if (isAreaInMapBoundry(north) && areaExists(north.x, north.y))
                    children.push(north);

                if (isAreaInMapBoundry(south) && areaExists(south.x, south.y))
                    children.push(south);

                if (isAreaInMapBoundry(east) && areaExists(east.x, east.y))
                    children.push(east);

                if (isAreaInMapBoundry(west) && areaExists(west.x, west.y))
                    children.push(west);

                return children;
            }

            function addNodeRandomly(current, next) {
                var randomDir = null;

                while (true) {
                    var availableDirs = getAvailableDirections(current);

                    // Randomly choose a new current node if the current node has no room.
                    if (availableDirs.length === 0) {
                        randomDir = getRandomDirectionName();
                        current = current[randomDir];
                        continue;
                    }

                    var rand = getRandom(0, availableDirs.length),
                        dirName = availableDirs[rand];
                    current[dirName] = next;
                    next[getReverseDirectionName(dirName)] = current;
                    break;
                }
            }

            function getRandomDirectionName() {
                var randomVal = getRandom(0, 4);
                return getDirectionName(randomVal);
            }

            function getDirectionName(dirNum) {
                for (var d in directions) {
                    if (directions[d] === dirNum)
                        return d;
                }

                return null;
            }

            function getReverseDirectionName(directionName) {
                if (directionName === 'north') {
                    return 'south';
                }

                if (directionName === 'south') {
                    return 'north';
                }

                if (directionName === 'east') {
                    return 'west';
                }

                if (directionName === 'west') {
                    return 'east';
                }
            }

            function getAvailableDirections(node) {
                var availableDirections = [];

                if (node == null || node.north === null ) {
                    availableDirections.push('north');
                }

                if (node == null || node.east === null) {
                    availableDirections.push('east');
                }

                if (node == null || node.south === null) {
                    availableDirections.push('south');
                }

                if (node == null || node.west === null) {
                    availableDirections.push('west');
                }

                return availableDirections;
            }

            function createAreaNode(type) {
                return {
                    type: type,
                    north: null,
                    east: null,
                    south: null,
                    west: null
                };
            }

            function showMap() {
                var map = $('#mapArea');
                map.empty();

                for (var x = 0; x < areas.length; x++) {
                    for (var y = 0; y < areas[x].length; y++) {
                        if (!areaExists(x, y))
                            continue;

                        var area = $('<div>');
                        area.addClass('map-area').css('top', y * areaDisplaySize).css('left', x * areaDisplaySize);

                        switch (areas[x][y].type) {
                            case areaTypes.basic:
                                area.css('background-color', 'white');
                                break;
                            case areaTypes.start:
                                area.css('background-color', 'green');
                                area.html('START');
                                break;
                            case areaTypes.exit:
                                area.css('background-color', 'red');
                                area.html('END');
                                break;
                            default:
                                break;
                        }

                        map.append(area);
                    }
                }
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