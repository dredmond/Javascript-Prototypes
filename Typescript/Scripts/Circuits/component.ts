module Circuits {
    export interface IComponent {
        pins: Pin[];

        initializePins(): void;
        simulate(): void;
    }

    export class Component implements IComponent {
        pins: Pin[];

        constructor(additionalPins: number) {
            // 2 Pins are always required for a component.
            // How they are used are up to the component's implementation.
            this.pins.push(new Pin());
            this.pins.push(new Pin());

            for (var i: number = 0; i < additionalPins; i++) {
                this.pins.push(new Pin());
            }
        }

        initializePins(): void {
            
        }

        simulate(): void {
            
        }
    }
}

