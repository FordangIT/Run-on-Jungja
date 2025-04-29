export function getScoreMessage(score: number) {
  if (score <= 50) return "Just quit the game already.";
  if (score <= 100) return "Haha, anyone can do this.";
  if (score <= 150) return "Oh, you're actually pretty good!";
  if (score <= 200) return "You're starting to make this fun.";
  if (score <= 250) return "Whoa, you're really good!";
  if (score <= 300) return "You're probably the best in your town.";
  if (score <= 350) return "Wait, you actually did this? Is this all you do?";
  return "You're simply the GOAT.";
}

export function getBackgroundColor(score: number) {
  if (score <= 0) return "bg-white"; // 점수 없음: 흰색
  if (score <= 50) return "bg-amber-100"; // 낮은 점수: 어둡게
  if (score <= 100) return "bg-orange-200"; // 보통
  if (score <= 150) return "bg-green-200"; // 좀 잘함
  if (score <= 200) return "bg-sky-200"; // 꽤 잘함
  if (score <= 250) return "bg-purple-200"; // 고수
  if (score <= 300) return "bg-teal-300"; // 최상급
  if (score <= 350) return "bg-emerald-300"; // 거의 신급
  return "bg-lime-700"; // 360점 이상: 레전드
}
