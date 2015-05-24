define(["require", "exports"], function(require, exports) {
    var Wire = (function () {
        function Wire(x1, y1, x2, y2) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        }
        return Wire;
    })();

    var w = new Wire(0, 0, 1, 1);
    console.log(w);
});
//# sourceMappingURL=wire.js.map
