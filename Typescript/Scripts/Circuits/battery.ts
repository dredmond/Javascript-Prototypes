/// <reference path="component.ts"/>
/// <reference path="pin.ts"/>

module Circuits {
    export class Battery extends Component {
        public positive: Pin;
        public negative: Pin;

        constructor(public voltage: number) {
            super();
        }
    }
}