var levelClass = (function (extension) {
    var canvas = null;

    var baseClass = jsExtender({
        constructor: function (canvasNode) {
            canvas = canvasNode;
            this.load();
        },
        load: function () {
            console.log('base loaded');
        },
        inputEvent: function (evt) {

        },
        resize: function (evt) {

        },
        update: function(currentGameTime, dt) {

        },
        draw: function(ctx) {

        },
        getCanvas: function() {
            return canvas;
        },
        getCanvasOffset: function() {
            return {
                top: canvas.offsetTop,
                left: canvas.offsetLeft
            };
        }
    });

    return baseClass.extend(extension);
});