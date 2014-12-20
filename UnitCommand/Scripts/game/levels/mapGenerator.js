var areaTypes = {
    empty: 0,
    basic: 1,
    start: 2,
    exit: 3
};

var direction = {
    up: 0,
    down: 1,
    left: 2,
    right: 3
};

var areaClass = (function (extension) {
    var objects = [],
        tiles = [],
        enemies = [],
        type = 0;

    var areaBaseClass = jsExtender({
        constructor: function () {

        },
        draw: function (ctx) {
            // draw tiles
            // draw objects
            // draw enemies
        },
        update: function (currentGameTime, dt) {

        }
    });

    return areaBaseClass.extend(extension);
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

            function getAvailableChildLocations(area) {
                var available = [],
                    x = area.x,
                    y = area.y;

                if (x < maxAreas - 2 && !areaExists(x + 1, y))
                    available.push({ x: x + 1, y: y });

                if (x > 0 && !areaExists(x - 1, y))
                    available.push({ x: x - 1, y: y });

                if (y < maxAreas - 2 && !areaExists(x, y + 1))
                    available.push({ x: x, y: y + 1 });

                if (y > 0 && !areaExists(x, y - 1))
                    available.push({ x: x, y: y - 1 });

                return available;
            }

            function canHaveNeighbors(area) {
                return getAvailableChildLocations(area).length > 0;
            }

            function inMapBoundry(x, y) {
                return (x >= 0 && x < maxAreas && y >= 0 && y < maxAreas);
            }

            function isAreaInMapBoundry(area) {
                return inMapBoundry(area.x, area.y);
            }

            function getRandomNeighbor(area, allowNeighbors) {
                var x = area.x,
                    y = area.y;

                allowNeighbors = !jsExtender.isUndefinedOrNull(allowNeighbors) ? allowNeighbors : true;


            }

            function generateMap(totalAreas) {
                if (!totalAreas || totalAreas < difficulty) {
                    totalAreas = getRandom(difficulty, difficulty * 3);
                }

                console.log(totalAreas);

                maxAreas = Math.ceil(totalAreas / 2);
                for (var x = 0; x < maxAreas; x++) {
                    areas[x] = [];
                    for (var y = 0; y < maxAreas; y++) {
                        areas[x][y] = null;
                    }
                }

                console.log(areas);

                // Remove start and end from totalArea Count
                totalAreas -= 2;

                var areaAdded = false,
                    i,
                    area = null,
                    nextDirection;

                // Create Starting Area
                var startArea = null, endArea = null;

                while (!areaAdded) {
                    // Create Starting Area
                    startArea = {
                        x: getRandom(0, maxAreas),
                        y: getRandom(0, maxAreas),
                        type: areaTypes.start
                    };

                    areaAdded = addArea(startArea);
                }

                var currentArea = startArea;
                for (i = 0; i < difficulty; i++) {
                    areaAdded = false;

                    if (!currentArea)
                        break;

                    while (!areaAdded && canHaveChildren(currentArea)) {
                        area = {
                            x: currentArea.x,
                            y: currentArea.y,
                            type: areaTypes.basic
                        };

                        nextDirection = getRandom(0, 3);
                        switch (nextDirection) {
                            case direction.up:
                                area.y += 1;
                                break;
                            case direction.down:
                                area.y -= 1;
                                break;
                            case direction.left:
                                area.x -= 1;
                                break;
                            case direction.right:
                                area.y += 1;
                                break;
                        }

                        areaAdded = addArea(area);
                    }

                    currentArea = area;
                }

                areaAdded = false;
                while (!areaAdded && canHaveChildren(currentArea)) {
                    // Create Ending Area
                    endArea = {
                        x: currentArea.x,
                        y: currentArea.y,
                        type: areaTypes.exit
                    };

                    nextDirection = getRandom(0, 3);
                    switch (nextDirection) {
                        case direction.up:
                            endArea.y += 1;
                            break;
                        case direction.down:
                            endArea.y -= 1;
                            break;
                        case direction.left:
                            endArea.x -= 1;
                            break;
                        case direction.right:
                            endArea.y += 1;
                            break;
                    }

                    areaAdded = addArea(endArea);
                }

                console.log(startArea, endArea);

                // Build other areas and attach them.
                for (i = 0; i < totalAreas; i++) {
                    areaAdded = false;

                    while (!areaAdded) {
                        area = {
                            x: getRandom(0, maxAreas),
                            y: getRandom(0, maxAreas),
                            type: areaTypes.basic
                        };

                        areaAdded = addArea(area);
                    }

                    console.log(area);
                }

                console.log(areas);
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