ui.button = ui.button || (function (name, options) {
    if (!name)
        throw 'A button must have a name.';

    function buttonObj() { }
    var result = new buttonObj();

    function handleClickEvent() {
        if (options.click === null)
            return;

        options.click(result);
    }

    function handleDrawEvent(ctx) {
        
    }

    function handleUpdateEvent(currentGameTime, dt) {
        
    }

    function setLocation(x, y) {
        
    }

    function setSize(height, width) {
        
    }

    function setText(text) {

    }

    function setFont(font) {

    }

    function setColor(color) {

    }

    // click event
    // name
    // location (x, y)
    // size (w, h)
    // image
    // text
    // font
    // color
    options = options || {};
    options.click = (typeof (options.click) === 'function') ? options.click : null;

    buttonObj.prototype.getName = function () {
        return name;
    };

    buttonObj.prototype.click = handleClickEvent;
    buttonObj.prototype.draw = handleDrawEvent;
    buttonObj.prototype.update = handleUpdateEvent;
    //buttonObj.

    return result;
});