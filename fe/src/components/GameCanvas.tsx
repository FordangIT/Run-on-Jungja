import { useEffect, useRef, useState } from "react";
import Player from "./Player";
import Stick from "./Stick";
import Item from "./Item"; // ✅ 아이템 추가

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
  const wasDetached = useRef(false);

  const [itemList, setItemList] = useState<
    { id: number; x: number; y: number; speed: number }[]
  >([]);
  const itemIdRef = useRef(0);

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
          player.isSticking = true;
        } else {
          if (wasDetached.current) {
            if (touchedStickId !== prevStickIdRef.current) {
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
              player.isSticking = false;
              player.stickId = null;
            }
          } else {
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
        player.isSticking = false;
        player.stickId = null;
        wasDetached.current = true;
      }

      // Player
      Player.draw(ctx, player);

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
            wasDetached.current = true;
          }
        }
      }

      // 아이템
      setItemList(
        (prev) =>
          prev
            .map((item) => ({
              ...item,
              y: item.y + item.speed
            }))
            .filter((item) => item.y < canvas.height + 20) // 화면 아래로 떨어진 건 삭제
      );

      itemList.forEach((item) => {
        Item.draw(ctx, item);

        // 아이템과 플레이어 충돌 체크
        const dx = player.x - item.x;
        const dy = player.y - item.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 15) {
          // 충돌하면
          player.speed += 0.5; // 속도 업그레이드
          setItemList((prev) => prev.filter((i) => i.id !== item.id));
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [stickList, onScore, itemList]);

  // 랜덤 아이템 생성
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const randomX = Math.random() * 280 + 10; // x축 랜덤
        const randomSpeed = Math.random() * 1 + 1.5; // 속도 1.5 ~ 2.5

        setItemList((prev) => [
          ...prev,
          { id: itemIdRef.current++, x: randomX, y: -10, speed: randomSpeed }
        ]);
      }
    }, 6000); // 4초마다 한 번 생성

    return () => clearInterval(interval);
  }, []);

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
