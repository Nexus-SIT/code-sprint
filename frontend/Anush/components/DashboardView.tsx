
import React from 'react';
import { Path, UserStats, Room } from '../types';

interface DashboardViewProps {
  path: Path;
  stats: UserStats;
  completedRooms: string[];
  onSelectRoom: (modIdx: number, roomIdx: number) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ path, stats, completedRooms, onSelectRoom }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f0f2f5] dark:bg-[#0d1117] text-slate-80