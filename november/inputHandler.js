class InputHandler {
  constructor(dims, offX=100, offY=100) {
    this.originY = dims.h - offX;
    if (dims.isTouchDevice == true) {
      this.originX = dims.w - offY;
    } else {
      this.originX = dims.cx;
    }
    this.x = 0;
    this.y  = 0;
    this.on = false;
    this.listenerTracker = false;
    this.listenerOn = false;
    this.cardinals = [radians(0), radians(90), radians(180), radians(270)];
    this.prevOn = false;
    this.prevA = 0;
  }
  facing(sprite){
    let a = this.angleTo(sprite);
    let dir = 'unk';
    if (a >= 0) {
      dir = 'up';
    } else {
      dir = 'down';
    }
    if (a > radians(-45) && a < radians(45)) {
      dir = 'left';
    } else if (a > radians(135) || a < radians(-135)) {
      dir = 'right';
    }
    return dir;
  }
  setChangeListener() {
    this.listenerOn = true;
    this.listenerTracker = this.on;
  }
  hasChanged() {
    let result = true;
    if (this.listenerOn == true) {
      if (this.listenerTracker == this.on) {
        result = false;
      } else {
        result = true;
        this.listenerOn = false;
      }
    } else {
      result = true;
    }
    return result;
  }
  checkToClose(sprite) {
    let flag = false;
    if ((abs(this.x - sprite.tx) <= 2) && (abs(this.y - sprite.ty) <= 2)) {
      flag = true;
    }
    return flag;
  }
  update() {
    this.x = mouseX;
    this.y = mouseY;
    this.on = mouseIsPressed;
    if (this.prevOn != this.on) {
      this.originX = this.x;
      this.originY = this.y;
    }
    this.prevOn = this.on;
  }

  angleToSprite(sprite){
    let dx = sprite.tx - this.x;
    let dy = sprite.ty - this.y;
    return atan2(dy, dx);
  }
  angleTo(sprite){
    if (this.checkToClose(sprite) == false) {
      if (G.dims.isTouchDevice == true) {
        this.prevA = this.angleToOrigin();
      } else {
        this.prevA = this.angleToSprite(sprite);
      }
    }
    return this.prevA;
  }
  angleToOrigin() {
    let dx = this.originX - this.x;
    let dy = this.originY - this.y;
    return atan2(dy, dx);
  }
  getUnitVector(sprite) {
    if (this.checkToClose(sprite) == false) {
      if (G.dims.isTouchDevice == true) {
        return this.getUnitVectorFromOrigin();
      } else {
        return this.getUnitVectorFromSprite(sprite);
      }
    } else {
      return ([0, 0]);
    }
  }
  getUnitVectorFromSprite(sprite) {
    let i = -1 * cos(this.angleToSprite(sprite));
    let j = -1 * sin(this.angleToSprite(sprite));
    return [i, j];
  }
  getUnitVectorFromOrigin() {
    let i = -1 * cos(this.angleTo(this.originX, this.originY));
    let j = -1 * sin(this.angleTo(this.originX, this.originY));
    return [i, j];
  }
};
