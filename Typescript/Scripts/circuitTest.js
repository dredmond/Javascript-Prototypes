var Circuits;
(function (Circuits) {
    var Component = (function () {
        function Component() {
        }
        return Component;
    })();
    Circuits.Component = Component;
})(Circuits || (Circuits = {}));
/// <reference path="component.ts"/>
var Circuits;
(function (Circuits) {
    var Wire = (function () {
        function Wire(c) {
            this.c = c;
        }
        return Wire;
    })();
    Circuits.Wire = Wire;
})(Circuits || (Circuits = {}));
//var w = new Wire(0, 0, 1, 1);
//console.log(w);
/*
Battery (5v) (+) -> connection -> wire (5v) -> connection -> light (2v drop) -> connection -> wire (0v) -> connection -> Battery (0v) (-)
W / V^2 = 1 / R
*/
/// <reference path="wire.ts"/>
var Battery = (function () {
    function Battery(voltage) {
        this.voltage = voltage;
    }
    return Battery;
})();
/// <reference path="component.ts"/>
/// <reference path="wire.ts"/>
//import Component = require('component');
//import Wire = require('wire');
var s = new Circuits.Component();
var w = new Circuits.Wire(s);
//# sourceMappingURL=circuitTest.js.map
