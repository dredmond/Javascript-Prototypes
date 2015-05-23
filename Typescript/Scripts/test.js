define(["require", "exports"], function(require, exports) {
    var Test1 = (function () {
        function Test1() {
        }
        Object.defineProperty(Test1.prototype, "testVal", {
            get: function () {
                return this._testVal;
            },
            set: function (newVal) {
                this._testVal = newVal;
            },
            enumerable: true,
            configurable: true
        });

        return Test1;
    })();
    exports.Test1 = Test1;
});
//# sourceMappingURL=test.js.map
