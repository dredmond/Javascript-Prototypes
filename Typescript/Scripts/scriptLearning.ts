﻿/// <reference path="test.ts"/>

class Animal {
     private name: string;
     constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
    constructor() { super("Rhino"); }
}

class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

var animal: Animal = new Animal("Goat");
var rhino = new Rhino();
var employee = new Employee("Bob");

console.log(animal);
console.log(rhino);
console.log(employee);

var blah = new Test();
blah.testVal = "test";
console.log(blah);
console.log(blah.testVal);