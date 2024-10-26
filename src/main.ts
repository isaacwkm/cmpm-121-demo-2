import "./style.css";

const APP_NAME = "Gooood Morning World";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

const canvas = document.createElement("canvas");
canvas.width = 256; // width of the canvas
canvas.height = 256; // height of the canvas

app.appendChild(canvas);

const ctx = canvas.getContext("2d");

if (ctx) {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 256, 256);
} else {
    console.error("failed to get context");
}
