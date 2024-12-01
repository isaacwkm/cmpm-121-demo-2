import "./style.css";

const APP_NAME = "Gooood Morning World";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;

// Game Title
const title = document.createElement("h1");
setTitle();
app.appendChild(title);

// Canvas Setup
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
app.append(canvas);
const ctx = canvas.getContext("2d");
clearCanvas();

// Data Structures
let strokes: { x: number; y: number }[][] = [];
let currentStroke: { x: number; y: number }[] = [];
let drawFlag = false;

// Observer Pattern
class Observable<T> {
  private listeners: Array<(data: T) => void> = [];
  
  subscribe(listener: (data: T) => void) {
    this.listeners.push(listener);
  }
  
  notify(data: T) {
    this.listeners.forEach((listener) => listener(data));
  }
}

const strokeObserver = new Observable<{ x: number; y: number }[]>();

// Canvas Event Listeners
canvas.addEventListener("mousedown", () => {
  drawFlag = true;
  currentStroke = []; // Start a new stroke
});

canvas.addEventListener("mouseup", () => {
  drawFlag = false;
  if (currentStroke.length > 0) {
    strokes.push(currentStroke); // Save completed stroke
    strokeObserver.notify(currentStroke); // Notify observers
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (drawFlag && ctx) {
    const bounds = canvas.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    drawPoint(x, y, "black");
    currentStroke.push({ x, y }); // Save point
  }
});

// Clear Button
const clearButton = document.createElement("button");
createClearButton();
clearButton.addEventListener("click", () => {
  clearCanvas();
  strokes = []; // Reset strokes
});

// Functions
function setTitle() {
  title.textContent = APP_NAME;
  title.style.textAlign = "center";
  title.style.marginTop = "10px";
}

function clearCanvas() {
  if (ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    console.error("Failed to get context");
  }
}

function drawPoint(x: number, y: number, color: string) {
  if (ctx) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createClearButton() {
  clearButton.id = "clearButton";
  clearButton.textContent = "Clear";
  clearButton.style.marginTop = "20px";
  clearButton.style.marginLeft = "40px";
  app.append(clearButton);
}
