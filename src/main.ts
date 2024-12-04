import "./style.css";
import { MarkerLine } from "./MarkerLine.ts";
import { Sticker } from "./Sticker.ts";


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
let toolPreview: ToolPreview | null = null;
let selectedThickness = 2;

// Clear Button
const clearButton = document.createElement("button");
clearButton.id = "clearButton";
clearButton.textContent = "Clear";
clearButton.style.marginTop = "20px";
clearButton.style.marginLeft = "40px";
app.append(clearButton);

clearButton.addEventListener("click", () => {
  clearCanvas();
  strokes.length = 0;
  redoStack.length = 0;
});

// Undo Button
const undoButton = document.createElement("button");
undoButton.id = "undoButton";
undoButton.textContent = "Undo";
undoButton.style.marginTop = "20px";
undoButton.style.marginLeft = "10px";
app.append(undoButton);

undoButton.addEventListener("click", () => {
  if (strokes.length > 0) {
    redoStack.push(strokes.pop()!);
    redrawCanvas();
  }
});

// Redo Button
const redoButton = document.createElement("button");
redoButton.id = "redoButton";
redoButton.textContent = "Redo";
redoButton.style.marginTop = "20px";
redoButton.style.marginLeft = "10px";
app.append(redoButton);

redoButton.addEventListener("click", () => {
  if (redoStack.length > 0) {
    strokes.push(redoStack.pop()!);
    redrawCanvas();
  }
});

// Thickness Buttons
const thinButton = document.createElement("button");
thinButton.textContent = "Thin";
thinButton.style.marginTop = "20px";
thinButton.style.marginLeft = "10px";
thinButton.addEventListener("click", () => {
  selectedThickness = 2;
  updateSelectedTool(thinButton);
});
app.append(thinButton);

const thickButton = document.createElement("button");
thickButton.textContent = "Thick";
thickButton.style.marginTop = "20px";
thickButton.style.marginLeft = "10px";
thickButton.addEventListener("click", () => {
  selectedThickness = 8;
  updateSelectedTool(thickButton);
});
app.append(thickButton);

function updateSelectedTool(selectedButton: HTMLButtonElement) {
  const buttons = [thinButton, thickButton];
  buttons.forEach((button) => button.classList.remove("selectedTool"));
  selectedButton.classList.add("selectedTool");
}

// Mouse Events
canvas.addEventListener("mousedown", (event) => {
  drawFlag = true;

  const { x, y } = getMousePosition(event);
  currentLine = new MarkerLine(x, y, selectedThickness); // Create a new line
  redoStack.length = 0; // Clear redo stack when starting a new stroke
});

canvas.addEventListener("mousemove", (event) => {
  const { x, y } = getMousePosition(event);

  if (!drawFlag && ctx) {
    toolPreview = new ToolPreview(x, y, selectedThickness); // Update tool preview
    dispatchToolMovedEvent();
    redrawCanvas();
  }

  if (drawFlag && currentLine) {
    currentLine.drag(x, y); // Extend the current line
    redrawCanvas(); // Update the canvas
  }
});

canvas.addEventListener("mouseup", () => {
  if (!drawFlag || !currentLine) return;

  drawFlag = false;
  strokes.push(currentLine); // Save the current line
  currentLine = null;
  dispatchDrawingChangedEvent();
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

  // Draw the tool preview if it exists
  if (!drawFlag && toolPreview) {
    toolPreview.display(ctx);
  }
}

function dispatchDrawingChangedEvent() {
  const event = new Event("drawing-changed");
  canvas.dispatchEvent(event);
}

function dispatchToolMovedEvent() {
  const event = new Event("tool-moved");
  canvas.dispatchEvent(event);
}

function getMousePosition(event: MouseEvent) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };
}

// ToolPreview Class
class ToolPreview {
  private x: number;
  private y: number;
  private thickness: number;

  constructor(x: number, y: number, thickness: number) {
    this.x = x;
    this.y = y;
    this.thickness = thickness;
  }

  display(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.thickness / 2, 0, Math.PI * 2);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
