ui.progressbar = ui.progressbar || (function(name, options) {
    function progressbarObj() {};

    var result = new progressbarObj(),
        maxProgress = 100.0,
        minProgress = 0.0,
        size = options.size || { width: 100, height: 12 },
        location = options.location || { x: 0, y: 0 },
        currentProgress = minProgress;

    function capInBounds(value) {
        if (value > maxProgress) {
            value = maxProgress;
        }

        if (value < minProgress) {
            value = minProgress;
        }

        return value;
    }

    function checkMinMax(min, max) {
        if (min > max)
            throw 'Min progress cannot exceed max progress. (Min: ' + min + ' Max: ' + max +')';
    }

    progressbarObj.prototype.getProgress = function () {
        return currentProgress;
    };

    progressbarObj.prototype.incProgress = function (value) {
        setProgress(currentProgress + value);
    };

    progressbarObj.prototype.setProgress = function(value) {
        currentProgress = capInBounds(value);
    };

    progressbarObj.prototype.getMaxProgress = function () {
        return maxProgress;
    };

    progressbarObj.prototype.setMaxProgress = function (value) {
        checkMinMax(minProgress, value);

        maxProgress = value;

        // Make sure the current progress stays within the bounds.
        currentProgress = capInBounds(currentProgress);
    };

    progressbarObj.prototype.getMinProgress = function () {
        return minProgress;
    };

    progressbarObj.prototype.setMinProgress = function (value) {
        checkMinMax(value, maxProgress);

        minProgress = value;

        // Make sure the current progress stays within the bounds.
        currentProgress = capInBounds(currentProgress);
    };

    progressbarObj.prototype.hasCompleted = function () {
        return currentProgress >= maxProgress;
    };

    function handleDrawEvent(ctx) {
        ctx.save();

        var progWidth = (size.width - 4) / maxProgress * currentProgress;

        ctx.fillStyle = 'white';
        ctx.fillRect(location.x, location.y, size.width, size.height);

        ctx.fillStyle = 'green';
        ctx.fillRect(location.x + 2, location.y + 2, progWidth, size.height - 4);

        ctx.restore();
    }

    function handleUpdateEvent(currentGameTime, dt) {

    }

    progressbarObj.prototype.containsPoint = function (x, y) {
        return (x >= location.x &&
            x < location.x + size.width &&
            y >= location.y &&
            y < location.y + size.height);
    }

    progressbarObj.prototype.draw = handleDrawEvent;
    progressbarObj.prototype.update = handleUpdateEvent;
    
    return result;
});