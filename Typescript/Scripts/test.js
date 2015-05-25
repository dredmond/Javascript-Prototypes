define(["require", "exports"], function(require, exports) {
    (function (Test) {
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
        Test.Test1 = Test1;
    })(exports.Test || (exports.Test = {}));
    var Test = exports.Test;
});
//# sourceMappingURL=test.js.map
