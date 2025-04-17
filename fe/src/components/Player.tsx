const Player = {
  draw(ctx: CanvasRenderingContext2D, player: any) {
    ctx.save();
    ctx.translate(player.x, player.y);

    // 머리 (원)
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = player.isSticking ? "green" : "black";
    ctx.fill();

    ctx.strokeStyle = player.isSticking ? "green" : "black";
    ctx.lineWidth = 2;

    // 몸통 (선)
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.lineTo(0, 20);
    ctx.stroke();

    // 팔 (왼쪽 팔)
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(-7, 15);
    ctx.stroke();

    // 팔 (오른쪽 팔)
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(7, 15);
    ctx.stroke();

    // 다리 (왼쪽 다리)
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(-5, 30);
    ctx.stroke();

    // 다리 (오른쪽 다리)
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(5, 30);
    ctx.stroke();

    ctx.restore();
  },

  checkCollision(player: any, stick: any) {
    return (
      player.x < stick.x + stick.width / 2 &&
      player.x > stick.x - stick.width / 2 &&
      player.y < stick.y + stick.height / 2 &&
      player.y > stick.y - stick.height / 2
    );
  }
};

export default Player;
