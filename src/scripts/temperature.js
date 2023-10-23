"use strict";
/**
 * Converts Celsius to Fahrenheit
 * @param {number} c amount of degrees in Celsius
 * @returns {number} amount of degrees in Fahrenheit
 */
function celsiusToFahrenheit(c) {
  return Number(c) * 9 / 5 + 32;
}
/**
 * Converts Fahrenheit to Celsius
 * @param {number} f amount of degrees in Fahrenheit
 * @returns {number} amount of degrees in Celsius
 */
function fahrenheitToCelsius(f) {
  return (Number(f) - 32) * 5 / 9;
}
/**
 * Converts Celsius to Kelvin
 * @param {number} c amount of degrees in Celsius
 * @returns {number} equivalent amount of Kelvin
 */
function celsiusToKelvin(c) {
  return Number(c) + 273.15; //we need to avoid string addition here.
}
/**
 * Converts Kelvin to Celsius
 * @param {number} k amount of Kelvin
 * @returns {number} amount of degrees in Celsius
 */
function kelvinToCelsius(k) {
  return Number(k) - 273.15;
}

//I don't want to bother adding more descriptions, these 2 function should explain themselves
function fahrenheitToKelvin(f) {
  return celsiusToKelvin(fahrenheitToCelsius(f));
}
function kelvinToFahrenheit(k) {
  return celsiusToFahrenheit(kelvinToCelsius(k));
}

/*
  Constant object with constant values.
  I like doing this since it helps make constants more meaningful.
*/
let UNITS = Object.freeze({
  FAHRENHEIT: 0,
  CELSIUS: 1,
  KELVIN: 2,

  NAMES: ["Fahrenheit", "Celsius", "Kelvin"],
  /* Kelvin doesn't have degrees so we need to exclude degrees for it. */
  NAMES2: ["degrees Fahrenheit", "degrees Celsius", "Kelvin"],
  COLOURS: ["#D00000","#00C000","#00C0C0"]
});


//Object based approach that allows for multiple individual forms.
//This could probably also be done without objects...

/*In the future, I should make the javascript generate the form itself
 instead of relying on specific html elements already existing. */
function Converter(form) {
  /**@type {HTMLFormElement} */
  this.form = form;

  /** @type {HTMLInputElement[][]} The radio buttons attached to this form*/
  this.radioButtons = [[], []];

  /**@type {number[]} The values for each set of radio buttons */
  this.selectedModes = [-1,-1];

  /**@type {HTMLInputElement} */
  this.input = this.form.querySelector('input[type="text"]');

  /**@type {HTMLButtonElement} */
  this.button = this.form.querySelector('button[type="button"]');

  /**@type {HTMLElement} */
  this.output = this.form.querySelector('.output');


  try {
    this.input.value = "";
    //Set the radio buttons
    let radioDivs = [...this.form.getElementsByClassName("radio")];
    for (let i=0;i<radioDivs.length;++i) {
      [...radioDivs[i].getElementsByTagName("input")].forEach((e,j)=>{
        this.radioButtons[i].push(e);
        e.checked = false;
        //took me a while to find out the onChange event existed.
        e.addEventListener("change", e=>this.radioClicked(e,i,j));
      });
    }

    this.button.addEventListener("click", e=>{this.submit(e)});
    
  } catch {
    console.error("Invalid html page error."); //Some of the html elements didn't exist and it caused an error
  }
}

/**
 * Updates this objects values when one of the radio buttons are click.
 * @param {Event} e 
 * @param {number} fromTo whether the radio button click was for converting from or converting to
 * @param {number} id id of the radio button clicked
 * @returns 
 */
Converter.prototype.radioClicked = function(e, fromTo, id) {
  //This ugly but compact block of code prevents you from converting a unit to itself.
  //Then I realized that it isn't a big deal if the user does that.

//  let other = (fromTo+1)&1;
//   if (this.radioButtons[other][id].checked) {
//     if (this.selectedModes[fromTo]>=0) {
//       //check the other radio button to what this radio button is set to
//       this.radioButtons[other][this.selectedModes[fromTo]].checked = true;
//       //change this object to reflect that
//       this.selectedModes[other] = this.selectedModes[fromTo];
//     } else {
//       //invalid selection and we can't correct it. Uncheck the radio button and return
//       this.radioButtons[fromTo][id].checked = false;
//       alert(`Cannot convert from ${UNIT.NAMES[id]} to ${UNIT.NAMES[id]}.`);
//       return; 
//     }
//   }
  this.selectedModes[fromTo] = id;
  if (fromTo===0) {
    this.button.style.backgroundColor = UNITS.COLOURS[id];
  }
};
/**
 * 
 * @param {Event} e 
 */
Converter.prototype.submit = function(e) {
  let input;
  let output;
  //reset the output
  this.output.classList.remove("placeholder");
  this.output.classList.remove("invalid");
  this.output.innerHTML = "";

  //first we will parse the int and put it into input
  this.input.value = input = parseFloat(this.input.value);
  //This.input.value is now a string and will be "NaN" string if the number is invalid
  if (this.input.value==="NaN") {
    this.output.classList.add("invalid");
    this.output.innerHTML = "Please input a valid number.";
    this.input.value = "";
    return;
  }
  //Now check if the radio buttons have selections
  if (this.selectedModes[0]<0) {
    this.output.classList.add("invalid");
    this.output.innerHTML = "Please select which temperature you will be converting from.";
    return;
  }
  if (this.selectedModes[1]<0) {
    this.output.classList.add("invalid");
    this.output.innerHTML = "Please select which temperature you will be converting to.";
    return;
  }


  //Since there are 9 possible selections, I will use a switch case to handle them
  switch (this.selectedModes[0]*3+this.selectedModes[1]) {
    case 0: case 4: case 8:
      //converting to itself. Just let the user do what they want I don't care.
      output = input;
      break;
    case 1: //Fahrenheit to Celsius
      output = fahrenheitToCelsius(input);
      break;
    case 2: //Fahrenheit to Kelvin
      output = fahrenheitToKelvin(input);
      break;
    case 3: //Celsius to Fahrenheit
      output = celsiusToFahrenheit(input);
      break;
    case 5: //Celsius to Kelvin
      output = celsiusToKelvin(input);
      break;
    case 6: //Kelvin to Fahrenheit
      output = kelvinToFahrenheit(input);
      break;
    case 7: //Kelvin to Celsius
      output = kelvinToCelsius(input);
      break;
    }
  //The more decimals in the input string, the decimals we'll put in our answer.
  let index = input.toString().indexOf('.');
  if (index>-1) {
    output = Number(output.toFixed(Math.max(2,input.toString().length-index-1)));
  } else {
    output = Number(output.toFixed(2));
  }

  //I don't think I can split this to multiple lines sadly
  this.output.innerHTML = `${input} ${UNITS.NAMES2[this.selectedModes[0]]} is equal to ${output} ${UNITS.NAMES2[this.selectedModes[1]]}.`;
}; //semi colon is actually needed here or else the browser reads it wrong.


//create a converter class for every form
[...document.getElementsByClassName("converter")].forEach((form)=>{new Converter(form)});


//This line below doesn't work in strict mode and I'm not entirely sure why that has to be.
//[...document.getElementsByClassName("converter")].forEach(Converter);