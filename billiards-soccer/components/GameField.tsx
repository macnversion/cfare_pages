import React, { RefObject } from 'react';
import { type Ball, GameState, BallType } from '../types';
import { FIELD_WIDTH, FIELD_HEIGHT, GOAL_Y_START, GOAL_HEIGHT, GOAL_DEPTH } from '../constants';

interface GameFieldProps {
  balls: Ball[];
  gameState: GameState;
  angle: number;
  power: number;
  containerRef: RefObject<SVGSVGElement>;
  activeBallId: number | null;
  onMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void;
  onShoot: () => void;
}

const SoccerBallPattern = () => (
    <pattern id="soccerPattern" patternUnits="userSpaceOnUse" width="10" height="10">
        <rect width="10" height="10" fill="white" />
        <path d="M2.5 0 L5 0 L5 2.5 L7.5 2.5 L7.5 5 L5 5 L5 7.5 L2.5 7.5 L2.5 5 L0 5 L0 2.5 L2.5 2.5 Z" fill="black" />
    </pattern>
);

const FootballFieldPattern = () => (
  <defs>
    <SoccerBallPattern />
    <pattern id="fieldPattern" patternUnits="userSpaceOnUse" width="100" height={FIELD_HEIGHT}>
      <rect width="100" height={FIELD_HEIGHT} fill="#15803d" />
      <rect width="100" height={FIELD_HEIGHT} fill="#16a34a" x="50" />
    </pattern>
    <pattern id="netPattern" patternUnits="userSpaceOnUse" width="10" height="10">
      <path d="M 0 0 L 10 10 M 10 0 L 0 10" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
    </pattern>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
    </filter>
  </defs>
);

const FieldMarkings = () => (
  <>
    {/* Boundary */}
    <rect x="50" y="25" width={FIELD_WIDTH - 100} height={FIELD_HEIGHT - 50} stroke="white" strokeWidth="3" fill="none" />
    {/* Halfway line */}
    <line x1={FIELD_WIDTH / 2} y1="25" x2={FIELD_WIDTH / 2} y2={FIELD_HEIGHT - 25} stroke="white" strokeWidth="3" />
    {/* Center circle */}
    <circle cx={FIELD_WIDTH / 2} cy={FIELD_HEIGHT / 2} r="75" stroke="white" strokeWidth="3" fill="none" />
    {/* Goal Areas */}
    <rect x="50" y="125" width="100" height="250" stroke="white" strokeWidth="3" fill="none" />
    <rect x={FIELD_WIDTH - 150} y="125" width="100" height="250" stroke="white" strokeWidth="3" fill="none" />
  </>
);

const BallComponent: React.FC<{ ball: Ball; isActive: boolean }> = React.memo(({ ball, isActive }) => {
  const fill = ball.type === BallType.SOCCER ? "url(#soccerPattern)" : ball.color;
  
  return (
    <g transform={`translate(${ball.position.x}, ${ball.position.y})`} style={{ filter: 'url(#shadow)' }}>
      <circle r={ball.radius} fill={fill} stroke={isActive ? 'yellow' : 'black'} strokeWidth={isActive ? 2.5 : 0.5} />
    </g>
  );
});

export const GameField: React.FC<GameFieldProps> = ({ balls, gameState, angle, power, containerRef, activeBallId, onMouseMove, onShoot }) => {
  const activeBall = balls.find(b => b.id === activeBallId);

  return (
    <svg
      ref={containerRef}
      viewBox={`0 0 ${FIELD_WIDTH} ${FIELD_HEIGHT}`}
      className="w-full h-full overflow-hidden rounded-md cursor-crosshair"
      onMouseMove={onMouseMove}
      onClick={onShoot}
    >
      <FootballFieldPattern />
      <rect width={FIELD_WIDTH} height={FIELD_HEIGHT} fill="url(#fieldPattern)" />
      
      {/* Goals */}
      <rect x={-1} y={GOAL_Y_START} width={GOAL_DEPTH} height={GOAL_HEIGHT} fill="url(#netPattern)" stroke="white" strokeWidth="2" />
      <rect x={FIELD_WIDTH - GOAL_DEPTH + 1} y={GOAL_Y_START} width={GOAL_DEPTH} height={GOAL_HEIGHT} fill="url(#netPattern)" stroke="white" strokeWidth="2" />
      
      <FieldMarkings />
      
      {balls.filter(b => !b.isPocketed).map(ball => (
        <BallComponent key={ball.id} ball={ball} isActive={ball.id === activeBallId} />
      ))}
      
      {gameState === GameState.AIMING && activeBall && !activeBall.isPocketed && (
        <g>
          <line
            x1={activeBall.position.x}
            y1={activeBall.position.y}
            x2={activeBall.position.x + Math.cos(angle) * (power * 15 + 40)}
            y2={activeBall.position.y + Math.sin(angle) * (power * 15 + 40)}
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="3"
            strokeDasharray="10 5"
          />
           <line
            x1={activeBall.position.x}
            y1={activeBall.position.y}
            x2={activeBall.position.x + Math.cos(angle) * (FIELD_WIDTH * 2)}
            y2={activeBall.position.y + Math.sin(angle) * (FIELD_WIDTH * 2)}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        </g>
      )}
    </svg>
  );
};