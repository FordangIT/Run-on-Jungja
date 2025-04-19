import { useEffect, useRef } from "react";
import Player from "./Player";
import Stick from "./Stick";
import StickTimer from "./StickTimer"; // ✅ 추가

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

          // 타이머 등록 (재접촉 시 초기화)
          if (
            !stickTimers.current[currentStickId] ||
            player.stickId !== currentStickId
          ) {
            stickTimers.current[currentStickId] = {
              start: timestamp,
              duration: 5000
            };
          }

          const timer = stickTimers.current[currentStickId];
          const elapsed = timestamp - timer.start;
          const progress = Math.min(elapsed / timer.duration, 1);

          // 타이머 그리기
          StickTimer.draw(ctx, {
            x: screenX,
            y: screenY,
            width: stickWidth,
            height: stickHeight,
            progress
          });

          // 타이머 만료 → 강제 떨어뜨림
          if (progress >= 1) {
            player.isSticking = false;
            player.stickId = null;
          }
        }
      }

      if (isTouching && currentStickId !== null) {
        player.isSticking = true;
        player.stickId = currentStickId;

        if (player.stickId !== prevStickIdRef.current) {
          onScore(10);
          prevStickIdRef.current = currentStickId;
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
