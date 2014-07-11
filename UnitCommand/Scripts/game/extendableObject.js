﻿var extendableObject = extendableObject || (function() {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        getOwnPropertyNames = Object.prototype.getOwnPropertyNames,
        extendableInstance = new extendable();

    function extendable() { }

    extendable.prototype.hasOwnProperty = function(obj, propertyName) {
        return hasOwnProperty.call(obj, propertyName);
    }

    extendable.prototype.getOwnPropertyNames = function (obj, propertyName) {
        return getOwnPropertyNames.call(obj, propertyName);
    }

    function copyProperties(source, destination) {
        for (var p in source) {
            if (!extendableInstance.hasOwnProperty(source, p))
                continue;

            // Don't copy the parent constructor if the child already has a constructor.
            if (p === 'constructor' && extendableObject.hasOwnProperty(destination, p))
                continue;

            var destProperty = destination[p],
                sourceProperty = source[p];

            // Child has the same property so we need to make a copy of it.
            if (typeof (destProperty) === 'undefined' && destProperty == null) {
                destination[p] = sourceProperty;
                continue;
            }

            destination[p] = function() {
                destProperty(arguments);
                sourceProperty(arguments);
            };
        }
    }

    function createPrototype(source, destination) {
        function f() { }

        f.prototype = source;
        destination.prototype = new f();

        destination.prototype.constructor = destination;
    }

    function objToFunc(obj) {
        function f() { }
        f.prototype = obj;
        return f;
    }

    extendable.prototype.extend = function (source, destination) {
        if (typeof (source) === 'object') {
            source = objToFunc(source);
        }

        if (typeof (destination) === 'object') {
            destination = objToFunc(destination);
        }

        if (typeof (source) === 'undefined' || source == null ||
            typeof (source.prototype) === 'undefined' || source.prototype == null) {
            source = function () { };
        }
        var base = source.prototype;
        
        if (typeof (destination) === 'undefined' || destination == null) {
            if (typeof (base.constructor) === 'function') 
                destination = base.constructor;
        }

        if (typeof (destination) === 'undefined' || destination == null) {
            destination = function () { };
        }

        var originalDest = destination.prototype;

        destination = originalDest.constructor || base.constructor || function () { };

        createPrototype(base, destination);
        copyProperties(originalDest, destination.prototype);

        destination.prototype.parent = base;

        return destination;
    };

    return extendableInstance;
})();

/**************************
 *  Testing code below!   *
 **************************/

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

x1Extender = extendableObject.extend(x1, x1Extender);

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

x2Extender = extendableObject.extend(x1Extender, x2Extender);

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

console.log('jSON Extension');
function testJsonExtend(data) {
    this.data = data;
}

var jsonObj = {
    testFunc: function() {
        console.log('Testing testFunc in jsonObj.');
    },
    constructor: function(a, b) {
        this.a = a;
        this.b = b;
    }
};

testJsonExtend = extendableObject.extend(jsonObj, testJsonExtend);

var x4 = new testJsonExtend({ something: 1 });
x4.testFunc();

for (var p in x4) {
    //if (!extendableObject.hasOwnProperty(x2Extender, p))
    //    continue;

    console.log('Property: ' + p);
}

console.log('jSON Extension #2');
var jsonObj = {
    testFunc: function () {
        console.log('Testing testFunc in jsonObj. [a: ' + this.a + ' b: ' + this.b + ']');
    },
    constructor: function (a, b) {
        console.log('Calling constructor in jsonObj.');
        this.a = a;
        this.b = b;
    }
};

var testJsonExtend2 = extendableObject.extend(jsonObj);

var x5 = new testJsonExtend2(1, 2);
x5.testFunc();

for (var p in x5) {
    //if (!extendableObject.hasOwnProperty(x2Extender, p))
    //    continue;

    console.log('Property: ' + p);
}

console.log('jSON Extension #3');
var jsonObj2 = {
    testFunc2: function() {
        console.log('Testing testFunc in jsonObj2.');
    },
    constructor: function (a, b, c) {
        console.log('Calling constructor in jsonObj2.');
        this.parent.constructor(a, b);
        this.c = c;
    }
};

var testJsonExtend3 = extendableObject.extend(jsonObj, jsonObj2);

var x6 = new testJsonExtend3(1, 2, 3);
x6.testFunc();
x6.testFunc2();

for (var p in x6) {
    //if (!extendableObject.hasOwnProperty(x2Extender, p))
    //    continue;

    console.log('Property: ' + p);
}

/* Outputs:

x1 extendableObject.js:95
test called in x1. extendableObject.js:98
testing extendableObject.js:99


x1Extender inherits x1 extendableObject.js:105
test called in x1Extender. extendableObject.js:114
donny 8/22/1984 extendableObject.js:115
test called in x1. extendableObject.js:98
testing extendableObject.js:99


x2Extender inherits x1Extender extendableObject.js:123
test called in x2Extender. extendableObject.js:132
29 extendableObject.js:133
test called in x1Extender. extendableObject.js:114
donny 8/22/1984 extendableObject.js:115
test called in x1. extendableObject.js:98
testing extendableObject.js:99
Property: age extendableObject.js:144
Property: constructor extendableObject.js:144
Property: parent extendableObject.js:144
Property: test extendableObject.js:144
Property: name extendableObject.js:144
Property: birthday extendableObject.js:144


jSON Extension extendableObject.js:147
Testing testFunc in jsonObj. extendableObject.js:154
Property: data extendableObject.js:171
Property: constructor extendableObject.js:171
Property: parent extendableObject.js:171
Property: testFunc extendableObject.js:171


jSON Extension #2 extendableObject.js:174
Calling constructor in jsonObj. extendableObject.js:180
Testing testFunc in jsonObj. [a: 1 b: 2] extendableObject.js:177
Property: a extendableObject.js:195
Property: b extendableObject.js:195
Property: constructor extendableObject.js:195
Property: parent extendableObject.js:195
Property: testFunc extendableObject.js:195


jSON Extension #3 extendableObject.js:198
Calling constructor in jsonObj2. extendableObject.js:204
Calling constructor in jsonObj. extendableObject.js:180
Testing testFunc in jsonObj. [a: 1 b: 2] extendableObject.js:177
Testing testFunc in jsonObj2. extendableObject.js:201
Property: c extendableObject.js:220
Property: constructor extendableObject.js:220
Property: testFunc2 extendableObject.js:220
Property: parent extendableObject.js:220
Property: testFunc extendableObject.js:220
Property: a extendableObject.js:220
Property: b extendableObject.js:220
*/