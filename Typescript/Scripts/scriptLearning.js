var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './test'], function(require, exports, Test) {
    var Animal = (function () {
        function Animal(theName) {
            this.name = theName;
        }
        return Animal;
    })();

    var Rhino = (function (_super) {
        __extends(Rhino, _super);
        function Rhino() {
            _super.call(this, "Rhino");
        }
        return Rhino;
    })(Animal);

    var Employee = (function () {
        function Employee(theName) {
            this.name = theName;
        }
        return Employee;
    })();

    var animal = new Animal("Goat");
    var rhino = new Rhino();
    var employee = new Employee("Bob");

    console.log(animal);
    console.log(rhino);
    console.log(employee);

    var blah = new Test.Test1();
    blah.testVal = "test";
    console.log(blah);
    console.log(blah.testVal);

    // Create a new object that uses the ISomething interface.
    var blah1 = {};
    blah1.blah = "test";
});
//# sourceMappingURL=scriptLearning.js.map
