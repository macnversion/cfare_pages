
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GameField } from './components/GameField';
import { Controls } from './components/Controls';
import { Scoreboard } from './components/Scoreboard';
import { getInitialBalls, FIELD_WIDTH, FIELD_HEIGHT, GOAL_Y_START, GOAL_HEIGHT, FRICTION, MIN_VELOCITY, WALL_ELASTICITY, PENALTY_AREA_A_X_START, PENALTY_AREA_A_X_END, PENALTY_AREA_B_X_START, PENALTY_AREA_B_X_END, PENALTY_AREA_Y_START, PENALTY_AREA_Y_END, TEAM_A_GOALIE_START_POS, TEAM_B_GOALIE_START_POS } from './constants';
import { type Ball, GameState, BallType } from './types';
import { WinnerModal } from './components/WinnerModal';
import { TeamSelectionModal } from './components/TeamSelectionModal';
import { type Team } from './teams';

const GoalScoredDisplay: React.FC<{ team: Team | null }> = ({ team }) => {
    if (!team) return null;
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 pointer-events-none">
            <div className="text-center animate-goal">
                <h2 className="text-8xl font-black text-white" style={{ textShadow: `0 0 20px ${team.primaryColor}` }}>GOAL!</h2>
                <p className="text-3xl font-bold uppercase" style={{ color: team.primaryColor }}>{`${team.name} Scores!`}</p>
            </div>
            <style>{`
                @keyframes goal-anim {
                    0% { transform: scale(0.5); opacity: 0; }
                    60% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-goal { animation: goal-anim 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};


export default function App() {
  const [isSelectionModalOpen, setSelectionModalOpen] = useState(true);
  const [teamA, setTeamA] = useState<Team | null>(null);
  const [teamB, setTeamB] = useState<Team | null>(null);

  const initialBalls = useRef<Ball[]>([]);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.AIMING);
  const [power, setPower] = useState(10);
  const [angle, setAngle] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  
  const [scores, setScores] = useState({ A: 0, B: 0 });
  const [currentPlayer, setCurrentPlayer] = useState<'A' | 'B'>('A');
  const [activeBallId, setActiveBallId] = useState<number | null>(null);
  const [lastGoalScorer, setLastGoalScorer] = useState<'A' | 'B' | null>(null);
  
  const [remainingTime, setRemainingTime] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const gameContainerRef = useRef<SVGSVGElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const resetForKickoff = useCallback((scoringTeam: 'A' | 'B') => {
      setBalls(JSON.parse(JSON.stringify(initialBalls.current)));
      setCurrentPlayer(scoringTeam === 'A' ? 'B' : 'A');
      setActiveBallId(null);
      setGameState(GameState.AIMING);
      setLastGoalScorer(null);
      setIsTimerRunning(true);
  }, []);

  const resetGame = useCallback(() => {
    setWinner(null);
    setSelectionModalOpen(true);
    setIsTimerRunning(false);
    setRemainingTime(300);
  }, []);

  const handleStartGame = useCallback((selectedTeamA: Team, selectedTeamB: Team) => {
    setTeamA(selectedTeamA);
    setTeamB(selectedTeamB);

    const newInitialBalls = getInitialBalls(selectedTeamA.primaryColor, selectedTeamB.primaryColor);
    initialBalls.current = newInitialBalls;

    setBalls(JSON.parse(JSON.stringify(newInitialBalls)));
    setGameState(GameState.AIMING);
    setWinner(null);
    setScores({ A: 0, B: 0 });
    setCurrentPlayer('A');
    setActiveBallId(null);
    setLastGoalScorer(null);
    setSelectionModalOpen(false);
    setRemainingTime(300);
    setIsTimerRunning(false);
  }, []);

  const handleShoot = useCallback(() => {
    if (gameState !== GameState.AIMING || activeBallId === null) return;

    if (!isTimerRunning) {
        setIsTimerRunning(true);
    }

    setBalls(prevBalls =>
      prevBalls.map(ball =>
        ball.id === activeBallId
          ? {
              ...ball,
              velocity: {
                x: Math.cos(angle) * power * 2.5,
                y: Math.sin(angle) * power * 2.5,
              },
            }
          : ball,
      ),
    );
    setGameState(GameState.SHOOTING);
    setActiveBallId(null);
  }, [angle, power, gameState, activeBallId, isTimerRunning]);

  const updateGame = useCallback(() => {
    setBalls(prevBalls => {
      const newBalls = prevBalls.map(b => ({ ...b, velocity: { ...b.velocity }, position: { ...b.position } }));
      let isMoving = false;

      const leftBoundary = 50;
      const rightBoundary = FIELD_WIDTH - 50;
      const topBoundary = 25;
      const bottomBoundary = FIELD_HEIGHT - 25;

      newBalls.forEach(ball => {
        if (ball.isPocketed) return;

        ball.velocity.x *= FRICTION;
        ball.velocity.y *= FRICTION;

        if (Math.abs(ball.velocity.x) < MIN_VELOCITY) ball.velocity.x = 0;
        if (Math.abs(ball.velocity.y) < MIN_VELOCITY) ball.velocity.y = 0;
        
        if (ball.velocity.x !== 0 || ball.velocity.y !== 0) {
          isMoving = true;
        }

        ball.position.x += ball.velocity.x;
        ball.position.y += ball.velocity.y;
        
        if (ball.isGoalkeeper) {
            let isOutside = false;
            if (ball.team === 'A') {
                if (ball.position.x < PENALTY_AREA_A_X_START || ball.position.x > PENALTY_AREA_A_X_END ||
                    ball.position.y < PENALTY_AREA_Y_START || ball.position.y > PENALTY_AREA_Y_END) {
                    isOutside = true;
                    ball.position = { ...TEAM_A_GOALIE_START_POS };
                }
            } else { // Team B
                if (ball.position.x < PENALTY_AREA_B_X_START || ball.position.x > PENALTY_AREA_B_X_END ||
                    ball.position.y < PENALTY_AREA_Y_START || ball.position.y > PENALTY_AREA_Y_END) {
                    isOutside = true;
                    ball.position = { ...TEAM_B_GOALIE_START_POS };
                }
            }
            if (isOutside) {
                ball.velocity = { x: 0, y: 0 };
            }
        }

        const inGoalY = ball.position.y >= GOAL_Y_START && ball.position.y <= GOAL_Y_START + GOAL_HEIGHT;

        // Top and bottom walls
        if (ball.position.y - ball.radius < topBoundary) {
          ball.velocity.y *= -WALL_ELASTICITY;
          ball.position.y = topBoundary + ball.radius;
        }
        if (ball.position.y + ball.radius > bottomBoundary) {
          ball.velocity.y *= -WALL_ELASTICITY;
          ball.position.y = bottomBoundary - ball.radius;
        }

        // Left and right walls (only bounce if not in goal mouth)
        if (ball.position.x - ball.radius < leftBoundary && !inGoalY) {
          ball.velocity.x *= -WALL_ELASTICITY;
          ball.position.x = leftBoundary + ball.radius;
        }
        if (ball.position.x + ball.radius > rightBoundary && !inGoalY) {
          ball.velocity.x *= -WALL_ELASTICITY;
          ball.position.x = rightBoundary - ball.radius;
        }
      });
      
      for (let i = 0; i < newBalls.length; i++) {
        for (let j = i + 1; j < newBalls.length; j++) {
          const ball1 = newBalls[i];
          const ball2 = newBalls[j];
          if (ball1.isPocketed || ball2.isPocketed) continue;
          
          const dx = ball2.position.x - ball1.position.x;
          const dy = ball2.position.y - ball1.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < ball1.radius + ball2.radius) {
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            
            let v1 = { x: ball1.velocity.x * cos + ball1.velocity.y * sin, y: ball1.velocity.y * cos - ball1.velocity.x * sin };
            let v2 = { x: ball2.velocity.x * cos + ball2.velocity.y * sin, y: ball2.velocity.y * cos - ball2.velocity.x * sin };
            
            const totalMass = ball1.mass + ball2.mass;
            const v1x_final = (v1.x * (ball1.mass - ball2.mass) + 2 * ball2.mass * v2.x) / totalMass;
            const v2x_final = (v2.x * (ball2.mass - ball1.mass) + 2 * ball1.mass * v1.x) / totalMass;
            v1.x = v1x_final;
            v2.x = v2x_final;

            ball1.velocity = { x: v1.x * cos - v1.y * sin, y: v1.y * cos + v1.x * sin };
            ball2.velocity = { x: v2.x * cos - v2.y * sin, y: v2.y * cos + v2.x * sin };

            const overlap = (ball1.radius + ball2.radius) - distance;
            const separationX = (overlap * dx) / distance / 2;
            const separationY = (overlap * dy) / distance / 2;
            ball1.position.x -= separationX;
            ball1.position.y -= separationY;
            ball2.position.x += separationX;
            ball2.position.y += separationY;
          }
        }
      }

      newBalls.forEach(ball => {
        if (ball.isPocketed) return;
        const inGoalY = ball.position.y >= GOAL_Y_START && ball.position.y <= GOAL_Y_START + GOAL_HEIGHT;

        if (ball.type !== BallType.SOCCER && !ball.isGoalkeeper) {
            if (inGoalY && (ball.position.x - ball.radius < leftBoundary || ball.position.x + ball.radius > rightBoundary)) {
                const initialBallState = initialBalls.current.find(b => b.id === ball.id);
                if (initialBallState) {
                    ball.position = { ...initialBallState.position };
                    ball.velocity = { x: 0, y: 0 };
                }
            }
        } else if (ball.type === BallType.SOCCER) {
            const inLeftGoal = ball.position.x - ball.radius < leftBoundary && inGoalY;
            const inRightGoal = ball.position.x + ball.radius > rightBoundary && inGoalY;

            if (inLeftGoal || inRightGoal) {
                ball.isPocketed = true;
                ball.velocity = { x: 0, y: 0 };
                const scoringTeam = inLeftGoal ? 'B' : 'A';
                
                setIsTimerRunning(false);
                setLastGoalScorer(scoringTeam);
                setGameState(GameState.SCORED);

                setScores(prevScores => {
                    const newScores = {...prevScores};
                    newScores[scoringTeam]++;
                    return newScores;
                });
            }
        }
      });
      
      if (!isMoving && gameState === GameState.SHOOTING) {
        setGameState(GameState.AIMING);
        setCurrentPlayer(prev => prev === 'A' ? 'B' : 'A');
      }

      return newBalls;
    });

    animationFrameRef.current = requestAnimationFrame(updateGame);
  }, [gameState, teamA, teamB]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (gameState !== GameState.AIMING || !gameContainerRef.current) return;
    
    const svgRect = gameContainerRef.current.getBoundingClientRect();
    const svgX = (e.clientX - svgRect.left) * (FIELD_WIDTH / svgRect.width);
    const svgY = (e.clientY - svgRect.top) * (FIELD_HEIGHT / svgRect.height);
    
    const soccerBall = balls.find(b => b.type === BallType.SOCCER);
    if (!soccerBall) return;

    let canGoaliePlay = false;
    if (currentPlayer === 'A') {
        canGoaliePlay = soccerBall.position.x >= PENALTY_AREA_A_X_START &&
                        soccerBall.position.x <= PENALTY_AREA_A_X_END &&
                        soccerBall.position.y >= PENALTY_AREA_Y_START &&
                        soccerBall.position.y <= PENALTY_AREA_Y_END;
    } else { // currentPlayer === 'B'
        canGoaliePlay = soccerBall.position.x >= PENALTY_AREA_B_X_START &&
                        soccerBall.position.x <= PENALTY_AREA_B_X_END &&
                        soccerBall.position.y >= PENALTY_AREA_Y_START &&
                        soccerBall.position.y <= PENALTY_AREA_Y_END;
    }

    let closestBall: Ball | null = null;
    let minDistance = Infinity;

    balls.forEach(ball => {
        if (ball.isPocketed || ball.team !== currentPlayer) return;

        if (ball.isGoalkeeper && !canGoaliePlay) {
            return;
        }

        const dx = svgX - ball.position.x;
        const dy = svgY - ball.position.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < minDistance && distance < 50) {
            minDistance = distance;
            closestBall = ball;
        }
    });

    if (closestBall) {
        setActiveBallId(closestBall.id);
    }
    
    const activeBall = balls.find(b => b.id === (closestBall?.id || activeBallId));
    if (activeBall) {
        const newAngle = Math.atan2(svgY - activeBall.position.y, svgX - activeBall.position.x);
        setAngle(newAngle);
    }
  }, [gameState, balls, currentPlayer, activeBallId]);

  useEffect(() => {
    if (gameState === GameState.SHOOTING) {
      animationFrameRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if(animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, updateGame]);

  useEffect(() => {
    if (gameState === GameState.SCORED && lastGoalScorer) {
        const timer = setTimeout(() => {
            if (winner === null) {
              resetForKickoff(lastGoalScorer);
            }
        }, 2500);
        return () => clearTimeout(timer);
    }
  }, [gameState, lastGoalScorer, resetForKickoff, winner]);
  
  useEffect(() => {
    if (!isTimerRunning || winner || isSelectionModalOpen) {
      return;
    }

    if (remainingTime <= 0) {
      setIsTimerRunning(false);
      setGameState(GameState.GAME_OVER);
      if (scores.A > scores.B) {
        setWinner(`${teamA!.name} Wins!`);
      } else if (scores.B > scores.A) {
        setWinner(`${teamB!.name} Wins!`);
      } else {
        setWinner("It's a Draw!");
      }
      return;
    }

    const timerId = setInterval(() => {
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isTimerRunning, remainingTime, winner, scores, teamA, teamB, isSelectionModalOpen]);

  if (isSelectionModalOpen) {
    return <TeamSelectionModal onStartGame={handleStartGame} />;
  }

  if (!teamA || !teamB) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-2 tracking-wider uppercase">Billiards Soccer</h1>
      <p className="text-gray-400 mb-2">The team with the most goals when the 5:00 timer ends wins!</p>
      
      <Scoreboard scores={scores} currentPlayer={currentPlayer} teamA={teamA} teamB={teamB} remainingTime={remainingTime} />

      <div className="relative w-full max-w-6xl aspect-[2/1] bg-green-700 rounded-lg shadow-2xl p-4 border-4 border-gray-600">
        <GameField
          balls={balls}
          gameState={gameState}
          angle={angle}
          power={power}
          containerRef={gameContainerRef}
          activeBallId={activeBallId}
          onMouseMove={handleMouseMove}
          onShoot={handleShoot}
        />
        {gameState === GameState.SCORED && <GoalScoredDisplay team={lastGoalScorer === 'A' ? teamA : teamB} />}
      </div>

      <div className="flex flex-row justify-center w-full max-w-2xl mt-4">
          <Controls
            power={power}
            setPower={setPower}
            onShoot={handleShoot}
            onReset={resetGame}
            disabled={gameState !== GameState.AIMING || activeBallId === null}
          />
      </div>

      {winner && <WinnerModal winner={winner} onReset={resetGame} />}
    </div>
  );
}
