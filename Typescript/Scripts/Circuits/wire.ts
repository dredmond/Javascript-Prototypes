import conn = require('./connection')
import Connection = conn.Connection;


class Wire {
    voltage: number;
    connections: Connection[];
    constructor(public x1: number, public y1: number, public x2: number, public y2: number) { }
}

var w = new Wire(0, 0, 1, 1);
console.log(w);