/* index.js
You know what this is. This is the main code for the website.
*/
import katex from "katex"
import VariableInputParent from "./variableInput";

// Set up global options for KaTeX
const katexRenderOptions = {
    output: "mathml",
    throwOnError: false
}

// Get elements on the page
const inputEquationPreview = document.getElementById("input-equation-preview")
const inputEquation = document.getElementById("input-equation")
const outputEquationPreview = document.getElementById("output-equation-preview")
const outputEquation = document.getElementById("output-equation")
const variablesWrapper = document.getElementById("variables")
const addExplanationButton = document.getElementById("add-explanation")
const optionAddSpace = document.getElementById("option-add-space")
const optionNoText = document.getElementById("option-no-text")
const optionCompact = document.getElementById("option-compact")

// Add event listeners for direct render of the input
const renderInputEquation = () => {
    katex.render(inputEquation.value, inputEquationPreview, katexRenderOptions)
}
inputEquation.addEventListener("input", renderInputEquation)
inputEquationPreview.addEventListener("load", renderInputEquation)

// Create a handler for handling the current variable explanations
// ... and a function for when a new variable was added
let lastEquation = "" // Saves the last rendered equation
const onEquationChange = () => {
    console.log("A variable or option was changed! Re-rendering equation...")
    // Generate the equation
    let fullEquation = inputEquation.value
    // Add base code for explanation
    let explanationText = optionAddSpace.checked ? "\\quad": ""
    // Render different start if using compact mode
    if (optionCompact.checked){
        explanationText = `\\bigl\\{`
    }
    else {
        explanationText += `\\left\\{\\begin{array}{l}`
    }
    // Iterate over all variables and add entries.
    for (const variable of variableHandler.variables) {
        const variableName = variable.data.variableName
        const variableExplanation = variable.data.variableExplanation
        const variableExplanationLatex = optionNoText.checked ? variableExplanation : `\\text{${variableExplanation}}`
        explanationText += `${variableName}: ${variableExplanationLatex}`
        if (!optionCompact.checked){
            explanationText += ` \\\\`
        }
        else {
            explanationText += ", "
        }
    }
    // Add closing code (compact mode doesn't need closing)
    if (!optionCompact.checked){
        explanationText += `\\end{array}\\right\.`
    }
    else if (variableHandler.variables.length > 0){
        explanationText = explanationText.substring(0, explanationText.length-2) // Trim comma and space at end if using compact mode
    }
    fullEquation += explanationText
    console.log(`Full equation: ${fullEquation}.`)
    // Set and render full equation
    outputEquation.innerHTML = fullEquation
    lastEquation = fullEquation
    katex.render(fullEquation, outputEquationPreview, katexRenderOptions)
}
// Create the handler for variabels
const variableHandler = new VariableInputParent(variablesWrapper, onEquationChange)
// Add the equation change to other relevant elements too
inputEquation.addEventListener("change", onEquationChange)
for (const checkboxElement of [optionAddSpace,  optionNoText, optionCompact]){
    checkboxElement.addEventListener("change", onEquationChange)
}
// Bind button to add new variables
addExplanationButton.addEventListener("click", ()=>{
    console.log("Button to add new variables was clicked.")
    variableHandler.newVariableInput()
})
// Bind code to copy to clipboard
outputEquation.addEventListener("click", ()=>{
    console.log("Adding output equation to clipboard...")
    navigator.clipboard.writeText(lastEquation).then(()=> {
        console.log("Copied!")
    }) // Copy to clipboard
})