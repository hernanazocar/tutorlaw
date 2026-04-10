export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
};

export type Session = {
  id: string;
  user_id?: string;
  modo: string;
  ramo: string;
  titulo?: string;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  nombre?: string;
  universidad?: string;
  jurisdiccion: string;
  plan: 'free' | 'student' | 'university';
  consultas_mes: number;
  created_at: string;
};

export type Progress = {
  id: string;
  user_id: string;
  ramo: string;
  consultas: number;
  porcentaje: number;
  updated_at: string;
};

export type Logro = {
  id: string;
  user_id: string;
  logro_id: string;
  unlocked_at: string;
};

export type Modo = {
  label: string;
  icon: string;
  acento: string;
  bg: string;
};

export type ChatRequest = {
  messages: Message[];
  mode: string;
  ramo?: string;
  jurisdiccion?: string;
  sessionId?: string;
  anonymous?: boolean;
  teacherMode?: 'patient' | 'strict';
  userYear?: string;
};

export type FlashcardRequest = {
  tema: string;
  ramo: string;
  jurisdiccion: string;
};

export type Flashcard = {
  front: string;
  back: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  title: string;
  mode: string;
  created_at: string;
  updated_at: string;
};

export type ConversationMessage = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};
