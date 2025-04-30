// GameCanvas.tsx (stick 점유 체크 - Player + Robot 전체 적용 버전)

import { useEffect, useRef, useState } from "react";
import Player from "./Player";
import Stick from "./Stick";
import Tagger from "./Tagger";
import Robot from "./Robot";
import Item from "./Item";
import JoystickController from "./JoystickController";
import { getScoreMessage } from "@/utils/gameUtils";
import { getTaggerSpeed } from "@/utils/gameUtils";
import { getRobotSpeed } from "@/utils/gameUtils";

interface GameCanvasProps {
  stickList: { id: number; x: number; y: number; angle: number }[];
  onScore: (score: number) => void;
  score: number;
}

export default function GameCanvas({
  stickList,
  onScore,
  score
}: GameCanvasProps) {
  const [isGameOver, setIsGameOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const playerRef = useRef({
    x: 50,
    y: 50,
    speed: 2,
    isSticking: false,
    stickId: null as number | null,
    isCaught: false
  });

  const taggerRef = useRef({
    x: 250,
    y: 250,
    speed: 1.2,
    targetType: null as "player" | "robot" | null,
    targetId: null as number | null
  });

  const [robots, setRobots] = useState(
    Array.from({ length: 2 }, (_, i) => ({
      id: i,
      x: Math.random() * 280 + 10,
      y: Math.random() * 280 + 10,
      speed: 1.5,
      isSticking: false,
      stickId: null as number | null,
      stickTimer: 0,
      targetStickId: null as number | null
    }))
  );

  const [itemList, setItemList] = useState<
    { id: number; x: number; y: number; speed: number }[]
  >([]);
  const itemIdRef = useRef(0);

  const stickTimers = useRef<
    Record<number, { start: number; duration: number }>
  >({});
  const prevStickIdRef = useRef<number | null>(null);
  const wasDetached = useRef(false);

  const centerX = 150;
  const centerY = 150;
  const stickWidth = 20;
  const stickHeight = 40;

  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleJoystickMove = (direction: string) => {
    const player = playerRef.current;
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);

    moveIntervalRef.current = setInterval(() => {
      if (player.isCaught) return;
      switch (direction) {
        case "FORWARD":
          player.y -= player.speed;
          break;
        case "BACKWARD":
          player.y += player.speed;
          break;
        case "LEFT":
          player.x -= player.speed;
          break;
        case "RIGHT":
          player.x += player.speed;
          break;
      }
    }, 20); // 이동 반응 속도
  };

  const handleJoystickStop = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const player = playerRef.current;
        const spawnNearPlayer = Math.random() < 0.5; // 50% 확률로 가까운 위치
        let randomX: number;

        if (spawnNearPlayer) {
          const offset = (Math.random() - 0.5) * 60; // -30~+30
          randomX = Math.max(10, Math.min(290, player.x + offset));
        } else {
          randomX = Math.random() * 280 + 10;
        }

        const itemSpeed = player.speed;

        setItemList((prev) => [
          ...prev,
          { id: itemIdRef.current++, x: randomX, y: -10, speed: itemSpeed }
        ]);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const player = playerRef.current;
      if (player.isCaught) return;
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let animationFrameId: number;

    const draw = (timestamp: number) => {
      const player = playerRef.current;
      const tagger = taggerRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (player.isCaught) {
        Player.draw(ctx, { ...player, isCaught: true });
        robots.forEach((robot) => Robot.draw(ctx, robot));
        itemList.forEach((item) => Item.draw(ctx, item));
        Tagger.draw(ctx, tagger);
        cancelAnimationFrame(animationFrameId);
        return;
      }

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

      const isStickOccupied = (stickId: number | null) => {
        if (stickId === null) return false;
        const occupiedByRobot = robots.some(
          (robot) => robot.stickId === stickId
        );
        const occupiedByPlayer = playerRef.current.stickId === stickId;
        return occupiedByRobot || occupiedByPlayer;
      };

      if (touchedStickId !== null) {
        if (!robots.some((robot) => robot.stickId === touchedStickId)) {
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
        }
      } else {
        player.isSticking = false;
        player.stickId = null;
        wasDetached.current = true;
      }

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

      setItemList((prev) =>
        prev
          .map((item) => ({ ...item, y: item.y + item.speed }))
          .filter((item) => item.y < canvas.height + 20)
      );
      itemList.forEach((item) => {
        Item.draw(ctx, item);
        const dx = player.x - item.x;
        const dy = player.y - item.y;
        if (Math.sqrt(dx * dx + dy * dy) < 15) {
          player.speed += 0.5;
          setItemList((prev) => prev.filter((i) => i.id !== item.id));
        }
      });

      setRobots((prev) =>
        prev.map((robot) => {
          // ✨ 점수 기반 속도 조절
          robot.speed = getRobotSpeed(score);
          if (robot.isSticking) {
            const elapsed = timestamp - robot.stickTimer;
            if (elapsed > 5000) {
              return {
                ...robot,
                isSticking: false,
                stickId: null,
                targetStickId: null
              };
            }
            return robot;
          } else {
            if (robot.targetStickId === null) {
              const availableSticks = stickList.filter(
                (stick) => !isStickOccupied(stick.id)
              );
              if (availableSticks.length > 0) {
                const randomStick =
                  availableSticks[
                    Math.floor(Math.random() * availableSticks.length)
                  ];
                return { ...robot, targetStickId: randomStick.id };
              }
            } else {
              const targetStick = stickList.find(
                (s) => s.id === robot.targetStickId
              );
              if (targetStick) {
                const targetX = centerX + targetStick.x;
                const targetY = centerY + targetStick.y;
                const dx = targetX - robot.x;
                const dy = targetY - robot.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 5) {
                  if (!isStickOccupied(robot.targetStickId)) {
                    return {
                      ...robot,
                      x: targetX,
                      y: targetY,
                      isSticking: true,
                      stickId: robot.targetStickId,
                      stickTimer: timestamp
                    };
                  } else {
                    return { ...robot, targetStickId: null };
                  }
                } else {
                  return {
                    ...robot,
                    x: robot.x + (dx / distance) * robot.speed,
                    y: robot.y + (dy / distance) * robot.speed
                  };
                }
              }
            }
          }
          return robot;
        })
      );

      robots.forEach((robot) => Robot.draw(ctx, robot));

      /*** ✨✨ 여기부터 술래(Tagger) 움직임 추가 ✨✨ ***/
      const findNewTarget = () => {
        const candidates = [
          ...(player.isSticking
            ? []
            : [{ type: "player" as const, id: 0, x: player.x, y: player.y }]),
          ...robots
            .filter((robot) => !robot.isSticking)
            .map((robot) => ({
              type: "robot" as const,
              id: robot.id,
              x: robot.x,
              y: robot.y
            }))
        ];
        if (candidates.length === 0) return;

        candidates.sort((a, b) => {
          const da = Math.hypot(a.x - tagger.x, a.y - tagger.y);
          const db = Math.hypot(b.x - tagger.x, b.y - tagger.y);
          return da - db;
        });

        tagger.targetType = candidates[0].type;
        tagger.targetId = candidates[0].id;
      };

      let targetX: number | null = null;
      let targetY: number | null = null;

      if (tagger.targetType === "player" && !player.isSticking) {
        targetX = player.x;
        targetY = player.y;
      } else if (tagger.targetType === "robot") {
        const targetRobot = robots.find((r) => r.id === tagger.targetId);
        if (targetRobot && !targetRobot.isSticking) {
          targetX = targetRobot.x;
          targetY = targetRobot.y;
        }
      }

      // ✨ 점수에 따라 속도 조절
      tagger.speed = getTaggerSpeed(score);

      if (targetX === null || targetY === null) {
        findNewTarget();
      } else {
        const dx = targetX - tagger.x;
        const dy = targetY - tagger.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 1) {
          tagger.x += (dx / distance) * tagger.speed;
          tagger.y += (dy / distance) * tagger.speed;
        }

        if (distance < 15) {
          if (tagger.targetType === "player") {
            player.isCaught = true;
            setIsGameOver(true); // ✨ 게임 오버 상태 변경
          }
          tagger.targetType = null;
          tagger.targetId = null;
        }
      }

      Tagger.draw(ctx, tagger);
      /*** ✨✨ 술래(Tagger) 움직임 끝 ✨✨ ***/

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [stickList, onScore, robots, itemList]);

  return (
    <div className="flex flex-col items-center">
      {/* 캔버스 */}
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="rounded-full border-[6px] border-amber-700 shadow-lg w-[300px] h-[300px]"
      />

      {/* 조이스틱 아래에 위치 */}
      <div className="mt-4">
        <JoystickController
          onMove={handleJoystickMove}
          onStop={handleJoystickStop}
        />
      </div>

      {/* 게임 오버 화면 */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10">
          <h1 className="text-white text-2xl font-bold mb-4">Game Over</h1>

          <div className="bg-orange-500 w-full h-8 flex items-center justify-center">
            <div className="text-white font-semibold">
              {getScoreMessage(score)}
            </div>
          </div>
          <h5 className="text-green-500 font-semibold mb-4">score: {score}</h5>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-black px-4 py-2 rounded"
          >
            restart
          </button>
        </div>
      )}
    </div>
  );
}
