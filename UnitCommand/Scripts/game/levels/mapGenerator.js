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

var mapGenerator = (function (difficulty) {
    var areas = [];

    var mapClass = jsExtender({
        constructor: function () {
            var totalAreas = this.getRandom(difficulty, difficulty * 3);
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
                    x: this.getRandom(0, maxAreas),
                    y: this.getRandom(0, maxAreas),
                    type: areaTypes.start
                };

                areaAdded = this.addArea(startArea);
            }

            areaAdded = false;
            while (!areaAdded) {
                // Create Ending Area
                endArea = {
                    x: this.getRandom(0, maxAreas),
                    y: this.getRandom(0, maxAreas),
                    type: areaTypes.exit
                };

                areaAdded = this.addArea(endArea);
            }

            console.log(startArea, endArea);

            // Build other areas and attach them.
            for (var i = 0; i < totalAreas; i++) {
                var area = null;
                areaAdded = false;

                while (!areaAdded) {
                    area = {
                        x: this.getRandom(0, maxAreas),
                        y: this.getRandom(0, maxAreas),
                        type: areaTypes.basic
                    };

                    areaAdded = this.addArea(area);
                }

                console.log(area);
            }

            console.log(areas);
        },
        getRandom: function(minVal, maxVal) {
            return Math.floor(Math.min(Math.random() * maxVal + minVal, maxVal));
        },
        areaExists: function(x, y) {
            return areas[x][y] !== null;
        },
        addArea: function(area) {
            if (this.areaExists(area.x, area.y))
                return false;

            areas[area.x][area.y] = area;
            return true;
        },
        showMap: function() {
            var map = $('#mapArea');
            map.empty();

            for (var x = 0; x < areas.length; x++) {
                for (var y = 0; y < areas[x].length; y++) {
                    if (!this.areaExists(x, y))
                        continue;

                    var area = $('<div>');
                    area.addClass('map-area').css('top', y * 20).css('left', x * 20);

                    switch (areas[x][y].type) {
                        case areaTypes.start:
                            area.css('background-color', 'green');
                            break;
                        case areaTypes.exit:
                            area.css('background-color', 'red');
                            break;
                        default:
                            break;
                    }

                    map.append(area);
                }
            }
        }
    });

    return mapClass.create();
});