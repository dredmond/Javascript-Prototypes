/// <reference path="component.ts"/>

module Circuits {
    export class Wire {
        voltage: number;

        constructor(public c: Component) {

        }
    }
}

//var w = new Wire(0, 0, 1, 1);
//console.log(w);


/*
    
    Battery (5v) (+) -> connection -> wire (5v) -> connection -> light (2v drop) -> connection -> wire (0v) -> connection -> Battery (0v) (-)

    W / V^2 = 1 / R 
     
*/