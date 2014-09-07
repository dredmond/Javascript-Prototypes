var level1 = (function () {
    var progressUpdate = 1000,
        progressUpdateElapsed = 0,
        oldMapOffset = null,
        mouseDragStart = null,
        selectedUnits = [],
        prog = null,
        prog2 = null,
        btn = null,
        btn2 = null;

    var gameMap = null;

    function load() {
        gameMap = map.createMap({
            tileSize: 45,
            dataSettings: {
                height: 15,
                width: 15,
                tiles: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 4, 4, 0, 1, 1, 1, 0, 2, 0,
                    4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 1, 1, 0, 2, 0,
                    0, 0, 0, 0, 0, 0, 4, 4, 0, 2, 2, 0, 0, 2, 0,
                    0, 0, 0, 3, 3, 0, 4, 4, 0, 2, 3, 3, 0, 2, 0,
                    0, 0, 0, 3, 3, 0, 0, 0, 0, 2, 3, 3, 0, 2, 0,
                    0, 0, 0, 4, 4, 4, 4, 4, 4, 2, 3, 3, 0, 0, 0,
                    0, 0, 4, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 2, 2,
                    0, 0, 4, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 2, 0,
                    0, 0, 3, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2, 0,
                    0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0
                ]
            }
        });

        btn = ui.button.create('test', {
            text: 'Button 1',
            size: { height: 30, width: 75 },
            location: {x: 50, y: 25},
            click: function(evt) {
                alert('button clicked.');
                console.log(evt, evt.getName());
            }
        });

        btn2 = ui.button.create('test2', {
            text: 'Button 2',
            size: { height: 30, width: 75 },
            location: { x: 50, y: 60 },
            click: function (evt) {
                alert('button 2 clicked.');
                console.log(evt, evt.getName());
            }
        });

        ui.addComponent(btn);
        ui.addComponent(btn2);

        prog = ui.progressbar.create('progress', {
            size: { height: 12, width: 75 },
            location: { x: 300, y: 300 },
            backgroundColor: 'white',
            progressColor: 'green',
            progressChanged: function (progBar, progress) {
                console.log('Green Progress: ' + progress);
            },
            completed: function (progBar) {
                console.log('Green Completed');
            }
        });
        ui.addComponent(prog);

        prog2 = ui.progressbar.create('progress2', {
            size: { height: 12, width: 75 },
            location: { x: 300, y: 314 },
            minProgress: 0,
            maxProgress: 200,
            backgroundColor: 'white',
            progressColor: 'red',
            progressChanged: function(progBar, progress) {
                console.log('Red Progress: ' + progress);
            },
            completed: function(progBar) {
                console.log('Red Completed');
            }
        });
        ui.addComponent(prog2);

        var u = unit(gameMap);
        u.setLocation({ x: 0, y: 14 });

        selectedUnits.push(u);
        gameMap.addUnit(u);
    }

    function mouseEvent(evt) {
        //switch
    }

    function keyboardEvent(evt) {
        
    }

    function resize(evt) {
        gameMap.setViewSize(evt);
    }

    function update(currentGameTime, dt) {
        // Update the map.
        gameMap.update(currentGameTime, dt);

        progressUpdateElapsed += dt;
        if (progressUpdateElapsed >= progressUpdate) {
            progressUpdateElapsed -= progressUpdate;

            if (!prog.hasCompleted())
                prog.incProgress(5);
            if (!prog2.hasCompleted())
                prog2.incProgress(1);
        }
    }

    function draw(ctx) {
        // Draw the map
        gameMap.draw(ctx);
    }




    return {
        load: load,
        mouseEvent: mouseEvent,
        keyboardEvent: keyboardEvent,
        resize: resize,
        update: update,
        draw: draw
    };
});