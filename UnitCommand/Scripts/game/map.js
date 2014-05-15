var map = map || (function () {
    function createMap(settings) {
        settings = settings || {};

        var mData = settings.mapData ? settings.mapData : mapData.createMap(settings.dataSettings),
            tileSize = settings.tileSize ? settings.tileSize : 20,
            locationXy = {
                x: 0,
                y: 0
            },
            cellMovedElapsed = 0,
            tileTypes = {
                none: 0,
                grass: 1,
                stones: 2,
                water: 3,
                trees: 4
            },
            mapOffset = {
                x: 0,
                y: 0
            },
            viewSize = settings.viewSize ? settings.viewSize : { height: 0, width: 0 };

        function getDisplayOffset(location) {
            return {
                x: location.x * tileSize,
                y: location.y * tileSize
            };
        }

        function update(gameTime, dt) {
            cellMovedElapsed += dt;

            if (cellMovedElapsed > 10) {
                cellMovedElapsed = 0;
                mData.setTile(locationXy, tileTypes.none);

                locationXy.x += 1;
                locationXy.y += 1;

                mData.setTile(locationXy, tileTypes.trees);
            }
        }

        function drawMap(ctx) {
            var gridWidth = mData.getWidth(),
                gridHeight = mData.getHeight();

            for (var i = 0; i < gridWidth; i++) {
                for (var j = 0; j < gridHeight; j++) {
                    drawTile(ctx, i, j);
                }
            }
        }

        function drawTile(ctx, x, y) {
            var location = {
                x: x,
                y: y
            };


            switch (mData.getTile(location)) {
                case tileTypes.grass:
                    ctx.fillStyle = 'rgba(0, 255, 0, 1)';
                    break;
                case tileTypes.stones:
                    ctx.fillStyle = 'rgba(100, 100, 100, 1)';
                    break;
                case tileTypes.water:
                    ctx.fillStyle = 'rgba(0, 0, 255, 1)';
                    break;
                case tileTypes.trees:
                    ctx.fillStyle = 'rgba(0, 125, 0, 1)';
                    break;
                default:
                    ctx.fillStyle = 'rgba(150, 150, 150, 1)';
                    break;
            }

            location = getDisplayOffset(location);

            ctx.beginPath();
            ctx.rect(location.x, location.y, tileSize, tileSize);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fill();
        }

        function draw(ctx) {
            var gridWidth = mData.getWidth(),
                gridHeight = mData.getHeight();

            var gridXOffset = Math.round((viewSize.width - gridWidth * tileSize) / 2),
                gridYOffset = Math.round((viewSize.height - gridHeight * tileSize) / 2);

            ctx.translate(gridXOffset + mapOffset.x, gridYOffset + mapOffset.y);

            drawMap(ctx);
        }

        return {
            getTileSize: function () {
                return tileSize;
            },
            getDisplayOffset: getDisplayOffset,
            getMapData: function() {
                return mData;
            },
            update: update,
            draw: draw,
            getMapOffset: function() {
                return {
                    x: mapOffset.x,
                    y: mapOffset.y
                }
            },
            setMapOffset: function(offset) {
                mapOffset.x = offset.x;
                mapOffset.y = offset.y;
            }
        };
    }

    return {
        createMap: createMap
    }
})();