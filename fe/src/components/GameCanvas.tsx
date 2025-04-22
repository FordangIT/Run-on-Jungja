import { useEffect, useRef } from "react";
import Player from "./Player";
import Stick from "./Stick";

interface GameCanvasProps {
  stickList: { id: number; x: number; y: number; angle: number }[];
  onScore: (score: number) => void;
}

export default function GameCanvas({ stickList, onScore }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef({
    x: 50,
    y: 50,
    speed: 2,
    isSticking: false,
    stickId: null as number | null
  });

  const stickTimers = useRef<
    Record<number, { start: number; duration: number }>
  >({});
  const prevStickIdRef = useRef<number | null>(null);
  const wasDetached = useRef(false); // ✅ 떨어진 적 있는지 추적

  const centerX = 150;
  const centerY = 150;
  const stickWidth = 20;
  const stickHeight = 40;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let animationFrameId: number;

    const draw = (timestamp: number) => {
      const player = playerRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let touchedStickId: number | null = null;

      for (const stick of stickList) {
        const screenX = centerX + stick.x;
        const screenY = centerY + stick.y;

        Stick.draw(ctx, {
          ...stick,
          x: screenX,
          y: screenY,
          width: stickWidth,
          height: stickHeight,
          angle: stick.angle
        });

        // 충돌 체크
        if (
          Player.checkCollision(player, {
            x: screenX,
            y: screenY,
            width: stickWidth,
            height: stickHeight
          })
        ) {
          touchedStickId = stick.id;
        }
      }

      if (touchedStickId !== null) {
        if (player.stickId === touchedStickId && !wasDetached.current) {
          // ✅ 같은 stick 안에서 계속 머무르는 중
          player.isSticking = true;
        } else {
          if (wasDetached.current) {
            // ✅ 떨어졌다가 다시 붙은 경우
            if (touchedStickId !== prevStickIdRef.current) {
              // 다른 stick에 붙음 (초록색, 타이머 새로 시작)
              player.isSticking = true;
              player.stickId = touchedStickId;
              stickTimers.current[touchedStickId] = {
                start: timestamp,
                duration: 5000
              };
              onScore(10);
              prevStickIdRef.current = touchedStickId;
              wasDetached.current = false;
            } else {
              // 같은 stick에 다시 붙음 (초록색❌ 타이머❌)
              player.isSticking = false;
              player.stickId = null;
            }
          } else {
            // 처음부터 새로운 stick에 붙는 경우
            player.isSticking = true;
            player.stickId = touchedStickId;
            stickTimers.current[touchedStickId] = {
              start: timestamp,
              duration: 5000
            };
            onScore(10);
            prevStickIdRef.current = touchedStickId;
          }
        }
      } else {
        // ❗ 충돌한 stick 없음 (떨어짐)
        player.isSticking = false;
        player.stickId = null;
        wasDetached.current = true;
      }

      // Player 그리기
      Player.draw(ctx, player);

      // 플레이어 머리 위에 타이머 그리기
      if (player.isSticking && player.stickId !== null) {
        const timer = stickTimers.current[player.stickId];
        if (timer) {
          const elapsed = timestamp - timer.start;
          const progress = Math.min(elapsed / timer.duration, 1);

          ctx.save();
          ctx.translate(player.x, player.y);
          ctx.fillStyle = "blue";
          ctx.fillRect(-20, -30, 40 * (1 - progress), 6);
          ctx.restore();

          if (progress >= 1) {
            // 타이머 끝났으면 강제 떨어뜨림
            player.isSticking = false;
            player.stickId = null;
            wasDetached.current = true;
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [stickList, onScore]);

  // 키보드 이동
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const player = playerRef.current;

      if (e.key === "ArrowUp") player.y -= player.speed;
      if (e.key === "ArrowDown") player.y += player.speed;
      if (e.key === "ArrowLeft") player.x -= player.speed;
      if (e.key === "ArrowRight") player.x += player.speed;

      if (e.key === " ") {
        player.isSticking = false;
        player.stickId = null;
        wasDetached.current = true;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      className="rounded-full border-[6px] border-amber-700 shadow-lg w-[300px] h-[300px] mx-auto"
    />
  );
}
