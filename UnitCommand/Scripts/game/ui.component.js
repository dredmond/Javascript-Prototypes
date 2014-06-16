ui.component = ui.component || (function (name) {
    if (!name)
        throw 'Componenent must have a name.';

    function componentObj() { }
    var component = new componentObj();

    componentObj.prototype.getName = function() {
        return name;
    };

    return component;
});