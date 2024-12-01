import "./style.css";

const APP_NAME = "Gooood Morning World";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;


// Creating Game title
const title = document.createElement("h1");
setTitle();


// Append title to the app container
app.appendChild(title);


// Setting canvas dimensions
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;


// Append canvas element to document
app.append(canvas);
const ctx = canvas.getContext("2d");

// Filling the rectangle with white
clearCanvas();


// Data Structures
let strokes: { x: number; y: number }[][] = []; // each stroke is an array of points until the user lets go of the mouse

let drawFlag: boolean = false;
canvas.addEventListener("mousedown", () => (drawFlag = true));
canvas.addEventListener("mouseup", () => (drawFlag = false));
canvas.addEventListener("mousemove", (event) => {
    if (drawFlag && ctx) {
        const bounds = canvas.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    }

});

// Make "clear" button
const clearButton = document.createElement("button");
createClearButton();

// Add an event listener for the click event
clearButton.addEventListener("click", function () {
    // Code to execute when button is clicked
    clearCanvas();
  });


function setTitle(){
    title.textContent = APP_NAME;
    title.style.textAlign = "center";
    title.style.marginTop = "10px";
}

function clearCanvas(){
    if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 256, 256);
    } else {
        console.error("failed to get context");
    }
}


function createClearButton() {

    // Declare new button
    clearButton.id = "myButton"; // Set an ID for the button
    clearButton.textContent = "clear";
  
    // Setting the location of the button
    setLocation();
  
    // Append the button to the body or another existing element
    app.append(clearButton);
  
    return;
  
    //// End of function
  
    function setLocation() {
        clearButton.style.marginTop = "20px";
        clearButton.style.marginLeft = "40px";
    }
  }