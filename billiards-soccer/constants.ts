import { BallType, type Ball } from './types';

export const FIELD_WIDTH = 1000;
export const FIELD_HEIGHT = 500;
export const BALL_RADIUS = 12; // Smaller balls to fit more

export const GOAL_HEIGHT = 150; // Smaller goal
export const GOAL_Y_START = (FIELD_HEIGHT - GOAL_HEIGHT) / 2;
export const GOAL_DEPTH = 20;

export const FRICTION = 0.985;
export const MIN_VELOCITY = 0.05;
export const WALL_ELASTICITY = 0.9;

export const TEAM_A_COLOR = '#ef4444'; // red
export const TEAM_B_COLOR = '#3b82f6'; // blue
export const SOCCER_BALL_COLOR = '#ffffff';

export const PENALTY_AREA_A_X_START = 50;
export const PENALTY_AREA_A_X_END = 150;
export const PENALTY_AREA_B_X_START = FIELD_WIDTH - 150;
export const PENALTY_AREA_B_X_END = FIELD_WIDTH - 50;
export const PENALTY_AREA_Y_START = 125;
export const PENALTY_AREA_Y_END = 375;

export const TEAM_A_GOALIE_START_POS = { x: 70, y: FIELD_HEIGHT / 2 };
export const TEAM_B_GOALIE_START_POS = { x: FIELD_WIDTH - 70, y: FIELD_HEIGHT / 2 };

// Helper to create a player ball
const createPlayer = (id: number, team: 'A' | 'B', position: {x: number, y: number}, color: string, isGoalkeeper = false): Ball => ({
    id,
    type: team === 'A' ? BallType.TEAM_A : BallType.TEAM_B,
    team,
    isGoalkeeper,
    color,
    position,
    velocity: { x: 0, y: 0 },
    radius: BALL_RADIUS,
    mass: 1.2, // Heavier than soccer ball
    isPocketed: false,
});

export const getInitialBalls = (teamAColor: string, teamBColor: string): Ball[] => {
  const balls: Ball[] = [];
  let idCounter = 0;

  // Soccer ball
  balls.push({
    id: idCounter++,
    type: BallType.SOCCER,
    color: SOCCER_BALL_COLOR,
    position: { x: FIELD_WIDTH / 2, y: FIELD_HEIGHT / 2 },
    velocity: { x: 0, y: 0 },
    radius: BALL_RADIUS,
    mass: 1,
    isPocketed: false,
  });

  // Team A (4-4-2 formation on the left)
  const teamAStartX = FIELD_WIDTH / 4;
  // Goalie
  balls.push(createPlayer(idCounter++, 'A', { ...TEAM_A_GOALIE_START_POS }, teamAColor, true));
  // Defenders
  balls.push(createPlayer(idCounter++, 'A', { x: teamAStartX, y: FIELD_HEIGHT / 2 - 120 }, teamAColor));
  balls.push(createPlayer(idCounter++, 'A', { x: teamAStartX, y: FIELD_HEIGHT / 2 - 60 }, teamAColor));
  balls.push(createPlayer(idCounter++, 'A', { x: teamAStartX, y: FIELD_HEIGHT / 2 + 60 }, teamAColor));
  balls.push(createPlayer(idCounter++, 'A', { x: teamAStartX, y: FIELD_HEIGHT / 2 + 120 }, teamAColor));
  // Midfielders
  balls.push(createPlayer(idCounter++, 'A', { x: teamAStartX + 120, y: FIELD_HEIGHT / 2 - 100 }, teamAColor));
  balls.push(createPlayer(idCounter++, 'A', { x: teamAStartX + 120, y: FIELD_HEIGHT / 2 - 30 }, teamAColor));
  balls.push(createPlayer(idCounter++, 'A', { x: teamAStartX + 120, y: FIELD_HEIGHT / 2 + 30 }, teamAColor));
  balls.push(createPlayer(idCounter++, 'A', { x: teamAStartX + 120, y: FIELD_HEIGHT / 2 + 100 }, teamAColor));
  // Strikers
  balls.push(createPlayer(idCounter++, 'A', { x: teamAStartX + 200, y: FIELD_HEIGHT / 2 - 40 }, teamAColor));
  balls.push(createPlayer(idCounter++, 'A', { x: teamAStartX + 200, y: FIELD_HEIGHT / 2 + 40 }, teamAColor));

  // Team B (4-4-2 formation on the right)
  const teamBStartX = FIELD_WIDTH * (3 / 4);
    // Goalie
  balls.push(createPlayer(idCounter++, 'B', { ...TEAM_B_GOALIE_START_POS }, teamBColor, true));
  // Defenders
  balls.push(createPlayer(idCounter++, 'B', { x: teamBStartX, y: FIELD_HEIGHT / 2 - 120 }, teamBColor));
  balls.push(createPlayer(idCounter++, 'B', { x: teamBStartX, y: FIELD_HEIGHT / 2 - 60 }, teamBColor));
  balls.push(createPlayer(idCounter++, 'B', { x: teamBStartX, y: FIELD_HEIGHT / 2 + 60 }, teamBColor));
  balls.push(createPlayer(idCounter++, 'B', { x: teamBStartX, y: FIELD_HEIGHT / 2 + 120 }, teamBColor));
  // Midfielders
  balls.push(createPlayer(idCounter++, 'B', { x: teamBStartX - 120, y: FIELD_HEIGHT / 2 - 100 }, teamBColor));
  balls.push(createPlayer(idCounter++, 'B', { x: teamBStartX - 120, y: FIELD_HEIGHT / 2 - 30 }, teamBColor));
  balls.push(createPlayer(idCounter++, 'B', { x: teamBStartX - 120, y: FIELD_HEIGHT / 2 + 30 }, teamBColor));
  balls.push(createPlayer(idCounter++, 'B', { x: teamBStartX - 120, y: FIELD_HEIGHT / 2 + 100 }, teamBColor));
  // Strikers
  balls.push(createPlayer(idCounter++, 'B', { x: teamBStartX - 200, y: FIELD_HEIGHT / 2 - 40 }, teamBColor));
  balls.push(createPlayer(idCounter++, 'B', { x: teamBStartX - 200, y: FIELD_HEIGHT / 2 + 40 }, teamBColor));
  
  return balls;
};