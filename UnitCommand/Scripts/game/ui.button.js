ui.button = ui.button || (function (name, options) {
    if (!name)
        throw 'A button must have a name.';

    function buttonObj() { }

    var result = new buttonObj(),
        location = { x: 0, y: 0 },
        size = { width: 50, height: 50 },
        text = 'button',
        color = 'black';

    function handleClickEvent() {
        if (options.click === null)
            return;

        options.click(result);
    }

    function handleDrawEvent(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(location.x, location.y, size.width, size.height);
        ctx.fillStyle = color;
        ctx.fillText(text, location.x+10, location.y+25, size.width);
    }

    function handleUpdateEvent(currentGameTime, dt) {
        
    }

    function setLocation(x, y) {
        
    }

    function setSize(height, width) {
        
    }

    function setText(value) {
        text = value;
    }

    function setFont(font) {

    }

    function setColor(value) {
        color = value;
    }

    options = options || {};
    options.click = (typeof (options.click) === 'function') ? options.click : null;

    buttonObj.prototype.getName = function () {
        return name;
    };

    buttonObj.prototype.click = handleClickEvent;
    buttonObj.prototype.draw = handleDrawEvent;
    buttonObj.prototype.update = handleUpdateEvent;
    buttonObj.prototype.setLocation = setLocation;
    buttonObj.prototype.setSize = setSize;
    buttonObj.prototype.setText = setText;
    buttonObj.prototype.setFont = setFont;
    buttonObj.prototype.setColor = setColor;

    return result;
});