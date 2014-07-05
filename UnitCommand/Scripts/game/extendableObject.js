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
        destination.prototype.constructor = prototype;
    }

    extendable.prototype.extend = function (obj) {
        var base = this;
        createPrototype(base.constructor.prototype, obj);
        obj.prototype.parent = base.constructor.prototype;
        return obj;
    };

    extendable.prototype.parent = function () {

    };

    return new extendable();
});

var x1 = extendableObject();

function x1Extender() { }

var x2 = x1.extend({
    extendedMethod: function () {
        console.log(this.base.name);

        return 'this is extended in x2.';
    }
});

