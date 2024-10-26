import "./style.css";

const APP_NAME = "Gooood Morning World";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

// Setting canvas dimensions
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;

// Append canvas element to document
app.appendChild(canvas);
const ctx = canvas.getContext("2d");

// Filling the rectangle to see it
if (ctx) {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 256, 256);
} else {
    console.error("failed to get context");
}
