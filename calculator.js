"use strict";

let state = 0;
let type = 0;
let kinematicVar;
let calcX = true;

//set up dictionary of variables. KinematicVariable is defined in KinematicVariable.js
function initDictionary(type){
  if(type === 0){
    kinematicVar ={
      "v":new KinematicVariable("velocity"),
      "vo":new KinematicVariable("initial velocity"),
      "a":new KinematicVariable("acceleration"),
      "t":new KinematicVariable("time"),
      "x":new KinematicVariable("displacement")
    };
  }else{
    kinematicVar ={
      "v":new KinematicVariable2D("velocity"),
      "vo":new KinematicVariable2D("initial velocity"),
      "a":new KinematicVariable2D("acceleration"),
      "t":new KinematicVariable("time"),//time does not have a direction, it is always one dimensional
      "x":new KinematicVariable2D("displacement")
    };
  }
}

//control flow method, changes UI to accept new input and display final output
function updateUI(){
  switch(state){
    case -1://regenerate original HTML screen in the event that the user presses the restart button
      state++;
      setInstructions("Choose which type of calculation you would like to perform");
      setBody("<select id='select'><option value='0'>1D Kinematics</option><option value='1'>2D Kinematics</option></select><button class='button' onclick='updateUI()'>Start</button>");
      break;
    case 0://start button press - move on to next screen
      type = Number(document.getElementById("select").value);
      initDictionary(type);
      state++;
      updateUI();
      break;
    case 1://variable choice screen: user chooses which variables he already knows and then presses "Continue" button to move on to the next screen
      setInstructions("Choose which variables you already know");
      
      let checkboxString = "";
      
      for(let key in kinematicVar){
        checkboxString+="<h3>"+key+" ("+kinematicVar[key].fullName+")</h3><div class='checkbox'><input type='checkbox' id='"+key+"'/><label for='"+key+"'></label></div>";
      }
      
      checkboxString+="<button class='button' onclick='updateUI()'>Continue</button>";
      
      setBody(checkboxString);
      
      state++;
      break;
    case 2://Variable Storage: not an actual screen, for each loop iterates through dictionary and decides which variables it will need to ask the user for
      
      let total = 0;
      
      for(let key in kinematicVar){
        if(document.getElementById(key).checked){
          setGetVal(key,true);
          total++;
        }
      }
      if(total > 2){
        state++;
        updateUI();
        break;
      }else{
        alert("Whoops! Looks like you did not enter at least three variables.");
      }
    break;
    case 3://accept user input screen
      let nextId = findNextGetVal();
      if(nextId !== null){
        setInstructions("Input the value of "+kinematicVar[nextId].fullName+" "+nextId);
        if(type === 0 || nextId === "t"){//time is one d and therefore should only accept one variable
          setBody("<input type='Number' step='any' id='inputBox'/><br><button id='bt' class = 'button' onclick=\"saveUserInput('"+nextId+"')\">Submit</button>");
          const input = document.getElementById('inputBox');
          input.focus();
          input.addEventListener("keyup", (event)=>{
            event.preventDefault();
            if(event.keyCode === 13){
              document.getElementById('bt').click();
            }
          });
        }else{
          setBody("<label>magnitude:<input type='Number' step='any' id='inputBox'/></label><br><label>angle:<input type='Number' step='any' id='inputBoxAngle'/></label><br><button id='bt' class = 'button' onclick=\"saveUserInput('"+nextId+"')\">Submit</button>");
          const input = document.getElementById('inputBox');
          const angleInput = document.getElementById('inputBoxAngle');
          input.focus();
          input.addEventListener("keyup", (event)=>{
            event.preventDefault();
            if(event.keyCode === 13){
              angleInput.focus();
            }
          });
          angleInput.addEventListener("keyup",(event)=>{
            event.preventDefault();
            if(event.keyCode === 13){
              document.getElementById('bt').click();
            }
          });
        }
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
    case 5://display calculated values and offer restart option
      setInstructions("Calculated Values:");
      let final = "";
      
      for(let key in kinematicVar){
        if(type === 0 || key === "t"){
          final+=key+" ("+kinematicVar[key].fullName+"): "+Number(kinematicVar[key].value);
          if(kinematicVar[key].hasAltVal)
            final+=" or "+kinematicVar[key].altValue;
         final+="<br>";
        }else{
          final+=key+" ("+kinematicVar[key].fullName+"): "+Number(kinematicVar[key].value) +" at "+Number(kinematicVar[key].angle*180/Math.PI)+" degrees";
          if(kinematicVar[key].hasAltVal)
            final+=" or "+kinematicVar[key].altValue+" at "+Number(kinematicVar[key].altAngle*180/Math.PI)+" degrees";
         final+="<br>";
        }
      }
      
      state = -1;
      
      setBody(final+"<br><button onclick='updateUI()' class='button'>Restart</button>");
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

function setCalculatedVal(id, value){
  if(type === 0 || id === "t"){
    kinematicVar[id].value=Number(value);
    setHasVal(id,true);
  }else{
    if(calcX){
      kinematicVar[id].x=Number(value);
      calcX = false;
    }else{
      kinematicVar[id].y=Number(value);
      kinematicVar[id].calculate();
      calcX=true;
      setHasVal(id,true);
    }
  }
}

function setAngleVal(id,value){
  kinematicVar[id].angle=Number(value)*Math.PI/180;
}

function setAlt(id,value){
  if(type === 0 || id === "t"){
    kinematicVar[id].altValue=Number(value);
    kinematicVar[id].hasAltVal=true;
  }else{
    if(calcX){
      kinematicVar[id].altX=Number(value);
      kinematicVar[id].altCalculate();
      kinematicVar[id].hasAltVal=true;
    }else{
      kinematicVar[id].altY=Number(value);
    }
  }
}

function findNextGetVal(){//see if user has any more variables to enter
  for(let key in kinematicVar){
    if(kinematicVar[key].getVal)
      return key;
  }
  return null;
}

function saveUserInput(id){//save input from input screen into global variable for later calculations
  let input = document.getElementById('inputBox');
  let val = input.value;
  if(!val){
    alert("It seems you have not entered a value, please try again");
    return;
  }
  setVal(id,input.value);
  setGetVal(id,false);
  input.value="";
  
  if(type === 1 && id !== "t"){
    input = document.getElementById('inputBoxAngle');
    val = input.value;
    if(!val){
      setGetVal(id,true);
      setHasVal(id,false);
      alert("It seems you have not entered a value for the angle, please try again");
      return;
    }
    setAngleVal(id,input.value);
    
    kinematicVar[id].calculateComponents();//get x and y components of kinematic value already entered
    
    input.value="";
  }
  
  updateUI();
}

function chooseEquation(){//decide which equations I can use based on the given data
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

function solve(equationId){//solve for a variable using a given equation
  switch(equationId){
    case 0:
      if(!kinematicVar.vo.hasVal){
        setCalculatedVal("vo",kinematicVar.v.getValue()-kinematicVar.a.getValue()*kinematicVar.t.getValue());
      }else if(!kinematicVar.v.hasVal){
        setCalculatedVal("v",kinematicVar.vo.getValue()+kinematicVar.a.getValue()*kinematicVar.t.getValue());
      }else if(!kinematicVar.t.hasVal){
        if(type === 0)
          setCalculatedVal("t",(kinematicVar.v.getValue()-kinematicVar.vo.getValue())/kinematicVar.a.getValue());
        else
          setCalculatedVal("t",Math.sqrt(Math.pow((kinematicVar.v.x-kinematicVar.vo.x)/kinematicVar.a.x,2)+Math.pow((kinematicVar.v.y-kinematicVar.vo.y)/kinematicVar.a.y,2)));
          
        if(kinematicVar.v.hasAltVal){
          if(type === 0)
            setAlt("t",(kinematicVar.v.altValue-kinematicVar.vo.getValue())/kinematicVar.a.getValue());
          else
            setAlt("t",Math.sqrt(Math.pow((kinematicVar.v.altX-kinematicVar.vo.x)/kinematicVar.a.x,2)+Math.pow((kinematicVar.v.altY-kinematicVar.vo.y)/kinematicVar.a.y,2)));
        }else if(kinematicVar.vo.hasAltVal){
          if(type === 0)
            setAlt("t",(kinematicVar.v.getValue()-kinematicVar.vo.altValue)/kinematicVar.a.getValue());
          else
            setAlt("t",Math.sqrt(Math.pow((kinematicVar.v.x-kinematicVar.vo.altX)/kinematicVar.a.x,2)+Math.pow((kinematicVar.v.y-kinematicVar.vo.altY)/kinematicVar.a.y,2)));
        }
      }else{
        setCalculatedVal("a",(kinematicVar.v.getValue()-kinematicVar.vo.getValue())/kinematicVar.t.getValue());
      }
      break;
    case 1:
      if(!kinematicVar.x.hasVal){
        setCalculatedVal("x",kinematicVar.vo.getValue()*kinematicVar.t.getValue()+0.5*kinematicVar.a.getValue()*Math.pow(kinematicVar.t.getValue(),2));
      }else if(!kinematicVar.vo.hasVal){
        setCalculatedVal("vo",(kinematicVar.x.getValue()-0.5*kinematicVar.a.getValue()*Math.pow(kinematicVar.t.getValue(),2))/kinematicVar.t.getValue());
      }else if(!kinematicVar.t.getValue()){//avoid need for quadratic equation by calculating v instead of t and then letting equation 0 above calcualte for t using vo, a and t
        setCalculatedVal("v",Math.sqrt(Math.pow(kinematicVar.vo.getValue(),2)+2*kinematicVar.a.getValue()*kinematicVar.x.getValue()));
        setAlt("v",-Math.sqrt(Math.pow(kinematicVar.vo.getValue(),2)+2*kinematicVar.a.getValue()*kinematicVar.x.getValue()));
      }else{
        setCalculatedVal("a",(kinematicVar.x.getValue()-kinematicVar.t.getValue()*kinematicVar.vo.getValue())/(0.5*Math.pow(kinematicVar.t.getValue(),2)));
      }
      break;
    case 2:
      //case v is non-existant is covered by case 1 above.
      if(!kinematicVar.vo.hasVal){
        setCalculatedVal("vo",Math.sqrt(Math.pow(kinematicVar.v.getValue(),2)-2*kinematicVar.a.getValue()*kinematicVar.x.getValue()));
        setAlt("vo",-Math.sqrt(Math.pow(kinematicVar.v.getValue(),2)-2*kinematicVar.a.getValue()*kinematicVar.x.getValue()));
      }else if(!kinematicVar.a.hasVal){
        setCalculatedVal("a",(Math.pow(kinematicVar.v.getValue(),2)-Math.pow(kinematicVar.vo.getValue(),2))/(2*kinematicVar.x.getValue()));
      }
      //case x is non-existant is covered in cases 1 and 2
      break;
    case 3:
      //case x is non-existant is covered in cases 1 and 2
      //case v is non-existant is covered in cases 1 and 2
      if(!kinematicVar.vo.hasVal){
        setCalculatedVal("vo",kinematicVar.x.getValue()/kinematicVar.t.getValue()*2-kinematicVar.v.getValue());
      }
      //case t is non-existant is covered in cases 1 and 3
      break;
    default:
      alert("Whoops! Looks like you did not enter at least three variables.");
      state=1;
      break;
  }
}