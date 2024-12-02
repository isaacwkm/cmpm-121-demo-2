import "./style.css";

const APP_NAME = "Gooood Morning World";
const app = document.querySelector<HTMLDivElement>("#app")!;

// Set the document title
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
if (!ctx) {
  throw new Error("Failed to get 2D context");
}
clearCanvas();

// Data Structures
let drawFlag = false;
let currentStroke: { x: number; y: number }[] = [];
let strokes: { x: number; y: number }[][] = [];

// Mouse Events
canvas.addEventListener("mousedown", () => {
  drawFlag = true;
  currentStroke = []; // Start a new stroke
});

canvas.addEventListener("mousemove", (event) => {
  if (!drawFlag) return;

  const { x, y } = getMousePosition(event);
  currentStroke.push({ x, y }); // Add point to the current stroke
  DrawingChanged(); // Dispatch the event after adding a point
});

// When mouse is released, save the completed stroke and dispatch the event
canvas.addEventListener("mouseup", () => {
  drawFlag = false; // Stop drawing
  if (currentStroke.length > 0) {
    strokes.push(currentStroke); // Save the completed stroke
    DrawingChanged(); // Dispatch event to trigger redrawing
    console.log("Stroke completed:", currentStroke);
  }
});

// Clear Button
const clearButton = document.createElement("button");
createClearButton();
clearButton.addEventListener("click", () => {
  clearCanvas();
  strokes = []; // Reset strokes
});

// Helper Functions
function setTitle() {
  title.textContent = APP_NAME;
  title.style.textAlign = "center";
  title.style.marginTop = "10px";
}

function clearCanvas() {
  if (!ctx) {
    console.error("Canvas context is not available.");
    return; // Exit if ctx is not available
  }
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPoint(x: number, y: number, color: string) {
  if (!ctx) {
    console.error("Canvas context is not available.");
    return; // Exit if ctx is not available
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
}

function createClearButton() {
  clearButton.id = "clearButton";
  clearButton.textContent = "Clear";
  clearButton.style.marginTop = "20px";
  clearButton.style.marginLeft = "40px";
  app.append(clearButton);
}

// Get mouse position relative to the canvas
function getMousePosition(event: MouseEvent) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };
}

// Dispatch the "drawing-changed" event
function DrawingChanged() {
  const event = new CustomEvent("drawing-changed", {
    detail: { strokes }, // Pass the strokes array with the event
  });
  canvas.dispatchEvent(event);
}

// Observer: Handle the "drawing-changed" event
canvas.addEventListener("drawing-changed", () => {
  clearCanvas(); // Clear the canvas
  redrawStrokes(); // Redraw all strokes
});

// Redraw all strokes
function redrawStrokes() {
  strokes.forEach((stroke) => {
    stroke.forEach(({ x, y }) => {
      drawPoint(x, y, "black"); // Draw each point in the stroke
    });
  });
}
