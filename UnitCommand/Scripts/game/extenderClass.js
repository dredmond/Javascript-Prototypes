var extenderClass = (function (extend) {
    function createProto(e) {
        function f() { }
        f.prototype = e;
        return new f();
    }

    function copyProperties(destination, source) {
        for (var p in source) {
            destination[p] = (typeof (destination[p]) === 'function' && typeof (source[p]) === 'function') ?
                wrapFunction(source, destination[p], source[p]) : source[p];
        }
    }

    function wrapFunction(scope, baseFunc, sourceFunc) {

        return function () {
            var oldBase = this.base;

            this.base = baseFunc;
            var result = sourceFunc.apply(this, arguments);
            this.base = oldBase;

            return result;
        };
        //var tmpProto = this.parent;
        //this.parent = 

        // make new func
        // set base func destinationFunc
        // apply sourceFunc
        // return new func
    }

    function addExtend(destination) {
        destination.extend = function (extender) {
            var currentExtender = (typeof (extender) === 'object') ? extender : extender.prototype;
            var extendProto = currentExtender.constructor;

            if (typeof (extendProto) !== 'function' || extendProto === Object.prototype.constructor) {
                extendProto = destination.prototype.constructor;
            } else {
                extendProto = function() { };
            }

            extendProto.prototype = createProto(destination.prototype);
            copyProperties(extendProto.prototype, currentExtender);
            addExtend(extendProto);

            return extendProto;
        }
    }

    var baseExtend = (typeof (extend) === 'object') ? extend : extend.prototype;
    var classConstruct = baseExtend.constructor || function() { };

    classConstruct.prototype = createProto(baseExtend);
    addExtend(classConstruct);

    return classConstruct;
});

var a = extenderClass({
    constructor: function() {
        this.cookieType = 'basic';
    },
    makeCookie: function() {
        return 'I made a ' + this.cookieType + ' cookie!';
    }
});

var b = a.extend({
    constructor: function() {
        this.cookieType = 'chocolate chip';
    }
});

var aInst = new a();
console.log(aInst.makeCookie());

var bInst = new b();
console.log(bInst.makeCookie());

function SugarCookie() {
    this.cookieType = 'sugar';
}

SugarCookie.prototype.makeCookie = function () {
    console.log('makeCookie Overridden!');
    return this.base.call(this);
};

SugarCookie.prototype.beforeExtension = function () {
    console.log('before extension');
};

var c = b.extend(SugarCookie);

SugarCookie.prototype.afterExtension = function () {
    console.log('after extension');
};

var cInst = new c();
console.log(cInst.makeCookie());
cInst.beforeExtension();
cInst.afterExtension();

var d = c.extend({
    makeCookie: function(x) {
        return this.base.call(this, x) + ' with ' + x;
    }
});

var dInst = new d();
console.log(dInst.makeCookie('chocolate chips'));
dInst.beforeExtension();
dInst.afterExtension();