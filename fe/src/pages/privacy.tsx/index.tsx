// pages/privacy.tsx
import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Run on Jungja</title>
      </Head>
      <main
        style={{
          padding: "2rem",
          maxWidth: "700px",
          margin: "0 auto",
          lineHeight: "1.8"
        }}
      >
        <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4 text-gray-700">
          Last updated:{" "}
          <span className="font-bold text-blue-600">April 22, 2025</span>
        </p>

        <p className="mb-6">
          Welcome to{" "}
          <span className="font-bold text-blue-600">Run on Jungja</span>! We
          respect your privacy and are committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, and
          safeguard your information when you use our game.
        </p>

        <h2 className="text-xl font-bold mb-2 text-blue-600">
          Information Collection
        </h2>
        <p className="mb-6">
          We may collect{" "}
          <span className="font-bold">non-personal information</span> such as
          browser type, device type, and anonymous gameplay data to{" "}
          <span className="text-green-600 font-bold">
            improve the user experience
          </span>
          .
        </p>

        <h2 className="text-xl font-bold mb-2 text-blue-600">Cookies</h2>
        <p className="mb-6">
          Our website uses{" "}
          <span className="font-bold text-green-600">cookies</span> to track
          usage patterns and enhance your experience. You can disable cookies
          through your browser settings at any time.
        </p>

        <h2 className="text-xl font-bold mb-2 text-blue-600">
          Third-Party Services
        </h2>
        <p className="mb-6">
          We may use third-party services such as{" "}
          <span className="font-bold text-purple-600">Google Analytics</span>{" "}
          and
          <span className="font-bold text-purple-600"> Google AdSense</span>,
          which may collect information according to their own privacy policies.
        </p>

        <h2 className="text-xl font-bold mb-2 text-blue-600">Contact</h2>
        <p className="mb-6">
          If you have any questions about this Privacy Policy, please contact us
          at:
          <span className="font-bold text-blue-600">
            {" "}
            runonjungja@gmail.com
          </span>
        </p>

        {/* --- 한국어 버전 추가 --- */}

        <h1 className="text-2xl font-bold mb-6 mt-12">개인정보 처리방침</h1>
        <p className="mb-4 text-gray-700">
          최종 업데이트일:{" "}
          <span className="font-bold text-blue-600">2025년 4월 22일</span>
        </p>

        <p className="mb-6">
          <span className="font-bold text-blue-600">Run on Jungja</span>에 오신
          것을 환영합니다! 저희는 사용자의 개인정보를 존중하며, 이를 보호하기
          위해 최선을 다하고 있습니다. 본 개인정보 처리방침은 당사 게임을 이용할
          때 정보가 어떻게 수집, 사용, 보호되는지를 설명합니다.
        </p>

        <h2 className="text-xl font-bold mb-2 text-blue-600">정보 수집</h2>
        <p className="mb-6">
          저희는 브라우저 종류, 기기 종류, 익명화된 게임 플레이 데이터와 같은{" "}
          <span className="font-bold">비개인정보</span>를 수집할 수 있습니다.
          이는{" "}
          <span className="text-green-600 font-bold">사용자 경험 개선</span>을
          목적으로 합니다.
        </p>

        <h2 className="text-xl font-bold mb-2 text-blue-600">쿠키(Cookies)</h2>
        <p className="mb-6">
          저희 웹사이트는 <span className="font-bold text-green-600">쿠키</span>
          를 사용하여 이용 패턴을 분석하고 사용자 경험을 향상합니다. 원하시면
          브라우저 설정을 통해 쿠키를 비활성화할 수 있습니다.
        </p>

        <h2 className="text-xl font-bold mb-2 text-blue-600">제3자 서비스</h2>
        <p className="mb-6">
          저희는{" "}
          <span className="font-bold text-purple-600">Google Analytics</span> 및
          <span className="font-bold text-purple-600"> Google AdSense</span>와
          같은 제3자 서비스를 이용할 수 있으며, 이들 서비스는 자체 개인정보
          보호정책에 따라 정보를 수집할 수 있습니다.
        </p>

        <h2 className="text-xl font-bold mb-2 text-blue-600">문의처</h2>
        <p className="mb-6">
          본 개인정보 처리방침에 관한 문의는
          <span className="font-bold text-blue-600">
            {" "}
            runonjungja@gmail.com
          </span>{" "}
          으로 연락해 주세요.
        </p>
      </main>
    </>
  );
}
