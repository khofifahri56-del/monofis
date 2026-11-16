/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TileType = 'start' | 'quiz' | 'material' | 'challenge' | 'bonus';

export type UserRole = 'admin' | 'moderator' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: number;
}

export interface BoardTile {
  index: number;
  type: TileType;
  title: string;
  subtitle: string;
  topic: string;
  icon: string;
  color: string;
  contentId: string;
}

export interface QuizQuestion {
  id: string;
  tileIndex: number;
  title: string;
  topic: string;
  question: string;
  options: string[];
  explanation: string;
  points: number; // typically 10
}

export interface SafeQuiz {
  id: string;
  tileIndex: number;
  title: string;
  topic: string;
  question: string;
  options: string[];
  points: number;
}

export interface PhysicsMaterial {
  id: string;
  tileIndex: number;
  title: string;
  topic: string;
  summary: string;
  keyPoints: string[];
  formula?: string;
  funFact?: string;
  application: string;
}

export interface PhysicsChallenge {
  id: string;
  tileIndex: number;
  title: string;
  topic: string;
  description: string;
  task: string;
  hints: string[];
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  rewardPoints: number; // e.g. 10
}

export interface GameContentStore {
  materials: Record<string, PhysicsMaterial>;
  quizzes: Record<string, SafeQuiz>;
  challenges: Record<string, PhysicsChallenge>;
}

export interface Group {
  id: string;
  name: string;
  color: string;
  avatar: string;
  pionPosition: number; // 0 to 23
  score: number;
  quizPoints: number;
  bonusPoints: number;
  challengePoints: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  joinedAt: number;
  lastActiveAt: number;
  status: 'active' | 'disconnected';
  ownerUserId?: string;
}

export type GameStatus = 'waiting' | 'playing' | 'paused' | 'finished';

export interface CurrentAction {
  groupId: string;
  type: 'roll_dice' | 'quiz' | 'material' | 'challenge' | 'bonus' | 'waiting_next';
  tileIndex: number;
  contentId?: string;
  diceValue?: number;
  answered?: boolean;
  bonusClaimed?: boolean;
}

export interface AnswerRecord {
  id: string;
  groupId: string;
  groupName: string;
  questionId: string;
  questionTitle: string;
  selectedAnswer: string;
  selectedIndex: number;
  isCorrect: boolean;
  pointsAwarded: number;
  answeredAt: number;
}

export interface GameEvent {
  id: string;
  groupId: string;
  groupName: string;
  eventType:
    | 'joined'
    | 'roll_dice'
    | 'move'
    | 'quiz_answered'
    | 'material_read'
    | 'challenge_completed'
    | 'bonus_claimed'
    | 'game_start'
    | 'game_paused'
    | 'game_resumed'
    | 'game_ended'
    | 'group_removed';
  description: string;
  fromPosition?: number;
  toPosition?: number;
  pointsAwarded?: number;
  timestamp: number;
}

export interface GameSession {
  id: string;
  gameCode: string;
  gameName: string;
  teacherName: string;
  createdByUserId?: string;
  status: GameStatus;
  currentTurnGroupId: string | null;
  currentTurnIndex: number;
  turnNumber: number;
  currentAction: CurrentAction | null;
  groups: Record<string, Group>;
  groupOrder: string[];
  answers: Record<string, AnswerRecord>;
  events: GameEvent[];
  createdAt: number;
  updatedAt: number;
  finishedAt?: number;
  winnerGroupId?: string | null;
}

export type ConnectionState = 'connected' | 'reconnecting' | 'saved' | 'saving' | 'offline';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
