class Person {
  constructor(id, sketch) {
    this.sketch = sketch
    this.id = id;
    this.isInfected = false;
    this.x = this.sketch.random(0, this.sketch.width);
    this.y = this.sketch.random(0, this.sketch.height);
    this.perlin_value = 0;
    this.xVel = this.sketch.noise(this.perlin_value, 0);
    this.yVel = this.sketch.noise(0, this.perlin_value);
    this.xMult = 1;  
    this.yMult = 1;
    this.perlin_step = 0.01;
    this.perlin_thing = this.sketch.random(0, 1000);
    // this.perlin_thing = 3.4;
    this.perlin_scale = 14;
    this.frames_until_healed = framesUntilHealed;
    this.frames_since_infection = 0;
    this.frames_since_healed = immuneFrames + 1;
    this.frames_until_death = framesUntilHealed === Number.POSITIVE_INFINITY ? 60 : this.sketch.random(framesUntilHealed);
    this.isHospitalized = false;
    this.receivingTreatment = false;
    this.willDieIfTreated = 0;
    this.willDieIfNotTreated = 0;
  }
  infect() {
    this.isInfected = true;
    this.frames_since_infection = 0;
    this.seriouslyIll = Math.random() < probOfSeriouslyIll;
    if (this.seriouslyIll) {
      this.willDieIfTreated = Math.random() < deathRateIfTreated;
      this.willDieIfNotTreated = Math.random() < deathRateIfNotTreated;
    }
  }
  update() {
      if (!paused) {
          if (this.isInfected) {
              this.frames_since_infection ++;
              if (this.frames_since_infection > this.frames_until_healed) {this.isInfected = false; this.frames_since_healed = 0;}
              if (this.will_die) {
                  this.frames_until_death --;
              }
          }
          else {
              this.frames_since_healed ++;
          }
          
          if (!this.isInfected || !freezeWhileInfected){
              this.perlin_value += this.perlin_step;
              this.xVel = (this.sketch.noise(this.perlin_value, this.perlin_thing) - 0.475) * this.perlin_scale * this.xMult;
              this.yVel = (this.sketch.noise(this.perlin_thing, this.perlin_value) - 0.475) * this.perlin_scale * this.yMult;
              this.x += this.xVel;
              this.y += this.yVel;
          }
      }
  }
  isDead() {
      return (this.frames_until_death <= 0);
  }
  isImmune() {
    return (this.frames_since_healed <= immuneFrames);
  }
  show(sketch) {
    sketch.ellipse(0, 0, 5, 5)
      if (this.isInfected) {
          sketch.fill(255, 0, 0, 100);
          sketch.ellipse(this.x, this.y, transmissionRange*2, transmissionRange*2)
      } 
      
      sketch.fill(healthyColor);
      if (this.frames_since_healed < immuneFrames) sketch.fill(immuneColor);
    if (this.isInfected) sketch.fill(infectedColor)
    else if (this.seriouslyIll) sketch.fill(seriouslyIllColor);
      sketch.ellipse(this.x, this.y, 5, 5);
  }
  wallCollision(sketch) {
    if (this.x - 2.5 < 0 || this.x + 2.5 > sketch.width) this.xMult *= -1;
    if (this.y - 2.5 < 0 || this.y + 2.5 > sketch.height) this.yMult *= -1;
      if (this.x - 2.5 < 0) this.x = 2.5
      if (this.x + 2.5 > sketch.width) this.x = sketch.width - 2.5
      if (this.y - 2.5 < 0) this.y = 2.5
      if (this.y + 2.5 > sketch.height) this.y = sketch.height - 2.5
  }
  isWithin(range, other) {
      if (Math.abs(this.x - other.x) > range || Math.abs(this.y - other.y) > range) return false
      return ((range * range) >= (((this.x - other.x) ** 2) + ((this.y - other.y) ** 2)));
  }
  data() {
    let data = {
      n: this.id
    }
    if (this.isInfected) data.i = 1;
    if (this.isImmune()) data.m = 1;
    return data;
  }
}