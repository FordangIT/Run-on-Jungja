// Stick.ts (그대로)

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

      let isTouching = false;
      let currentStickId: number | null = null;

      if (!player.isSticking) {
        // ❗ 안 붙어있을 때만 충돌 체크
        for (const stick of stickList) {
          const screenX = centerX + stick.x;
          const screenY = centerY + stick.y;

          // Stick 그리기
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
            isTouching = true;
            currentStickId = stick.id;
          }
        }
      }

      if (isTouching && currentStickId !== null) {
        if (currentStickId !== prevStickIdRef.current) {
          // 새로운 막대에 붙음
          player.isSticking = true;
          player.stickId = currentStickId;
          stickTimers.current[currentStickId] = {
            start: timestamp,
            duration: 5000
          };
          onScore(10);
          prevStickIdRef.current = currentStickId;
        } else {
          // 직전 막대에 다시 붙음
          player.isSticking = false;
          player.stickId = null;
        }
      } else {
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
        }
      }
      // Player 그리기
      Player.draw(ctx, player);

      // 플레이어 위에 타이머 그리기
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
            player.isSticking = false;
            player.stickId = null;
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
