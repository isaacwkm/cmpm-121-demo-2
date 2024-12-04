export class Sticker {
    private emoji: string;
    private x: number = 0;
    private y: number = 0;
  
    constructor(emoji: string) {
      this.emoji = emoji;
    }
  
    // Move the sticker to a new position
    move(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  
    // Draw the sticker at its current position
    draw(ctx: CanvasRenderingContext2D) {
      ctx.font = "30px sans-serif";
      ctx.fillText(this.emoji, this.x, this.y);
    }
  
    // Get current position to be used for dragging or placing
    place() {
      return { x: this.x, y: this.y };
    }
  }
  