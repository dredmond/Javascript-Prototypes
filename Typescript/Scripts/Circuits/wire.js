/// <reference path="component.ts"/>
define(["require", "exports"], function(require, exports) {
    (function (Circuits) {
        var Wire = (function () {
            function Wire(c) {
                this.c = c;
            }
            return Wire;
        })();
        Circuits.Wire = Wire;
    })(exports.Circuits || (exports.Circuits = {}));
    var Circuits = exports.Circuits;
});
//var w = new Wire(0, 0, 1, 1);
//console.log(w);
/*
Battery (5v) (+) -> connection -> wire (5v) -> connection -> light (2v drop) -> connection -> wire (0v) -> connection -> Battery (0v) (-)
W / V^2 = 1 / R
*/
//# sourceMappingURL=wire.js.map
