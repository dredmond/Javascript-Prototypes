var ui = ui || (function () {
    var components = [],
        mousePos = { x: 0, y: 0 };

    function clear() {
        components = [];
    }

    function draw(ctx) {
        for (var c in components) {
            components[c].draw(ctx);
        }
    }

    function update(currentGameTime, dt) {
        for (var c in components) {
            components[c].update(currentGameTime, dt);
        }
    }

    function addComponent(c) {
        components.push(c);
    }

    function removeComponent(c) {
        for (var i in components) {
            if (components[i] === c) {
                components.splice(i, 1);
                break;
            }
        }
    }

    function getComponentFromPoint(x, y) {
        for (var i in components) {
            if (components[i].containsPoint(x, y)) {
                return components[i];
            }
        }

        return null;
    }

    return {
        addComponent: addComponent,
        removeComponent: removeComponent,
        getComponentFromPoint: getComponentFromPoint,
        draw: draw,
        update: update,
        clear: clear,
        mousePos: mousePos
    };
}());