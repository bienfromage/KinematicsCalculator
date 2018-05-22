"use strict";

let state = 0;

//set up dictionary of variables. KinematicVariable is defined in KinematicVariable.js
let kinematicVar ={
  "v":new KinematicVariable("velocity"),
  "vo":new KinematicVariable("initial velocity"),
  "a":new KinematicVariable("acceleration"),
  "t":new KinematicVariable("time"),
  "x":new KinematicVariable("displacement")
};

//control flow method, changes UI to accept new input and display final output
function updateUI(){
  switch(state){
    case 0://start button press - move on to next screen
      state++;
      break;
    case 1://variable choice screen: user chooses which variables he already knows and then presses "Continue" button to move on to the next screen
      setInstructions("Choose which variables you already know");
      setBody("<label class='label'>vo (initial velocity)<input type='checkbox' id='vo'></label><label class='label'>v (final velocity)<input type='checkbox' id='v'></label><label class='label'>a (acceleration)<input type='checkbox' id='a'></label><label class='label'>t (time)<input type='checkbox' id='t'></label><label class='label'>x (displacement)<input type='checkbox' id='x'></label><button class='button' onclick='updateUI()'>Continue</button>");
      state++;
      break;
    case 2://Variable Storage: not an actual screen, for each loop iterates through dictionary and decides which variables it will need to ask the user for
      //TODO: determine if user actually has selected enough variables to continue
      for(let key in kinematicVar){
        if(document.getElementById(key).checked){
          setGetVal(key,true);
        }
      }
      state++;
      updateUI();
      break;
    case 3:
      let nextId = findNextGetVal();
      if(nextId !== null){
        setInstructions("Input the value of "+kinematicVar[nextId]+" "+nextId);
        setBody("<input type='Number' step='any' id='inputBox'><br><button onclick='saveUserInput("+nextId+")'>Submit</button>");
      }else{
        state++;
      }
      break;
  }
}

function setInstructions(newInstructions){
  document.getElementById("instructions").innerHTML=newInstructions;
}

function setBody(bodyHTML){
  document.getElementById("interactionBody").innerHTML=bodyHTML;
}

function setHasVal(id,value){
  kinematicVar[id].hasVal=value;
}

function setGetVal(id,value){
  kinematicVar[id].getVal=value;
}

function setVal(id, value){
  kinematicVar[id].value=value;
}

function findNextGetVal(){//see if user has any more variables to enter
  for(let key in kinematicVar){
    if(kinematicVar[key].getVal)
      return key;
  }
  return null;
}

function saveUserInput(id){
  setVal(id,document.getElementById('inputBox'));
}