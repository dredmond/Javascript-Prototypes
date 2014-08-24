ui.button = ui.button || (function () {
    var button = ui.component.extend({
        constructor: function (name, options) {
            this.base(name, options);

            this.options.font = !jsExtender.isUndefinedOrNull(options.font) ? options.font : '15px Georgia';
            this.options.text = !jsExtender.isUndefinedOrNull(options.text) ? options.text : '';
        },
        draw: function (ctx) {
            ctx.save();

            var offset = this.options.borderSize / 2;
            ctx.translate(this.options.location.x, this.options.location.y);

            if (this.getFocus()) {
                ctx.fillStyle = 'rgb(200,200,200)';
            } else {
                ctx.fillStyle = 'white';
            }

            ctx.fillRect(offset, offset, this.options.size.width, this.options.size.height);
            ctx.strokeStyle = this.options.borderColor;
            ctx.lineWidth = this.options.borderSize;
            ctx.strokeRect(offset, offset, this.options.size.width, this.options.size.height);

            ctx.font = this.options.font;

            if (this.getFocus()) {
                ctx.fillStyle = 'rgb(255,0,0)';
            } else {
                ctx.fillStyle = this.options.backgroundColor;
            }

            var textSize = ctx.measureText(this.options.text),
                textXOffset = Math.round((this.options.size.width - textSize.width) / 2),
                textYOffset = Math.round((this.options.size.height + 7.5) / 2);

            ctx.translate(textXOffset, textYOffset);
            ctx.fillText(this.options.text, offset, offset, this.options.size.width);

            ctx.restore();
        }
    });

    return button;
})();