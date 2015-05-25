/// <reference path="wire.ts"/>

class Battery {
    public positive: Circuits.Wire;
    public negative: Circuits.Wire;

    constructor(public voltage: number) {
        
    }
}