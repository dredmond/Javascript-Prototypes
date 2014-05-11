var unit = unit || (function (gameMap) {
    var currentLocation = { x: 0, y: 0 },
        destinationLocation = { x: 19, y: 19 },
        speed = 1.5,
        state = 0,
        health = 10,
        equipment = {},
        carrying = null;

    function update(currentGameTime, dt) {
        
    }

    function draw(ctx, mapTranslationFunc) {
        ctx.save();

        var pos = mapTranslationFunc(currentLocation, 8, 8);

        ctx.beginPath();
        ctx.arc(pos.x + 8, pos.y + 8, 8, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();

        pos = mapTranslationFunc(destinationLocation, 8, 8);

        ctx.beginPath();
        ctx.arc(pos.x + 8, pos.y + 8, 8, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();

        ctx.restore();
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