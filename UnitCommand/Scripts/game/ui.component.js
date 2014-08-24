ui.component = ui.component || (function () {
        var component = jsExtender({
            constructor: function(name, options) {
                if (!name)
                    throw 'Component must have a name.';

                this.name = name;
                this.hasFocus = false;

                if (!options)
                    return;

                this.options = {
                    location: !jsExtender.isUndefinedOrNull(options.location) ? options.location : { x: 0, y: 0 },
                    size: !jsExtender.isUndefinedOrNull(options.size) ? options.size : { height: 20, width: 20 },
                    borderSize: !jsExtender.isUndefinedOrNull(options.borderSize) ? options.borderSize : 4,
                    borderColor: !jsExtender.isUndefinedOrNull(options.borderColor) ? options.borderColor : 'gray',
                    backgroundColor: !jsExtender.isUndefinedOrNull(options.backgroundColor) ? options.backgroundColor : 'black',
                    click: !jsExtender.isUndefinedOrNull(options.click) ? options.click : null,
                    mouseOut: !jsExtender.isUndefinedOrNull(options.mouseOut) ? options.mouseOut : null,
                    mouseOver: !jsExtender.isUndefinedOrNull(options.mouseOver) ? options.mouseOver : null,
                };
            },
            getName: function() {
                return this.name;
            },
            getFocus: function() {
                return this.hasFocus;
            },
            setFocus: function(focus) {
                this.hasFocus = focus;
            },
            setLocation: function(x, y) {
                this.options.location.x = x;
                this.options.location.y = y;
            },
            setSize: function(height, width) {
                this.options.size.width = width;
                this.options.size.height = height;
            },
            setBorderSize: function(borderSize) {
                this.options.borderSize = borderSize;
            },
            setBorderColor: function (borderColor) {
                this.options.borderColor = borderColor;
            },
            setBackgroundColor: function(backgroundColor) {
                this.options.backgroundColor = backgroundColor;
            },
            containsPoint: function(x, y) {
                return (x >= this.options.location.x + this.options.borderSize &&
                    x < this.options.location.x + this.options.size.width &&
                    y >= this.options.location.y + this.options.borderSize &&
                    y < this.options.location.y + this.options.size.height);
            },
            draw: function(ctx) {
                throw 'Draw not implemented';
            },
            update: function(currentGameTime, dt) {
                var oldFocus = this.hasFocus;
                this.setFocus(this.containsPoint(ui.mousePos.x, ui.mousePos.y));

                if (oldFocus !== this.hasFocus) {
                    if (this.hasFocus)
                        this.mouseOver();
                    else
                        this.mouseOut();
                }
            },
            click: function() {
                if (this.options.click) {
                    this.options.click(this);
                }
            },
            mouseOver: function() {
                if (this.options.mouseOver)
                    this.options.mouseOver(this);
            },
            mouseOut: function() {
                if (this.options.mouseOut)
                    this.options.mouseOut(this);
            }
        });

    return component;
})();