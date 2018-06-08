/*2d variable, used to calculate and store 2d kinematic vector*/

"use strict";

let KinematicVariable2D = function(name){
  this.fullName = name;
  this.value = 0;
  this.angle = 0;
  this.altValue = 0;
  this.getVal = false;
  this.hasVal = false;
  this.hasAltVal = false;
  this.altAngle=0;
  this.x = 0;
  this.y = 0;
  this.altX=0;
  this.altY=0;
  
  this.getValue = function(){
    if(calcX)
      return this.x;
    else
      return this.y;
  };
  
  this.calculate = function(){
    this.value=Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
    this.angle=Math.atan2(this.y,this.x);
  };
  
  this.altCalculate = function(){
    this.altValue=Math.sqrt(Math.pow(this.altX,2)+Math.pow(this.altY,2));
    this.altAngle=Math.atan2(this.altY,this.altX);
  };
  
  this.calculateComponents = function(){
    this.x = this.value*Math.cos(this.angle);
    this.y = this.value*Math.sin(this.angle);
  };
};