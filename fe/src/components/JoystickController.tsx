// components/JoystickController.tsx
import { Joystick } from "react-joystick-component";

interface JoystickControllerProps {
  onMove: (direction: string) => void;
  onStop: () => void;
}

export default function JoystickController({
  onMove,
  onStop
}: JoystickControllerProps) {
  return (
    <Joystick
      size={80}
      baseColor="#888"
      stickColor="#fff"
      move={(e) => {
        if (e.direction) onMove(e.direction);
      }}
      stop={onStop}
    />
  );
}
