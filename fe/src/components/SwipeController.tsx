import { useEffect } from "react";

interface SwipeControllerProps {
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export default function SwipeController({
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight
}: SwipeControllerProps) {
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;

      const dx = endX - startX;
      const dy = endY - startY;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) {
          onSwipeRight();
        } else if (dx < -30) {
          onSwipeLeft();
        }
      } else {
        if (dy > 30) {
          onSwipeDown();
        } else if (dy < -30) {
          onSwipeUp();
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight]);

  return null; // 화면에는 아무것도 그릴 필요 없어
}
