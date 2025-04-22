// components/Robot.ts

const Robot = {
  draw(ctx: CanvasRenderingContext2D, robot: any) {
    ctx.save();
    ctx.translate(robot.x, robot.y);

    ctx.strokeStyle = "blue"; // 로봇은 파란색 느낌
    ctx.lineWidth = 2;

    // 머리
    ctx.beginPath();
    ctx.arc(0, -10, 6, 0, Math.PI * 2);
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

    ctx.restore();
  }
};

export default Robot;
