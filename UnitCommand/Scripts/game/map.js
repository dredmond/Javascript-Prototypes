var map = map || (function () {
    function createMap(settings) {
        settings = settings || {};

        var mData = settings.mapData ? settings.mapData : mapData.createMap(settings.dataSettings),
            tileSize = settings.tileSize ? settings.tileSize : 20;

        function getDisplayOffset(location) {
            return {
                x: location.x * tileSize,
                y: location.y * tileSize
            };
        }

        return {
            getTileSize: function () {
                return tileSize;
            },
            getDisplayOffset: getDisplayOffset,
            getMapData: function() {
                return mData;
            }
        };
    }

    return {
        createMap: createMap
    }
})();