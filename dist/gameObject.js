class GameObject {
    _x;
    _y;
    _w;
    _h;
    image;
    constructor(_x, _y, _w, _h, image) {
        this._x = _x;
        this._y = _y;
        this._w = _w;
        this._h = _h;
        this.image = image;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get w() {
        return this._w;
    }
    get h() {
        return this._h;
    }
}
export { GameObject };
//# sourceMappingURL=gameObject.js.map