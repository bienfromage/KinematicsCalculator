/*1d Varible - purpose is to store value of kinematic variable*/

"use strict";

let KinematicVariable = function(name){
  this.fullName = name;
  this.value = 0;
  this.altValue = 0;
  this.getVal = false;
  this.hasVal = false;
  this.hasAltVal = false;
  
  this.getValue = function(){
    return this.value;
  };
};