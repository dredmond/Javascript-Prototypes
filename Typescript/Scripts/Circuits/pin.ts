/// <reference path="component.ts"/>

module Circuits {
    export class Pin {
        name: string;
        location: ILocation;
        voltage: number;

        constructor(name?: string, location?: ILocation) {
            this.name = name;
            this.location = location;
        }
    }
}

//var w = new Wire(0, 0, 1, 1);
//console.log(w);

/*   
    Battery (5v) (+) -> pin (5v) -> light (2v drop) -> pin (0v) -> Battery (0v) (-)

    W / V^2 = 1 / R 
     
*/