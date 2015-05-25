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
    var Pin = (function () {
        function Pin(component) {
            this.component = component;
        }
        return Pin;
    })();
    Circuits.Pin = Pin;
})(Circuits || (Circuits = {}));
//var w = new Wire(0, 0, 1, 1);
//console.log(w);
/*
Battery (5v) (+) -> pin (5v) -> light (2v drop) -> pin (0v) -> Battery (0v) (-)
W / V^2 = 1 / R
*/
/// <reference path="component.ts"/>
/// <reference path="pin.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Circuits;
(function (Circuits) {
    var Battery = (function (_super) {
        __extends(Battery, _super);
        function Battery(voltage) {
            _super.call(this);
            this.voltage = voltage;
        }
        return Battery;
    })(Circuits.Component);
    Circuits.Battery = Battery;
})(Circuits || (Circuits = {}));
/// <reference path="component.ts"/>
/// <reference path="pin.ts"/>
//import Component = require('component');
//import Wire = require('wire');
var s = new Circuits.Component();
var w = new Circuits.Pin(s);
/// <reference path="component.ts"/>
/// <reference path="pin.ts"/>
var Circuits;
(function (Circuits) {
    var Light = (function (_super) {
        __extends(Light, _super);
        function Light() {
            _super.call(this);
        }
        return Light;
    })(Circuits.Component);
    Circuits.Light = Light;
})(Circuits || (Circuits = {}));
//# sourceMappingURL=circuitTest.js.map
