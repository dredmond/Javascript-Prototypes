export module Test {
    export class Test1 {
        private _testVal: string;

        constructor() {}

        get testVal(): string {
            return this._testVal;
        }

        set testVal(newVal: string) {
            this._testVal = newVal;
        }
    }

    export interface ISomething {
        blah: string;
    }
}
