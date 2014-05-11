var unit = unit || (function () {
    var currentLocation = { x: 0, y: 0 },
        destinationLocation = { x: 5, y: 10 },
        speed = 1.5,
        state = 0,
        health = 10,
        equipment = {},
        carrying = null;

    function update(currentGameTime, dt) {
        
    }

    function draw() {
        
    }

    return {
        update: update,
        draw: draw
    };
})();