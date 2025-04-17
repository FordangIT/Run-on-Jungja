const Stick = {
  draw(
    ctx: CanvasRenderingContext2D,
    stick: {
      x: number;
      y: number;
      angle: number;
      width: number;
      height: number;
    }
  ) {
    ctx.save(); // 현재 캔버스 상태 저장
    ctx.translate(stick.x, stick.y); // 중심 이동
    ctx.rotate(stick.angle); // 각도 회전

    ctx.fillStyle = "brown";
    ctx.fillRect(
      -stick.width / 2,
      -stick.height / 2,
      stick.width,
      stick.height
    );
    ctx.restore(); // 캔버스 상태 복원
  }
};

export default Stick;
