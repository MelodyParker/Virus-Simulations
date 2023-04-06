class Data {
  constructor() {
    this.frames = [{numPeople: numPeople}];
    this.downloadBtn = document.getElementById("download");
  }

  addFrame(people) {
    let newFrame = [];
    for (let person of people) {
      let personData = person.data();
      if (personData) newFrame.push(personData)
    }
    this.frames.push(newFrame)
  }

  save() {
    let json = JSON.stringify(this.frames);
    let blob = new Blob([json], {type: "application/json"});
    let url  = URL.createObjectURL(blob);
    this.downloadBtn.download    = "frames.txt";
    this.downloadBtn.href        = url;
    this.downloadBtn.textContent = "Download frames.json";
  }
}