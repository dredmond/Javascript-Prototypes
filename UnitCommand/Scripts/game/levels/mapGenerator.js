var areaTypes = {
    basic: 0,
    start: 1,
    exit: 2
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
                proto = mapClass.prototype;

            function getRandom(minVal, maxVal) {
                return Math.floor(Math.min(Math.random() * maxVal + minVal, maxVal));
            }

            function areaExists(x, y) {
                return areas[x][y] !== null;
            }

            function addArea(area) {
                if (areaExists(area.x, area.y))
                    return false;

                areas[area.x][area.y] = area;
                return true;
            }

            function generateMap(totalAreas) {
                if (!totalAreas || totalAreas < difficulty) {
                    totalAreas = getRandom(difficulty, difficulty * 3);
                }

                console.log(totalAreas);

                var maxAreas = Math.ceil(totalAreas / 2);
                for (var x = 0; x < maxAreas; x++) {
                    areas[x] = [];
                    for (var y = 0; y < maxAreas; y++) {
                        areas[x][y] = null;
                    }
                }

                console.log(areas);

                // Remove start and end from totalArea Count
                totalAreas -= 2;

                var areaAdded = false;

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

                areaAdded = false;
                while (!areaAdded) {
                    // Create Ending Area
                    endArea = {
                        x: getRandom(0, maxAreas),
                        y: getRandom(0, maxAreas),
                        type: areaTypes.exit
                    };

                    areaAdded = addArea(endArea);
                }

                console.log(startArea, endArea);

                // Build other areas and attach them.
                for (var i = 0; i < totalAreas; i++) {
                    var area = null;
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