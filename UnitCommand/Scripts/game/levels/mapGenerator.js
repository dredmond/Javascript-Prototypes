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
            var totalAreas = this.getRandom(difficulty, difficulty * 2);
            console.log(totalAreas);

            // Remove start and end from totalArea Count
            totalAreas -= 2;

            // Create Starting Area
            var startArea = {
                type: areaTypes.start
            };

            // Create Ending Area
            var endArea = {
                type: areaTypes.end
            };

            // Build other areas and attach them.
            for (var i = 0; i < totalAreas; i++) {
                
            }
        },
        getRandom: function(minVal, maxVal) {
            return Math.floor(Math.random() * maxVal) + minVal;
        }
    });

    return mapClass.create();
});

for (var i = 0; i < 20; i++) {
    var map = mapGenerator(5);
}