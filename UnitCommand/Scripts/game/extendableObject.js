var extendableObject = extendableObject || (function() {
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function extendable() { }

    extendable.prototype.hasOwnProperty = function(propertyName) {
        return hasOwnProperty.call(this, propertyName);
    }

    extendable.prototype.extend = function (obj) {
        var base = this,
            tmp = new Object();

        tmp.prototype.constructor = obj;

        return tmp;
    };

    extendable.prototype.parent = function () {

    };

    return new extendable();
})();

var x1 = extendableObject();

function x1Extender() { }

var x2 = x1.extend({
    extendedMethod: function () {
        console.log(this.base.name);

        return 'this is extended in x2.';
    }
});

