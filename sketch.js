let capture;
let tracker;
let positions;
let eyebrowRaised = false;
let proceedToBlink;

let prevLeftEyePos = null;
let prevRightEyePos = null;
let leftEyeDelta;
let rightEyeDelta;
let blinkCount = 0;
let blinkThreshold = 2;

let mainText = "I design experiences and products that bridge the physical and digital through the use of alternative control";
let instructionText = "raise your eyebrows to proceed";
let alternativeText = "alternative control?";

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  document.body.style.cursor = "none";
  
  capture = createCapture(VIDEO);
  capture.elt.setAttribute("playsinline", ""); 
  capture.size(width, height);
  capture.hide();

  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);
}

function draw() {
  positions = tracker.getCurrentPosition();
  
  if (positions && positions[19] && positions[20] && positions[23] && positions[24]) {
    eyebrowRaised = detectEyebrowRaise(positions);
  }

  if (eyebrowRaised && !proceedToBlink) {
    background(0);
    fill(255);
    textSize(25);
    textAlign(CENTER, CENTER);
    textFont("Comfortaa");
    text(alternativeText, window.innerWidth / 2, window.innerHeight / 2);
    proceedToBlink = true;
  }
 
  else if(!proceedToBlink && !eyebrowRaised) {
    fill(0);
    textSize(25);
    textAlign(CENTER, CENTER);
    textFont("Comfortaa");
    text(mainText, window.innerWidth / 2, window.innerHeight / 2);
    textSize(12);
    text(instructionText, window.innerWidth / 2, window.innerHeight / 2 + window.innerHeight/20);
  }

  if(proceedToBlink){
    if (positions && positions[24] && positions[26] && positions[29] && positions[31]) {
      if (prevLeftEyePos && prevRightEyePos) {
        leftEyeDelta = Math.abs(positions[24][1] - prevLeftEyePos[1]);
        rightEyeDelta = Math.abs(positions[29][1] - prevRightEyePos[1]);

        if (leftEyeDelta > blinkThreshold || rightEyeDelta > blinkThreshold) {
            blinkCount++; 
            console.log("Blink detected! Count: " + blinkCount);
        }
      }

      if (blinkCount % 2 === 0) {
        fill(255);
      } else {
        fill(0);
      }
      textSize(25);
      textAlign(CENTER, CENTER);
      textFont("Comfortaa");
      text(alternativeText, window.innerWidth / 2, window.innerHeight / 2);
    }

    prevLeftEyePos = positions[24];
    prevRightEyePos = positions[29];
  }
}


function detectEyebrowRaise(positions) {
  const leftEyebrowY = positions[19][1];
  const leftEyeY = positions[24][1];    
  const rightEyebrowY = positions[20][1];
  const rightEyeY = positions[23][1];


  const leftDelta = leftEyebrowY - leftEyeY;
  const rightDelta = rightEyebrowY - rightEyeY;

  const threshold = 40;

  return leftDelta < -threshold && rightDelta < -threshold;
}
