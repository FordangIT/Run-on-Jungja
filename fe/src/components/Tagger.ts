// components/Tagger.ts
import { TaggerType } from "@/types/GameTypes";

const Tagger = {
  draw(ctx: CanvasRenderingContext2D, tagger: TaggerType) {
    ctx.save();
    ctx.translate(tagger.x, tagger.y);

    // 몸체 (몸통 + 다리 + 팔)
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    // 머리
    ctx.beginPath();
    ctx.arc(0, -10, 6, 0, Math.PI * 2); // 머리는 약간 위에
    ctx.stroke();

    // 몸통
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(0, 10);
    ctx.stroke();

    // 팔
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-7, 5);
    ctx.moveTo(0, 0);
    ctx.lineTo(7, 5);
    ctx.stroke();

    // 다리
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(-5, 18);
    ctx.moveTo(0, 10);
    ctx.lineTo(5, 18);
    ctx.stroke();

    // (선택) 악마 뿔
    ctx.beginPath();
    ctx.moveTo(-4, -14);
    ctx.lineTo(-2, -10);
    ctx.moveTo(4, -14);
    ctx.lineTo(2, -10);
    ctx.stroke();

    ctx.restore();
  }
};

export default Tagger;
