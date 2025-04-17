import { useEffect, useRef } from "react";
import Player from "./Player";
import Stick from "./Stick";

interface GameCanvasProps {
  stickList: { id: number; x: number; y: number }[];
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

  const stickTimers = useRef<Record<number, number>>({});
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

      for (const stick of stickList) {
        Stick.draw(ctx, {
          ...stick,
          x: centerX + stick.x,
          y: centerY + stick.y,
          width: stickWidth,
          height: stickHeight,
          angle: stick.angle // ⭐ 추가!
        });
        if (
          Player.checkCollision(player, {
            x: centerX + stick.x,
            y: centerY + stick.y,
            width: stickWidth,
            height: stickHeight
          })
        ) {
          isTouching = true;
          currentStickId = stick.id;
        }
      }

      if (isTouching && currentStickId !== null) {
        const endTime = stickTimers.current[currentStickId];

        if (player.stickId !== currentStickId) {
          // 점수는 직전 막대기가 아니면 줌
          if (prevStickIdRef.current !== currentStickId) {
            onScore(100);
          }
          stickTimers.current[currentStickId] = timestamp + 3000;
          player.isSticking = true;
          player.stickId = currentStickId;
          prevStickIdRef.current = currentStickId;
        } else if (endTime && timestamp < endTime) {
          player.isSticking = true;
          player.stickId = currentStickId;
        } else {
          player.isSticking = false;
          player.stickId = null;
        }
      } else {
        player.isSticking = false;
        player.stickId = null;
      }

      Player.draw(ctx, player);
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [stickList, onScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const player = playerRef.current;

      // 이동은 항상 가능
      if (e.key === "ArrowUp") player.y -= player.speed;
      if (e.key === "ArrowDown") player.y += player.speed;
      if (e.key === "ArrowLeft") player.x -= player.speed;
      if (e.key === "ArrowRight") player.x += player.speed;

      // 스페이스: 수동으로 떨어지기 가능
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
