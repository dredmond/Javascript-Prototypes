ui.button = ui.button || (function (name, options) {
    if (!name)
        throw 'A button must have a name.';

    function buttonObj() { }
    var result = new buttonObj();

    function doClickEvent() {
        if (options.click === null)
            return;

        options.click(result);
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

    buttonObj.prototype.click = doClickEvent;

    return result;
});