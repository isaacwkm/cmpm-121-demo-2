import "./style.css";
import { MarkerLine } from "./MarkerLine.ts";

const APP_NAME = "Gooood Morning World";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;

// Game Title
const title = document.createElement("h1");
title.textContent = APP_NAME;
title.style.textAlign = "center";
title.style.marginTop = "10px";
app.appendChild(title);

// Canvas Setup
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
app.append(canvas);
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Failed to get canvas context");
}

clearCanvas();

// Drawing Data
let drawFlag = false;
let currentLine: MarkerLine | null = null;
const strokes: MarkerLine[] = [];
const redoStack: MarkerLine[] = [];

// Drawing Changed Event Listener -- Observer Pattern implementation
canvas.addEventListener("drawing-changed", () => {
  redrawCanvas(); // Redraw canvas when drawing changes
});

// Clear Button
const clearButton = document.createElement("button");
clearButton.id = "clearButton";
clearButton.textContent = "Clear";
clearButton.style.marginTop = "20px";
clearButton.style.marginLeft = "40px";
app.append(clearButton);
// Clear Button Listener
clearButton.addEventListener("click", () => {
  clearCanvas();
  strokes.length = 0;
  redoStack.length = 0;
  dispatchDrawingChangedEvent(); // Notify that the drawing has changed
});

// Undo Button
const undoButton = document.createElement("button");
undoButton.id = "undoButton";
undoButton.textContent = "Undo";
undoButton.style.marginTop = "20px";
undoButton.style.marginLeft = "10px";
app.append(undoButton);
// Undo Button Listener
undoButton.addEventListener("click", () => {
  if (strokes.length > 0) {
    redoStack.push(strokes.pop()!); // Move the last stroke to the redo stack
    dispatchDrawingChangedEvent(); // Notify that the drawing has changed
  }
});

// Redo Button
const redoButton = document.createElement("button");
redoButton.id = "redoButton";
redoButton.textContent = "Redo";
redoButton.style.marginTop = "20px";
redoButton.style.marginLeft = "10px";
app.append(redoButton);
// Redo Button Listener
redoButton.addEventListener("click", () => {
  if (redoStack.length > 0) {
    strokes.push(redoStack.pop()!); // Move the last stroke back to the strokes list
    dispatchDrawingChangedEvent(); // Notify that the drawing has changed
  }
});

// Mouse Events
canvas.addEventListener("mousedown", (event) => {
  drawFlag = true;

  const { x, y } = getMousePosition(event);
  currentLine = new MarkerLine(x, y); // Create a new line
  redoStack.length = 0; // Clear redo stack when starting a new stroke
});

canvas.addEventListener("mousemove", (event) => {
  if (!drawFlag || !currentLine || !ctx) return;

  const { x, y } = getMousePosition(event);
  currentLine.drag(x, y); // Extend the current line
  dispatchDrawingChangedEvent(); // Notify that the drawing has changed
});

canvas.addEventListener("mouseup", () => {
  if (!drawFlag || !currentLine) return;

  drawFlag = false;
  strokes.push(currentLine); // Save the current line
  currentLine = null;
  dispatchDrawingChangedEvent(); // Notify that the drawing has changed
});

// Utility Functions
function clearCanvas() {
  if (!ctx) return;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function redrawCanvas() {
  clearCanvas();

  if (!ctx) return;

  // Redraw all strokes
  for (const stroke of strokes) {
    stroke.display(ctx);
  }

  // Draw the current line if it exists
  if (currentLine) {
    currentLine.display(ctx);
  }
}

function dispatchDrawingChangedEvent() {
  const event = new Event("drawing-changed");
  canvas.dispatchEvent(event);
}

function getMousePosition(event: MouseEvent) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };
}
