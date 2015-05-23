declare class Test {
    private _testVal;
    constructor();
    public testVal : string;
}
declare class Animal {
    private name;
    constructor(theName: string);
}
declare class Rhino extends Animal {
    constructor();
}
declare class Employee {
    private name;
    constructor(theName: string);
}
declare var animal: Animal;
declare var rhino: Rhino;
declare var employee: Employee;
declare var blah: Test;
