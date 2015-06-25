/// <reference path="battery.ts"/>

module Circuits {
    export class Main {
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        currentTime: number;
        lastTime: number;
        maxUpdateTime = 1000;
        components: Component[] = [];

        constructor() {
            this.canvas = <HTMLCanvasElement>document.getElementById("circuits");
            this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
            //this.ctx.scale(1, 1);
            let battery = new Battery(0);
            battery.location = { x: 0, y: 1 };
            this.components.push(battery);

            battery = new Battery(1);
            battery.location = { x: 60, y: 60 };

            this.components.push(battery);
            this.canvas.addEventListener("click", this.mouseClick);
            this.canvas.addEventListener("keypress", this.keyPress);
        }

        start() {
            requestAnimationFrame(this.loop);
        }

        mouseClick = (evt: MouseEvent) => {
            console.log(evt);
        }

        keyPress = (evt: KeyboardEvent) => {
            console.log(evt);
        }

        loop = (time: number) => {
            this.currentTime = time;

            requestAnimationFrame(this.loop);

            var dt = this.getDeltaTime();
            if (dt < this.maxUpdateTime)
                return;

            // Run fixed update loop.
            while (dt >= this.maxUpdateTime) {
                dt -= this.maxUpdateTime;
                console.log(new Date() + ": Updated");
            }

            //this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.globalAlpha = 1.0;
            this.ctx.fillStyle = "#000000";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


            this.ctx.save();

            // Draw the scene.
            var components = this.components;
            for (let c in components) {
                if (components.hasOwnProperty(c)) {
                    components[c].draw(this.ctx);
                }
            }

            this.ctx.restore();

            this.lastTime = time;
        }

        getDeltaTime(): number {
            return this.currentTime - this.lastTime;
        }

        getContext(): CanvasRenderingContext2D {
            return this.ctx;
        }
    }

    export var global = new Main();
}

Circuits.global.start();