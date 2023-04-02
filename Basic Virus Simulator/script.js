let infectedColor, seriouslyIllColor, healthyColor, immuneColor;
let people = [];
let freezeWhileInfected = false;
let mouseActive = false;
let paused = false;
let gridHeight, gridWidth;
let data;
const numInput = document.querySelector("#num-input");
const mainSketch = (sketch) => {
  sketch.setup = () => {
    data = new Data();
    sketchInstance = sketch.createCanvas(400, 400);
    sketchInstance.parent("canvas-holder")
    gridHeight = Math.floor()
    infectedColor = sketch.color(255, 0, 0);
    seriouslyIllColor = sketch.color(220, 108, 39);
    healthyColor = sketch.color(0, 255, 0);
    immuneColor = sketch.color(150, 150, 150);
    for (let i=0; i<numPeople; i++) {
      people[i] = new Person(i, sketch);
      if (i<numPeopleStartingImmune) people[i].frames_since_healed = 0;
      // else if (i == numPeopleStartingImmune) people[i].infect()
    }
    sketch.noStroke()
  }
  sketch.draw = () => {
    sketch.background(0);
    people.forEach(person => {
        person.show(sketch);
        person.update();
        person.wallCollision(sketch);
        if (mouseActive && person.isWithin(mouseTransmissionRange, sketch.createVector(sketch.mouseX, sketch.mouseY)) && !person.isImmune()){ person.infect()}
    })
    sketch.fill(140)
    if (mouseActive) {sketch.ellipse(sketch.mouseX, sketch.mouseY, 2*mouseTransmissionRange, 2*mouseTransmissionRange)}
    people = people.filter(person => {return !person.isDead()})
    if (!paused) {
      data.addFrame(people);
      let infectedPeople = people.filter(person => person.isInfected)
      let healthyPeople = people.filter(person => !person.isInfected)
      infectedPeople.forEach(infectedPerson => {
        healthyPeople.forEach(person => {
          if ((infectedPerson.isWithin(transmissionRange, person) && sketch.random(1) <= transmissionRate && !person.isInfected && !person.isImmune())) 
            person.infect()
          
       })
      
      })
      
    }
  }
  sketch.mouseClicked = () => {
    mouseActive = !mouseActive
  }

  sketch.keyPressed = () => {
    if (sketch.key === " ")
      paused = !paused
    else if (sketch.key === "n") {
      people.push(new Person(people.length, sketch))
      people[people.length - 1].x = mouseX;
      people[people.length - 1].y = mouseY;
      
    } else if (sketch.key === "c") {
      noCursor();
    } else if (sketch.key === "s") {
      data.save();
    } else if (sketch.key === "h") {
      for (let i=0; i<numInput.value; i++) {
        people.push(new Person(people.length, sketch))
      }
    } else if (sketch.key === "r") {
      people = [];
      data = new Data();
      for (let i=0; i<numPeople; i++) {
      
        people[i] = new Person(i, sketch);
        if (i<numPeopleStartingImmune) people[i].frames_since_healed = 0;
        else if (i == numPeopleStartingImmune) people[i].infect()
      } 
    } else if (sketch.key === "z") {
      people = [];
      data = new Data()
    } else if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(sketch.key)) {
      for (let i=0; i<(((sketch.key === "0") ? 10 : sketch.key) * 10); i++) {
        people.push(new Person(people.length, sketch));
      }
    } else if (sketch.key === "i") {
      let hasInfected = false;
      while (!hasInfected) {
        let random_num = Math.floor(Math.random() * people.length);
        if (!people[random_num].isInfected) {
          people[Math.floor(Math.random() * people.length)].infect();
          hasInfected = true;
        }
      }
      
    }
      
  }
}

new p5(mainSketch);

function hospitalSketch(sketch) {
  sketch.setup = () => {
    let hospital = sketch.createCanvas(100, 100);
    hospital.parent("hospital-holder")
    sketch.background(0)    
  }
  sketch.draw = () => {
    sketch.background(0)
  }
}
new p5(hospitalSketch);

