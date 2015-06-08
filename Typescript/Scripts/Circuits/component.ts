module Circuits {
    export interface ISize {
        height: number;
        width: number;
    }

    export interface ILocation {
        x: number;
        y: number;
    }

    export interface IComponent {
        pins: Pin[];
        location: ILocation;
        size: ISize;

        initialize(): void;
        draw(): void;
        simulate(): void;
        update(): void;
    }

    export class Component implements IComponent {
        pins: Pin[] = [];
        location: ILocation;
        size: ISize;
        image: string;

        constructor(additionalPins: number) {
            // 2 Pins are always required for a component.
            // How they are used are up to the component's implementation.
            this.pins.push(new Pin('Pin0', {
                x: 1,
                y: 1
            }));

            this.pins.push(new Pin('Pin1', {
                x: 1,
                y: 1
            }));

            for (var i: number = 0; i < additionalPins; i++) {
                this.pins.push(new Pin());
            }

            this.initialize();
        }

        initialize(): void {
            console.log('initialized from Component');
        }

        draw(): void {
            
        }

        update(): void {
            
        }

        simulate(): void {

        }
    }
}

