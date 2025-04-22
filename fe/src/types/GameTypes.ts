// types.ts (혹은 각 파일 상단에)

export interface PlayerType {
  x: number;
  y: number;
  speed: number;
  isSticking: boolean;
  stickId: number | null;
  isCaught?: boolean; // 필요하면
}

export interface StickType {
  id: number;
  x: number;
  y: number;
  angle: number;
}

export interface RobotType {
  x: number;
  y: number;
  speed: number;
  isSticking: boolean;
  stickId: number | null;
}

export interface TaggerType {
  x: number;
  y: number;
  speed: number;
}

export interface ItemType {
  id: number; // 아이템 고유 id
  x: number; // x 좌표
  y: number; // y 좌표
}

export interface PlayerCollisionType {
  x: number;
  y: number;
}

export interface StickCollisionType {
  x: number;
  y: number;
  width: number;
  height: number;
}
