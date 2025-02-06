
let soundMappings = {}
let textMappings = JSON.parse(localStorage.getItem("textMappings")) || {};


window.onload = function() {
  let savedMappings = localStorage.getItem("soundMappings");
  let savedTextMappings = localStorage.getItem("textMappings");
  if (savedMappings) {
    soundMappings = JSON.parse(savedMappings);
    updateDropdownsFromStorage();
  }
  if (savedTextMappings) {
    updateTextFromStorage();
  }
};


function HandleFileUpload(buttonNumber) {
  let fileInput = document.getElementById(`file${buttonNumber}`);

  if (fileInput.files.length > 0) {
    let file = fileInput.files[0];
    let reader = new FileReader(); // Create a temporary URL for the uploaded file
    reader.onload = function(event) {
      let base64String = event.target.result;
      soundMappings[buttonNumber] = base64String;
      localStorage.setItem("soundMappings", JSON.stringify(soundMappings));
      updateDropdownOptions(buttonNumber, base64String, file.name);
    };
    reader.readAsDataURL(file);

  }
}

function updateDropdownOptions(buttonNumber, soundURL, fileName) {
  let dropdown = document.getElementById(`dropdown${buttonNumber}`);

  dropdown.innerHTML = "";
  let newOption = document.createElement("option");
  newOption.value = soundURL;
  newOption.text = fileName;
  dropdown.appendChild(newOption);
}

function updateTextValues(buttonNumber, txtInput) {
  let Input = document.getElementById(`text${buttonNumber}`);
  let button = document.getElementById(`button${buttonNumber}`);

  if (button) {
    button.textContent = txtInput || `${buttonNumber}`;
  }

  if (Input) {
    Input.value = txtInput;
  }
  textMappings[buttonNumber] = txtInput;
  localStorage.setItem("textMappings", JSON.stringify(textMappings));
}

function updateDropdownsFromStorage() {
  console.log("Updating dropdowns from storage:", soundMappings);
  for (let buttonNumber in soundMappings) {
    let dropdown = document.getElementById(`dropdown${buttonNumber}`);
    if (dropdown) {
      updateDropdownOptions(buttonNumber, soundMappings[buttonNumber], `Custom Sound ${buttonNumber}`);
    }
  }
}

function updateTextFromStorage() {
  console.log("Updating text from storage:", textMappings);
  for (let buttonNumber in textMappings) {
    let textInput = document.getElementById(`text${buttonNumber}`);
    let button = document.getElementById(`button${buttonNumber}`);

    if (button) {
      button.textContent = textMappings[buttonNumber] || `${buttonNumber}`;
    }
    if (textInput) {
      textInput.value = textMappings[buttonNumber] || "";
    }
  }
}

let currentAudio = null;
function playSound(buttonNumber) {

  let time = new Date().getHours()
  if(time >= 22 || time < 6){
    if(buttonNumber == 9){
      alert("Nice try diddy, you're not allowed to play this sound at night!");
      return;
    }
  }

  let savedMappings = localStorage.getItem("soundMappings");
  if (!savedMappings) {
    console.error("No sounds found in localStorage.");
    return;
  }

  let soundMappings = JSON.parse(savedMappings);

  // Get sound for the button
  let selectedSound = soundMappings[buttonNumber];

  if (!selectedSound) {
    console.warn(`No sound assigned for button ${buttonNumber}.`);
    return;
  }

  if(currentAudio){
    currentAudio.pause();
    currentAudio.onended = null;
    currentAudio = null;
  }

  currentAudio = new Audio(selectedSound);
  currentAudio.loop = false;
  currentAudio.play();

  currentAudio.onended = () => {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  };
  // console.log(`Playing sound for button ${buttonNumber}`);
}

function UpdateText(buttonNumber) {
  let inputField = document.getElementById(`text${buttonNumber}`);
  if (inputField) {
    updateTextValues(buttonNumber, inputField.value);
  }
}

function saveSoundChoices() {
  alert("Sound choices updated!");
}
