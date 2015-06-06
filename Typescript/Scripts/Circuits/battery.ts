/// <reference path="component.ts"/>
/// <reference path="pin.ts"/>

module Circuits {
    export class Battery extends Component {
        constructor(public voltage: number) {
            super(0);
        }

        initializePins(): void {
            console.log('initialized from Battery.');

            super.initializePins();
        }

        simulate(): void {
            super.simulate();
        }
    }
}