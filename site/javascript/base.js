
// Color palette
var __color_background 		= "rgb(44,54,64)";
var __color_foreground 		= "rgb(234,236,238)";
var __color_text          = "rgb(234,236,238)";
var __color_tonic 				= "rgb(0,102,153)";
var __color_mediant				= "rgb(0,119,180)";
var __color_dominant			= "rgb(51,153,204)";
var __color_accent				= "rgb(255,204,51)";
var __color_accent_backup	= "rgb(72,88,104)";

// ==================================================================================== Setup settings

let settingsListResolution = document.getElementById('settings-list-resolution')
let resolutionControlsLocked = false

for (let i = 0; i < settingsListResolution.children.length; i++) {
  let child = settingsListResolution.children[i]
  child.onclick = () => {
    if (!resolutionControlsLocked) {
      generateElevationAtResolution(child.innerHTML)
      resolutionControlsLocked = true
      settingsListResolution.style.opacity = "0.5"
    }
  }
}

function unlockResolutionControls(response) {
  for (let i = 0; i < settingsListResolution.children.length; i++) {
    let child = settingsListResolution.children[i]
    if (response == "error") {
      child.style.backgroundColor = "gray"
    } else {
      child.style.backgroundColor = "transparent"
      child.style.color = "black"
    }
    if (child.innerHTML == response) {
      settingsListResolution.style.opacity = "1"
      resolutionControlsLocked = false
      child.style.backgroundColor = "black"
      child.style.color = "white"
    }
  }
}