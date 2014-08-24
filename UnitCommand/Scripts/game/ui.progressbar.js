ui.progressbar = ui.progressbar || (function() {
    var progressbar = ui.component.extend({
        constructor: function(name, options) {
            this.base(name, options);

            this.options.maxProgress = !jsExtender.isUndefinedOrNull(options.maxProgress) ? options.maxProgress : 100.0;
            this.options.minProgress = !jsExtender.isUndefinedOrNull(options.minProgress) ? options.minProgress : 0;
            this.options.progressColor = !jsExtender.isUndefinedOrNull(options.progressColor) ? options.progressColor : 'green';
            this.currentProgress = this.options.minProgress;
        },
        draw: function(ctx) {
            ctx.save();

            var offset = this.options.borderSize / 2;
            var progWidth = (this.options.size.width - this.options.borderSize) / this.options.maxProgress * this.currentProgress;

            ctx.fillStyle = this.options.backgroundColor;
            ctx.fillRect(this.options.location.x, this.options.location.y, this.options.size.width, this.options.size.height);

            ctx.fillStyle = this.options.progressColor;
            ctx.fillRect(this.options.location.x + offset, this.options.location.y + offset, progWidth, this.options.size.height - this.options.borderSize);

            ctx.restore();
        },
        update: function(currentGameTime, dt) {
            
        },
        getProgress: function () {
            return this.currentProgress;
        },
        incProgress: function (value) {
            this.setProgress(currentProgress + value);
        },
        setProgress: function (value) {
            this.currentProgress = capInBounds(this, value);
        },
        getMaxProgress: function () {
            return this.options.maxProgress;
        },
        setMaxProgress: function (value) {
            checkMinMax(this.options.minProgress, value);

            this.options.maxProgress = value;

            // Make sure the current progress stays within the bounds.
            this.currentProgress = capInBounds(this, this.currentProgress);
        },
        getMinProgress: function () {
            return this.options.minProgress;
        },
        setMinProgress: function (value) {
            checkMinMax(value, this.options.maxProgress);

            this.options.minProgress = value;

            // Make sure the current progress stays within the bounds.
            this.currentProgress = capInBounds(this, this.currentProgress);
        },
        hasCompleted: function () {
            return this.currentProgress >= this.options.maxProgress;
        }
    });

    function capInBounds(progBar, value) {
        if (value > progBar.options.maxProgress) {
            value = progBar.options.maxProgress;
        }

        if (value < progBar.options.minProgress) {
            value = progBar.options.minProgress;
        }

        return value;
    }

    function checkMinMax(min, max) {
        if (min > max)
            throw 'Min progress cannot exceed max progress. (Min: ' + min + ' Max: ' + max + ')';
    }

    return progressbar;
})();