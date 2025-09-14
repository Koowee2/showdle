import { useState, useEffect } from 'react';

export interface GameStats {
  played: number;
  won: number;
  winPercentage: number;
  currentStreak: number;
  longestStreak: number;
}

const STATS_KEY = 'showdle-stats';

const defaultStats: GameStats = {
  played: 0,
  won: 0,
  winPercentage: 0,
  currentStreak: 0,
  longestStreak: 0,
};

export const useGameStats = () => {
  const [stats, setStats] = useState<GameStats>(defaultStats);

  useEffect(() => {
    const savedStats = localStorage.getItem(STATS_KEY);
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
  }, []);

  const saveStats = (newStats: GameStats) => {
    setStats(newStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  };

  const updateStats = (gameWon: boolean) => {
    const newStats = { ...stats };
    newStats.played += 1;
    
    if (gameWon) {
      newStats.won += 1;
      newStats.currentStreak += 1;
      newStats.longestStreak = Math.max(newStats.longestStreak, newStats.currentStreak);
    } else {
      newStats.currentStreak = 0;
    }
    
    newStats.winPercentage = newStats.played > 0 ? Math.round((newStats.won / newStats.played) * 100) : 0;
    
    saveStats(newStats);
  };

  return { stats, updateStats };
};