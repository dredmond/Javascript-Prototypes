ui.button = ui.button || (function (name, options) {
    if (!name)
        throw 'A button must have a name.';

    function buttonObj() { }

    var result = new buttonObj(),
        location = { x: 0, y: 0 },
        size = { width: 100, height: 50 },
        text = 'Button',
        color = 'black',
        borderColor = 'gray',
        hasFocus = false;

    function handleClickEvent() {
        if (options.click === null)
            return;

        options.click(result);
    }

    function handleDrawEvent(ctx) {
        ctx.save();

        ctx.translate(2.5, 2.5);

        if (hasFocus) {
            ctx.fillStyle = 'rgb(200,200,200)';
        } else {
            ctx.fillStyle = 'white';
        }

        ctx.fillRect(location.x, location.y, size.width, size.height);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 5;
        ctx.strokeRect(location.x, location.y, size.width, size.height);
       
        ctx.font = '15px Georgia';

        if (hasFocus) {
            ctx.fillStyle = 'rgb(255,0,0)';
        } else {
            ctx.fillStyle = color;
        }
            
        var textSize = ctx.measureText(text),
            textXOffset = Math.round((size.width - textSize.width) / 2),
            textYOffset = Math.round((size.height + 7.5) / 2);

        ctx.fillText(text, location.x + textXOffset, location.y + textYOffset, size.width);

        ctx.restore();
    }

    function handleUpdateEvent(currentGameTime, dt) {
        hasFocus = containsPoint(ui.mousePos.x, ui.mousePos.y);
    }

    function containsPoint(x, y) {
        return (x >= location.x &&
            x < location.x + size.width &&
            y >= location.y &&
            y < location.y + size.height);
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

    function setBorderColor(value) {
        borderColor = value;
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
    buttonObj.prototype.setBorderColor = setBorderColor;
    buttonObj.prototype.containsPoint = containsPoint;

    return result;
});