export class MarkerLine {
    private points: { x: number; y: number }[] = [];
  
    constructor(initialX: number, initialY: number) {
      this.points.push({ x: initialX, y: initialY });
    }
  
    // Method to add a new point to the line
    drag(x: number, y: number) {
      this.points.push({ x, y });
    }
  
    // Method to display the line on the canvas
    display(ctx: CanvasRenderingContext2D) {
      if (this.points.length < 2) return;
  
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
  
      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
  
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  