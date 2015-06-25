/// <reference path="component.ts"/>

module Circuits {
    export class Battery extends Component {
        constructor(public voltage: number) {
            super(0);
        }

        initializePins(): void {
            console.log("initialized from Battery.");

            super.initialize();
        }

        draw(ctx: CanvasRenderingContext2D): void {
            ctx.save();
            ctx.translate(this.location.x, this.location.y);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#FF0000";
            ctx.strokeRect(0, 0, 50, 20);

            ctx.beginPath();
            ctx.moveTo(0, 20);
            ctx.lineTo(0, 30);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(20, 20);
            ctx.lineTo(20, 30);
            ctx.stroke();

            ctx.restore();

            super.draw(ctx);
        }

        simulate(): void {
            //super.simulate();
        }
    }
}