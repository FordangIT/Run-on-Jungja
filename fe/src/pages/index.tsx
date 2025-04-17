"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [nickname, setNickname] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (nickname.trim() === "") {
      alert("별명을 입력해 주세요!");
      return;
    }
    router.push(`/game?nickname=${encodeURIComponent(nickname)}`);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4 bg-gray-200">
      <h1 className="text-3xl font-bold mb-8">Run On Jungja</h1>

      <input
        type="text"
        placeholder="별명을 입력하세요"
        className="mb-4 px-4 py-2 rounded border border-gray-400 w-fit max-w-xs"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <button
        onClick={handleStart}
        className=" bg-green-500 text-white px-6 py-2 rounded-lg text-md hover:bg-green-600"
      >
        시작하기
      </button>
    </div>
  );
}
