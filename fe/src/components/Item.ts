// components/Item.ts
import { ItemType } from "@/types/GameTypes";

const Item = {
  draw(ctx: CanvasRenderingContext2D, item: ItemType) {
    ctx.save();
    ctx.translate(item.x, item.y);

    ctx.fillStyle = "orange"; // 신발 색

    // 신발 기본 틀 (발바닥)
    ctx.beginPath();
    ctx.moveTo(-5, 5);
    ctx.lineTo(5, 5);
    ctx.lineTo(7, 0);
    ctx.lineTo(5, -5);
    ctx.lineTo(-5, -5);
    ctx.lineTo(-7, 0);
    ctx.closePath();
    ctx.fill();

    // 신발 끈 부분
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-4, -2);
    ctx.lineTo(4, -2);
    ctx.moveTo(-4, 0);
    ctx.lineTo(4, 0);
    ctx.moveTo(-4, 2);
    ctx.lineTo(4, 2);
    ctx.stroke();

    ctx.restore();
  }
};

export default Item;
