export class MarkerLine {
    private points: { x: number; y: number }[] = [];
    private thickness: number;
  
    constructor(startX: number, startY: number, thickness: number = 2) {
      this.points.push({ x: startX, y: startY });
      this.thickness = thickness;
    }
  
    drag(x: number, y: number) {
      this.points.push({ x, y });
    }
  
    display(ctx: CanvasRenderingContext2D) {
      if (!ctx || this.points.length < 2) return;
  
      ctx.lineWidth = this.thickness;
      ctx.strokeStyle = "black";
  
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
  
      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
  
      ctx.stroke();
    }
  }
  