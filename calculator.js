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
      updateUI();
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
    case 3://accept user input screen
      let nextId = findNextGetVal();
      if(nextId !== null){
        setInstructions("Input the value of "+kinematicVar[nextId].fullName+" "+nextId);
        setBody("<input type='Number' step='any' id='inputBox'><br><button class = 'button' onclick=\"saveUserInput('"+nextId+"')\">Submit</button>");
      }else{
        state++;
        updateUI();
      }
      break;
    case 4://determine which equation to use
      let equationId = chooseEquation();
      
      if(equationId === -1){
        state++;
      }else{
        solve(equationId);
      }
      updateUI();
      break;
    case 5:
      setInstructions("Calculated Values:");
      let total = "";
      for(let key in kinematicVar){
        total+=key+" ("+kinematicVar[key].fullName+"): "+Number(kinematicVar[key].value);
        if(kinematicVar[key].hasAltVal)
          total+=" or "+kinematicVar[key].altValue;
        total+="<br>";
      }
      state = 0;
      kinematicVar ={
        "v":new KinematicVariable("velocity"),
        "vo":new KinematicVariable("initial velocity"),
        "a":new KinematicVariable("acceleration"),
        "t":new KinematicVariable("time"),
        "x":new KinematicVariable("displacement")
      };
      
      setBody(total+"<br><button onclick='updateUI()' class='button'>Restart</button>");
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
  kinematicVar[id].value=Number(value);
  setHasVal(id,true);
}

function setAlt(id,value){
  kinematicVar[id].altValue = Number(value);
  kinematicVar[id].hasAltVal = true;
}

function findNextGetVal(){//see if user has any more variables to enter
  for(let key in kinematicVar){
    if(kinematicVar[key].getVal)
      return key;
  }
  return null;
}

function saveUserInput(id){
  setVal(id,document.getElementById('inputBox').value);
  setGetVal(id,false);
  setHasVal(id,true);
  document.getElementById('inputBox').value="";
  updateUI();
}

function chooseEquation(){
  let total = 0;
  let counter = [];
  for(let i = 0; i<4; i++)
    counter.push(0);
  
  for(let key in kinematicVar){
    if(kinematicVar[key].hasVal){
      switch(key){
        case "vo":
          total++;
          counter[0]++;
          counter[1]++;
          counter[2]++;
          counter[3]++;
          break;
        case "v":
          total++;
          counter[0]++;
          counter[2]++;
          counter[3]++;
          break;
        case "a":
          total++;
          counter[0]++;
          counter[1]++;
          counter[2]++;
          break;
        case "t":
          total++;
          counter[0]++;
          counter[1]++;
          counter[3]++;
          break;
        case "x":
          total++;
          counter[1]++;
          counter[2]++;
          counter[3]++;
          break;
      }
    }
  }
  
  if(total === 5)
    return -1;
  
  for(let i=0; i<counter.length;i++){
    if(counter[i]===3)
      return i;
  }
  
  return -2;
}

function solve(equationId){
  switch(equationId){
    case 0:
      if(!kinematicVar.vo.hasVal){
        setVal("vo",kinematicVar.v.value-kinematicVar.a.value*kinematicVar.t.value);
      }else if(!kinematicVar.v.hasVal){
        setVal("v",kinematicVar.vo.value+kinematicVar.a.value*kinematicVar.t.value);
      }else if(!kinematicVar.t.hasVal){
        setVal("t",(kinematicVar.v.value-kinematicVar.vo.value)/kinematicVar.a.value);
        if(kinematicVar.v.hasAltVal)
          setAlt("t",(kinematicVar.v.value-kinematicVar.vo.value)/kinematicVar.a.value);
      }else{
        setVal("a",(kinematicVar.v.value-kinematicVar.vo.value)/kinematicVar.t.value);
      }
      break;
    case 1:
      if(!kinematicVar.x.hasVal){
        setVal("x",kinematicVar.vo.value*kinematicVar.t.value+0.5*kinematicVar.a.value*Math.pow(kinematicVar.t.value,2));
      }else if(!kinematicVar.vo.hasVal){
        setVal("vo",(kinematicVar.x.value-0.5*kinematicVar.a.value*Math.pow(kinematicVar.t.value,2))/kinematicVar.t.value);
      }else if(!kinematicVar.t.value){//avoid need for quadratic equation by calculating v instead of t and then letting equation 0 above calcualte for t using vo, a and t
        setVal("v",Math.sqrt(Math.pow(kinematicVar.vo.value,2)+2*kinematicVar.a.value*kinematicVar.x.value));
        setAlt("v",-Math.sqrt(Math.pow(kinematicVar.vo.value,2)+2*kinematicVar.a.value*kinematicVar.x.value));
      }else{
        setVal("a",(kinematicVar.x.value-kinematicVar.t.value*kinematicVar.vo.value)/(0.5*Math.pow(kinematicVar.t.value,2)));
      }
      break;
    case 2:
      //case v is non-existant is covered by case 1 above.
      if(!kinematicVar.vo.hasVal){
        setVal("vo",Math.sqrt(Math.pow(kinematicVar.v.value,2)-2*kinematicVar.a.value*kinematicVar.x.value));
      }else if(!kinematicVar.a.hasVal){
        setVal("a",(Math.pow(kinematicVar.v.value,2)-Math.pow(kinematicVar.vo.value,2))/(2*kinematicVar.x.value));
      }
      //case x is non-existant is covered in cases 1 and 2
      break;
    case 3:
      //case x is non-existant is covered in cases 1 and 2
      //case v is non-existant is covered in cases 1 and 2
      if(!kinematicVar.vo.hasVal){
        setVal("vo",kinematicVar.x.value/kinematicVar.t.value*2-kinematicVar.v.value);
      }
      //case t is non-existant is covered in cases 1 and 3
      break;
    default:
      alert("Whoops! Looks like you did not enter at least three variables.");
      state=1;
      break;
  }
}