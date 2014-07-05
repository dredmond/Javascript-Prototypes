var extendableObject = extendableObject || (function() {
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function extendable() { }

    extendable.prototype.hasOwnProperty = function(propertyName) {
        return hasOwnProperty.call(this, propertyName);
    }

    function createPrototype(source, destination) {
        function f() { }

        f.prototype = source;
        destination.prototype = new f();

        destination.prototype.constructor = destination;
    }

    extendable.prototype.extend = function (source, destination) {
        var base = source.prototype;
        createPrototype(base, destination);
        destination.prototype.parent = base;
    };

    return new extendable();
})();

function x1() { }
x1.prototype.test = function () {
    console.log('testing');
};

var x1Instance = new x1();
x1Instance.test();

function x1Extender(name, birthday) {
    this.name = name;
    this.birthday = birthday;
}

extendableObject.extend(x1, x1Extender);

x1Extender.prototype.test = function () {
    console.log(this.name + ' ' + this.birthday);

    this.parent.test();
};

var x2 = new x1Extender('donny', '8/22/1984');
x2.test();

