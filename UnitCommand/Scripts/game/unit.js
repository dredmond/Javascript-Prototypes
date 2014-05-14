var unit = unit || (function (gameMap) {
    var currentLocation = { x: 0, y: 0 },
        destinationLocation = { x: 19, y: 19 },
        speed = 1.5,
        state = 0,
        health = 10,
        equipment = {},
        carrying = null,
        tileSize = gameMap.getTileSize(),
        unitSize = 5,
        unitSizeDiameter = unitSize + unitSize;

    function update(currentGameTime, dt) {
        
    }

    function draw(ctx) {
        ctx.save();

        var startPos = centerUnit(gameMap.getDisplayOffset(currentLocation)),
            endPos = centerUnit(gameMap.getDisplayOffset(destinationLocation));

        debug(ctx, startPos, endPos);

        ctx.beginPath();
        ctx.arc(startPos.x + unitSize, startPos.y + unitSize, unitSize, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(endPos.x + unitSize, endPos.y + unitSize, unitSize, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();

        ctx.restore();
    }

    function centerUnit(location) {
        var offset = Math.round((tileSize - unitSizeDiameter) / 2);

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

    function debug(ctx, startPos, endPos) {
        ctx.beginPath();
        ctx.moveTo(startPos.x + unitSize, startPos.y + unitSize);
        ctx.lineTo(endPos.x + unitSize, endPos.y + unitSize);
        ctx.strokeStyle = 'blue';
        ctx.stroke();
    }

    return {
        update: update,
        draw: draw,
        setLocation: setLocation,
        getLocation: getLocation,
        moveTo: moveTo
    };
});