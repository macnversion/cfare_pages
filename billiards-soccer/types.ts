export interface Vector {
  x: number;
  y: number;
}

export enum BallType {
  SOCCER,
  TEAM_A,
  TEAM_B,
}

export interface Ball {
  id: number;
  type: BallType;
  team?: 'A' | 'B';
  isGoalkeeper?: boolean;
  color: string;
  position: Vector;
  velocity: Vector;
  radius: number;
  mass: number;
  isPocketed: boolean;
}

export enum GameState {
  AIMING,
  SHOOTING,
  SCORED,
  GAME_OVER,
}