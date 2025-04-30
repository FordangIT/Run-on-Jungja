"use client";

import { useSearchParams } from "next/navigation";
import { useState, useRef } from "react";
import GameCanvas from "@/components/GameCanvas";
import { getBackgroundColor } from "@/utils/gameUtils";

export default function Game() {
  const searchParams = useSearchParams();
  const nickname = searchParams.get("nickname") || "플레이어";
  const [score, setScore] = useState<number>(0);

  // 막대기 설정
  const stickHeight = 20;

  const radius = 150; // 캔버스 정중앙 기준 원의 반지름
  const adjustedRadius = radius - stickHeight / 2; // 테두리 위에 맞추기 위한 조정

  const stickList = useRef(
    Array.from({ length: 5 }, (_, i) => {
      const angle = (2 * Math.PI * i) / 5 - Math.PI / 2; // 12시 방향부터 시작

      const x = adjustedRadius * Math.cos(angle); // 중심 좌표 없이 상대 좌표
      const y = adjustedRadius * Math.sin(angle);

      return {
        id: i,
        x,
        y,
        angle
      };
    })
  );

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-screen transition-colors duration-500 ${getBackgroundColor(
        score
      )}`}
    >
      <p className="text-lg font-bold mb-2">Show Your Moves, {nickname}!</p>
      <p className="text-md mb-2">Score: {score}</p>
      <GameCanvas
        stickList={stickList.current}
        onScore={(s) =>
          setScore((prev) => (typeof prev === "number" ? prev + s : s))
        }
        score={score}
      />
    </div>
  );
}
