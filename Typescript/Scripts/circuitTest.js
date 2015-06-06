var Circuits;
(function (Circuits) {
    var Component = (function () {
        function Component(additionalPins) {
            // 2 Pins are always required for a component.
            // How they are used are up to the component's implementation.
            this.pins.push(new Circuits.Pin());
            this.pins.push(new Circuits.Pin());

            for (var i = 0; i < additionalPins; i++) {
                this.pins.push(new Circuits.Pin());
            }
        }
        Component.prototype.initializePins = function () {
        };

        Component.prototype.simulate = function () {
        };
        return Component;
    })();
    Circuits.Component = Component;
})(Circuits || (Circuits = {}));
/// <reference path="component.ts"/>
var Circuits;
(function (Circuits) {
    var Pin = (function () {
        function Pin() {
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
            _super.call(this, 0);
            this.voltage = voltage;
        }
        Battery.prototype.initializePins = function () {
            _super.prototype.initializePins.call(this);
        };

        Battery.prototype.simulate = function () {
            _super.prototype.simulate.call(this);
        };
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
