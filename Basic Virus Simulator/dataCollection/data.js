class Data {
  constructor() {
    this.frames = [];
    this.downloadBtn = document.getElementById("download");
  }

  addFrame(people) {
    let newFrame = [];
    for (let person of people) {
      newFrame.push(person.data())
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