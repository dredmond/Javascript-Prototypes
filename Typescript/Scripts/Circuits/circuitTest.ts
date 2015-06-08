/// <reference path="component.ts"/>
/// <reference path="pin.ts"/>
//import Component = require('component');
//import Wire = require('wire');

module Circuits {

    class Main {
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        currentTime: number;
        lastTime: number;
        maxUpdateTime: number = 1000;

        constructor() {
            this.canvas = <HTMLCanvasElement>document.getElementById('circuits');
            this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
            //this.ctx.fillStyle = 'red';
            //this.ctx.rect(0, 0, 20, 20);
            //ctx.fill();
            //ctx.strokeStyle = 'red';
            //ctx.strokeRect(40, 50, 20, 20);
        }

        start() {
            requestAnimationFrame(this.loop);
        }

        loop = (time: number) => {
            this.currentTime = time;

            requestAnimationFrame(this.loop);

            var dt = this.getDeltaTime();
            if (dt < this.maxUpdateTime)
                return;

            while (dt >= this.maxUpdateTime) {
                dt -= this.maxUpdateTime;
                console.log(new Date() + ': Updated');
            }

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