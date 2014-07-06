var extendableObject = extendableObject || (function() {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var extendableInstance = new extendable();
    function extendable() { }

    extendable.prototype.hasOwnProperty = function(obj, propertyName) {
        return hasOwnProperty.call(obj, propertyName);
    }

    function copyProperties(source, destination) {
        for (var p in source) {
            if (!extendableInstance.hasOwnProperty(source, p))
                continue;

            console.log('Property: ' + p);
        }
    }

    function createPrototype(source, destination) {
        function f() { }

        f.prototype = source;
        destination.prototype = new f();

        copyProperties(source, destination);

        destination.prototype.constructor = destination;
    }

    extendable.prototype.extend = function (source, destination) {
        var base = source.prototype;
        createPrototype(base, destination);
        destination.prototype.parent = base;
    };

    return extendableInstance;
})();

console.log('x1');
function x1() { }
x1.prototype.test = function () {
    console.log('test called in x1.');
    console.log('testing');
};

var x1Instance = new x1();
x1Instance.test();

console.log('x1Extender inherits x1');
function x1Extender(name, birthday) {
    this.name = name;
    this.birthday = birthday;
}

extendableObject.extend(x1, x1Extender);

x1Extender.prototype.test = function () {
    console.log('test called in x1Extender.');
    console.log(this.name + ' ' + this.birthday);

    this.parent.test();
};

var x2 = new x1Extender('donny', '8/22/1984');
x2.test();


console.log('x2Extender inherits x1Extender');
function x2Extender(name, birthday, age) {
    this.parent.constructor(name, birthday);
    this.age = age;
}

extendableObject.extend(x1Extender, x2Extender);

x2Extender.prototype.test = function () {
    console.log('test called in x2Extender.');
    console.log(this.age);
    this.parent.test();
};

var x3 = new x2Extender('donny', '8/22/1984', '29');
x3.test();

for (var p in x3) {
    //if (!extendableObject.hasOwnProperty(x2Extender, p))
    //    continue;

    console.log('Property: ' + p);
}