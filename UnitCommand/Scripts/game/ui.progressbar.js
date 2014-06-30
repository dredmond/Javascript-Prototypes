ui.progressbar = ui.progressbar || (function(name, options) {
    function progressbarObj() {};

    var result = new progressbarObj(),
        maxProgress = 100,
        minProgress = 0,
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

    return result;
});