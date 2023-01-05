/* variableInput.js
On the page, there is an input section for adding variable explanations.
For each explanation, we need to store a letter/symbol and an explanation.
For example, to explain m in the formula F = m\cdot a:
The class tree will look as follows:
VariableInputParent
...VariableInput with data variableName: "m", variableExplanation: "mass"
.....InputElement for entering variableName
.....InputElement for entering variableExplanation*/

/**
 * Class for a single input field on the page.
 */
class InputElement {
    /**
     * Initializes an input element.
     * @param parentElement The parent element (capable of appendChild()) to append the input field to
     * @param title A title to add above the input field.
     * @param onInput A callback function to run on put.
     * @param placeholder Optional placeholder for the input element.
     */
    constructor(parentElement, title, onInput, placeholder=null) {
        // Create the input and the title
        this.input = document.createElement("input")
        this.input.className = "w-min rounded-lg border-gray-300 px-3 py-1"
        if (placeholder != null){
            this.input.placeholder = placeholder
        }
        this.input.addEventListener("input", onInput)
        this.title = document.createElement("h3")
        this.title.textContent = title
        this.title.className = "text-gray-700 font-bold text-lg"
        parentElement.appendChild(this.title)
        parentElement.appendChild(this.input)
        console.log(`Appended input with title ${title} to parent.`)
    }
}

/**
 * A VariableInput contains input for one explanation for the formula. It stores its symbol
 * as well as its explanation in two InputElements.
 */
class VariableInput {
    /**
     * Initiales a VariableInput
     * @param parent The parent VariableInputParent.
     * @param parentElement The parent div element or any other element (capable of appendChild)
     * where the inputs and titles will be added.
     * @param onChange Callback function to run when any input field is changed.
     */
    constructor(parent, parentElement, onChange) {
        this.parent = parent
        this.parentElement = parentElement
        this.onChange = onChange
        // Save values
        this.data = {
            variableName: "",
            variableExplanation: ""
        }
        const setOnChange = (variable, event) => {
            const newValue = event.target.value
            console.log(`Setting ${variable} to ${newValue}...`)
            this.data[variable] = newValue
            // Run onchange
            this.onChange()
        }
        // Create a parent for all inputs
        this.variableInputWrapper = document.createElement("div")
        this.variableExplainationInputWrapper = document.createElement("div")
        this.parentElement.appendChild(this.variableInputWrapper)
        this.parentElement.appendChild(this.variableExplainationInputWrapper)
        // Populate created parents with input fields
        this.variableInput = new InputElement(this.variableInputWrapper, "Variable letter/sign (LaTex)", (event)=>{
            setOnChange("variableName", event)
        }, "e.g. \\mu...")
        this.variableExplainationInput = new InputElement(this.variableExplainationInputWrapper, "Explanation (text)", (event)=>{
            setOnChange("variableExplanation", event)
        }, "e.g. Constant...")
        // Add a remove button
        this.removeButton = document.createElement("button")
        this.removeButton.className = "text-gray-600 text-sm underline font-bold"
        this.removeButton.textContent = "Remove"
        this.removeButton.addEventListener("click", ()=>{
            console.log("Removing input elements...")
            this.remove()
            this.onChange()
        })
        this.variableExplainationInputWrapper.appendChild(this.removeButton)
    }

    /**
     * Removes the variable inputs from the document and from the parent variable list.
     */
    remove(){
        this.parentElement.removeChild(this.variableInputWrapper)
        this.parentElement.removeChild(this.variableExplainationInputWrapper)
        this.parent.variables = this.parent.variables.filter(e => e !== this)
    }
}

/**
 * This is a handler that lives inside a div and handles multiple variable explanations (VariableInputs).
 * It also supports adding and removing them.
 */
export default class VariableInputParent {
    /**
     * Initializes a parent for VariableInputs.
     * @param parentElement The parent div or other element (capable of appendChild()) where all possibly created
     * variable entry elements will be added.
     * @param onChange A callback function to run on change.
     */
    constructor(parentElement, onChange) {
        this.parentElement = parentElement
        this.variables = []
        this.onChange = onChange
    }

    /**
     * Initializes a new empty variable input.
     */
    newVariableInput() {
        console.log("Creating new variable input...")
        const inputsWrapper = document.createElement("div")
        inputsWrapper.className = "flex flex-col md:flex-row gap-x-4"
        this.parentElement.appendChild(inputsWrapper)
        this.variables.push(new VariableInput(this, inputsWrapper, ()=>{
            console.log("Running onchange...")
            this.onChange()
        }))
        console.log("New variable input created.")
    }
}