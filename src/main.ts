import "./style.css";

const APP_NAME = "Good Morning World";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;
