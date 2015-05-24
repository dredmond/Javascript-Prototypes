import conn = require('./connection')
import Connection = conn.Connection;

class Battery {
    public positive: Connection;
    public negative: Connection;

    constructor(public voltage: number) {
        
    }
}