/// <reference path="component.ts"/>
/// <reference path="pin.ts"/>
//import Component = require('component');
//import Wire = require('wire');

module Circuits {
    export class Game {
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        
        constructor() {
            this.canvas = <HTMLCanvasElement>document.getElementById('circuits');
            this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');


        }
    }
}