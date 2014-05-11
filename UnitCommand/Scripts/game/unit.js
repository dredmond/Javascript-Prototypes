var unit = unit || (function (gameMap) {
    var currentLocation = { x: 0, y: 0 },
        destinationLocation = { x: 19, y: 19 },
        speed = 1.5,
        state = 0,
        health = 10,
        equipment = {},
        carrying = null,
        cellSize = gameMap.getCellSize(),
        unitSize = 5,
        unitSizeDiameter = unitSize + unitSize;

    function update(currentGameTime, dt) {
        
    }

    function draw(ctx) {
        ctx.save();

        var pos = centerUnit(gameMap.getDisplayOffset(currentLocation));

        ctx.beginPath();
        ctx.arc(pos.x + unitSize, pos.y + unitSize, unitSize, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();

        pos = centerUnit(gameMap.getDisplayOffset(destinationLocation));

        ctx.beginPath();
        ctx.arc(pos.x + unitSize, pos.y + unitSize, unitSize, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();

        ctx.restore();
    }

    function centerUnit(location) {
        var offset = Math.round((cellSize - unitSizeDiameter) / 2);

        return {
            x: location.x + offset,
            y: location.y + offset
        };
    }

    function moveTo(location) {
        destinationLocation = location;
    }

    function setLocation(location) {
        currentLocation = location;
    }

    function getLocation() {
        return currentLocation;
    }

    return {
        update: update,
        draw: draw,
        setLocation: setLocation,
        getLocation: getLocation,
        moveTo: moveTo
    };
});