// pages/about.tsx
import Head from "next/head";

export default function About() {
  return (
    <>
      <Head>
        <title>About | Run on Jungja</title>
      </Head>
      <main
        style={{
          padding: "2rem",
          maxWidth: "700px",
          margin: "0 auto",
          lineHeight: "1.8"
        }}
      >
        <h1 className="text-2xl font-bold mb-6">About Run on Jungja</h1>
        <p className="mb-4">
          Welcome to{" "}
          <span className="font-bold text-blue-600">Run on Jungja</span>!
        </p>

        <p className="mb-4">
          <span className="font-bold">Run on Jungja</span> is a simple yet
          exciting <span className="text-blue-600">canvas-based web game</span>{" "}
          where players must move around, stick to designated poles, and avoid
          being caught by{" "}
          <span className="text-red-500 font-bold">taggers</span>.
        </p>

        <p className="mb-4">
          The goal is to <span className="font-bold">stick to the poles</span>{" "}
          (정자 막대) as often as possible while{" "}
          <span className="text-red-500 font-bold">dodging taggers</span>
          who chase players across the map. As you survive and move skillfully,
          your <span className="font-bold text-green-600">score increases</span>
          !
        </p>

        <p className="mb-10">
          We hope you enjoy playing and challenging yourself. Thank you for
          visiting our site!
        </p>

        {/* --- 한국어 버전 추가 --- */}

        <h1 className="text-2xl font-bold mb-6">Run on Jungja 소개</h1>
        <p className="mb-4">
          <span className="font-bold text-blue-600">Run on Jungja</span>에 오신
          것을 환영합니다!
        </p>

        <p className="mb-4">
          <span className="font-bold">Run on Jungja</span>는{" "}
          <span className="text-blue-600">캔버스 기반</span>으로 제작된
          간단하지만 흥미진진한 웹 게임입니다. 플레이어는 맵 위를 이동하면서{" "}
          <span className="font-bold text-green-600">정자 막대(poles)</span>에
          붙고,
          <span className="text-red-500 font-bold">술래(taggers)</span>에게
          잡히지 않도록 피해 다녀야 합니다.
        </p>

        <p className="mb-4">
          목표는 <span className="font-bold">정자 막대에 최대한 많이 붙기</span>
          이며, 술래들의 추격을 능숙하게{" "}
          <span className="font-bold text-red-500">회피</span>할수록 점수가{" "}
          <span className="font-bold text-green-600">상승</span>합니다!
        </p>

        <p className="mb-4">
          저희 게임을 즐기고, 스스로 도전하는 재미를 느끼시길 바랍니다. 방문해
          주셔서 감사합니다!
        </p>
      </main>
    </>
  );
}
