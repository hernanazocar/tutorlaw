'use client';

import { useState, useEffect, useRef } from 'react';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SuggestionsPanel } from '@/components/chat/SuggestionsPanel';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { QuickTemplates } from '@/components/chat/QuickTemplates';
import { MateriaTags } from '@/components/chat/MateriaTags';
import { TeacherModeToggle, type TeacherMode } from '@/components/chat/TeacherModeToggle';
import { LevelBadge } from '@/components/gamification/LevelBadge';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { QuickQuizModal } from '@/components/gamification/QuickQuizModal';
import { ExamSimulator } from '@/components/gamification/ExamSimulator';
import { DailyChallenge } from '@/components/gamification/DailyChallenge';
import { FlashcardGenerator } from '@/components/flashcards/FlashcardGenerator';
import { KnowledgeAssessment } from '@/components/assessment/KnowledgeAssessment';
import { MindMapGenerator } from '@/components/mindmap/MindMapGenerator';
import { OralDebateMode } from '@/components/debate/OralDebateMode';
import { exportToPDF } from '@/lib/pdf-export';
import { detectMaterias, type MateriaTag } from '@/lib/auto-tags';
import type { Conversation, ConversationMessage } from '@/lib/types';
import {
  BookIcon,
  SearchIcon,
  ScaleIcon,
  MessageIcon,
  PencilIcon,
  MicIcon,
  FileTextIcon,
  LightningIcon,
  CheckCircleIcon,
  SettingsIcon,
  NoteIcon,
  ChartBarIcon,
  LogOutIcon,
  TargetIcon,
  SparklesIcon,
  BrainIcon,
  ClockIcon,
  CalendarIcon,
} from '@/components/ui/Icons';

const MODOS = [
  {
    id: 'tutor',
    nombre: 'Tutor',
    descripcion: 'Explicaciones paso a paso',
    icon: BookIcon,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    activeColor: 'from-blue-500 to-blue-600',
  },
  {
    id: 'socratico',
    nombre: 'Socrático',
    descripcion: 'Aprende preguntando',
    icon: SearchIcon,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
    activeColor: 'from-purple-500 to-purple-600',
  },
  {
    id: 'caso',
    nombre: 'IRAC',
    descripcion: 'Resuelve casos',
    icon: ScaleIcon,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    activeColor: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'debate',
    nombre: 'Debate',
    descripcion: 'Argumenta',
    icon: MessageIcon,
    color: 'bg-orange-50 text-orange-600 border-orange-200',
    activeColor: 'from-orange-500 to-orange-600',
  },
  {
    id: 'examen',
    nombre: 'Examen',
    descripcion: 'Preguntas',
    icon: PencilIcon,
    color: 'bg-red-50 text-red-600 border-red-200',
    activeColor: 'from-red-500 to-red-600',
  },
  {
    id: 'oral',
    nombre: 'Oral',
    descripcion: 'Simula oral',
    icon: MicIcon,
    color: 'bg-pink-50 text-pink-600 border-pink-200',
    activeColor: 'from-pink-500 to-pink-600',
  },
  {
    id: 'ensayo',
    nombre: 'Ensayo',
    descripcion: 'Evalúa redacción',
    icon: FileTextIcon,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    activeColor: 'from-indigo-500 to-indigo-600',
  },
];

export default function ChatPage() {
  const [modoActual, setModoActual] = useState(MODOS[0]);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentTags, setCurrentTags] = useState<MateriaTag[]>([]);
  const [teacherMode, setTeacherMode] = useState<TeacherMode>('patient');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showMindMap, setShowMindMap] = useState(false);
  const [showOralDebate, setShowOralDebate] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversations for current mode
  useEffect(() => {
    loadConversations();
  }, [modoActual.id]);

  // Load messages for current conversation
  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    }
  }, [currentConversationId]);

  const loadConversations = async () => {
    try {
      const res = await fetch(`/api/conversations?mode=${modoActual.id}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (res.ok) {
        const data: ConversationMessage[] = await res.json();
        setMessages(data.map(m => ({ role: m.role, content: m.content })));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createNewConversation = async (firstMessage: string) => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : ''),
          mode: modoActual.id,
        }),
      });

      if (res.ok) {
        const conversation = await res.json();
        setCurrentConversationId(conversation.id);
        setConversations(prev => [conversation, ...prev]);
        return conversation.id;
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
    return null;
  };

  const saveMessage = async (conversationId: string, role: 'user' | 'assistant', content: string) => {
    try {
      await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, content }),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    // Detectar materias automáticamente
    const detectedTags = detectMaterias(userMessage);
    setCurrentTags(detectedTags);

    let conversationId = currentConversationId;

    // Create new conversation if this is the first message
    if (!conversationId) {
      conversationId = await createNewConversation(userMessage);
    }

    // Save user message
    if (conversationId) {
      await saveMessage(conversationId, 'user', userMessage);
    }

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          mode: modoActual.id,
          anonymous: true, // Permitir uso sin autenticación
          teacherMode, // Modo profe paciente/exigente
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'assistant', content: assistantMessage };
          return newMessages;
        });
      }

      // Save assistant message
      if (conversationId) {
        await saveMessage(conversationId, 'assistant', assistantMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error al procesar tu mensaje. Por favor intenta de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const handleSelectSuggestion = (prompt: string) => {
    setInput(prompt);
  };

  const handleSelectTemplate = (suffix: string) => {
    setInput(prev => prev + suffix);
    setShowTemplates(false);
  };

  const handleExportPDF = () => {
    if (messages.length === 0) {
      alert('No hay mensajes para exportar');
      return;
    }

    const title = currentConversationId
      ? conversations.find(c => c.id === currentConversationId)?.title || 'Conversación'
      : 'Conversación';

    exportToPDF(messages, modoActual.nombre, title);
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'es-CL';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-r border-[#e9ecef] flex flex-col overflow-hidden shadow-sm`}>
        {/* Header Sidebar */}
        <div className="p-4 border-b border-[#e9ecef] bg-gradient-to-br from-blue-50 to-white">
          <Logo size="sm" showText={true} />
          <p className="text-xs text-[#6c757d] mt-1.5 font-medium">Tu tutor jurídico con IA</p>
        </div>

        {/* New Conversation Button */}
        <div className="p-2 border-b border-[#e9ecef]">
          <button
            onClick={startNewConversation}
            className="w-full px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-bold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
            </svg>
            <span>Nueva</span>
          </button>
        </div>

        {/* Mi Progreso */}
        <div className="p-1.5 mb-2 bg-gradient-to-br from-purple-50 to-white border-b border-[#e9ecef]">
          <h3 className="text-xs font-semibold text-[#6c757d] uppercase tracking-wide mb-1 px-1">
            Progreso
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            <LevelBadge />
            <StreakCounter />
          </div>
        </div>

        {/* Práctica */}
        <div className="p-2 mb-2 bg-gradient-to-br from-blue-50 to-white border-b border-[#e9ecef]">
          <h3 className="text-xs font-bold text-[#6c757d] uppercase tracking-wide mb-1.5 px-1">
            Práctica
          </h3>
          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setShowChallenge(true)}
                className="px-2 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-xs font-bold hover:from-pink-600 hover:to-rose-600 transition-all flex flex-col items-center justify-center gap-0.5 shadow-sm hover:shadow-md"
              >
                <TargetIcon className="w-3.5 h-3.5" />
                <span className="text-xs">Desafío</span>
              </button>
              <button
                onClick={() => setShowAssessment(true)}
                className="px-2 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-xs font-bold hover:from-cyan-600 hover:to-blue-600 transition-all flex flex-col items-center justify-center gap-0.5 shadow-sm hover:shadow-md"
              >
                <BrainIcon className="w-3.5 h-3.5" />
                <span className="text-xs">Test</span>
              </button>
              <button
                onClick={() => setShowFlashcards(true)}
                className="px-2 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-xs font-bold hover:from-indigo-600 hover:to-purple-600 transition-all flex flex-col items-center justify-center gap-0.5 shadow-sm hover:shadow-md"
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                <span className="text-xs">Cards</span>
              </button>
              <button
                onClick={() => setShowQuiz(true)}
                className="px-2 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg text-xs font-bold hover:from-amber-500 hover:to-orange-600 transition-all flex flex-col items-center justify-center gap-0.5 shadow-sm hover:shadow-md"
              >
                <LightningIcon className="w-3.5 h-3.5" />
                <span className="text-xs">Quiz</span>
              </button>
            </div>

            <button
              onClick={() => setShowExam(true)}
              className="w-full px-2 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-xs font-bold hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
            >
              <CheckCircleIcon className="w-3.5 h-3.5" />
              <span className="text-xs">Examen</span>
            </button>
          </div>
        </div>

        {/* Modos de estudio */}
        <div className="flex-1 overflow-y-auto p-2">
          <h3 className="text-xs font-bold text-[#6c757d] uppercase tracking-wide mb-1.5 px-1">
            Modos de Estudio
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {MODOS.map((modo) => (
              <button
                key={modo.id}
                onClick={() => {
                  setModoActual(modo);
                  startNewConversation();
                }}
                className={`text-center p-1.5 rounded-lg transition-all duration-200 border ${
                  modoActual.id === modo.id
                    ? 'bg-gradient-to-br ' + modo.activeColor + ' text-white shadow-md scale-105 border-transparent'
                    : modo.color + ' border hover:shadow-sm'
                }`}
              >
                <div className="mb-0.5 flex justify-center">
                  <modo.icon className="w-4 h-4" />
                </div>
                <div className="font-semibold text-xs truncate">{modo.nombre}</div>
              </button>
            ))}
          </div>

          {/* Historial */}
          {conversations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#e9ecef]">
              <h3 className="text-xs font-bold text-[#6c757d] uppercase tracking-wide mb-1.5 px-1">
                Recientes
              </h3>
              <div className="space-y-1.5">
                {conversations.slice(0, 5).map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setCurrentConversationId(conv.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      currentConversationId === conv.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                        : 'text-[#212529] hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="text-xs font-medium truncate mb-0.5">{conv.title}</div>
                    <div className="text-xs text-[#6c757d]">
                      {new Date(conv.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="p-2 border-t border-[#e9ecef]">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-[#f8f9fa] transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#0066ff] flex items-center justify-center text-white font-semibold text-xs">
                H
              </div>
              <div className="flex-1 text-left">
                <div className="text-xs font-semibold text-[#212529]">Mi cuenta</div>
                <div className="text-xs text-[#6c757d]">5 preguntas</div>
              </div>
              <svg className="w-3 h-3 text-[#6c757d]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#e9ecef] rounded-lg shadow-lg overflow-hidden max-h-96 overflow-y-auto">
                <button
                  onClick={() => {
                    setShowOralDebate(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-[#f8f9fa] transition-colors text-xs text-[#212529]"
                >
                  <MicIcon className="w-3.5 h-3.5" />
                  <span>Debate Oral</span>
                </button>
                <button
                  onClick={() => {
                    setShowMindMap(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-[#f8f9fa] transition-colors text-xs text-[#212529]"
                >
                  <BrainIcon className="w-3.5 h-3.5" />
                  <span>Mapas Mentales</span>
                </button>
                <Link
                  href="/app/calendar"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#f8f9fa] transition-colors text-xs text-[#212529]"
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Calendario</span>
                </Link>
                <Link
                  href="/app/whatsapp"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#f8f9fa] transition-colors text-xs text-[#212529]"
                >
                  <MessageIcon className="w-3.5 h-3.5" />
                  <span>WhatsApp Bot</span>
                </Link>
                <div className="border-t border-gray-200"></div>
                <Link
                  href="/app/summary"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#f8f9fa] transition-colors text-xs text-[#212529]"
                >
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>Resumen Diario</span>
                </Link>
                <Link
                  href="/app/dashboard"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#f8f9fa] transition-colors text-xs text-[#212529]"
                >
                  <ChartBarIcon className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/app/notes"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#f8f9fa] transition-colors text-xs text-[#212529]"
                >
                  <NoteIcon className="w-3.5 h-3.5" />
                  <span>Apuntes</span>
                </Link>
                <Link
                  href="/app/settings"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#f8f9fa] transition-colors text-xs text-[#212529]"
                >
                  <SettingsIcon className="w-3.5 h-3.5" />
                  <span>Configuración</span>
                </Link>
                <div className="border-t border-gray-200"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-[#f8f9fa] transition-colors text-xs text-red-600"
                >
                  <LogOutIcon className="w-3.5 h-3.5" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-[#e9ecef] p-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-[#f8f9fa] rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-base text-[#212529]">{modoActual.nombre}</h1>
            <p className="text-xs text-[#6c757d]">{modoActual.descripcion}</p>
          </div>

          <TeacherModeToggle mode={teacherMode} onChange={setTeacherMode} />

          {messages.length > 0 && (
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#0066ff] hover:bg-[#e6f0ff] rounded-lg transition-colors"
              title="Exportar a PDF"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7 10 12 15 17 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hidden sm:inline">PDF</span>
            </button>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto">
              <div className="mb-4">
                <modoActual.icon className="w-20 h-20 mx-auto text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-[#212529] mb-2">
                Modo {modoActual.nombre}
              </h2>
              <p className="text-sm text-[#6c757d] mb-4">
                {modoActual.id === 'tutor' && 'Explicaciones paso a paso con ejemplos y artículos del código'}
                {modoActual.id === 'socratico' && 'Aprende pensando con el método socrático'}
                {modoActual.id === 'caso' && 'Resuelve casos con metodología IRAC'}
                {modoActual.id === 'debate' && 'Argumenta y defiende con jurisprudencia'}
                {modoActual.id === 'examen' && 'Genera preguntas y evalúa tus respuestas'}
                {modoActual.id === 'oral' && 'Simula examen oral con evaluación'}
                {modoActual.id === 'ensayo' && 'Revisa ensayos con rúbrica detallada'}
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-[#0066ff] text-white'
                        : 'bg-white border border-[#e9ecef] text-[#212529]'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <modoActual.icon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-semibold text-[#6c757d]">TutorLaw</span>
                      </div>
                    )}
                    <div className="text-sm leading-relaxed">
                      {message.role === 'user' ? (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-base font-bold mt-3 mb-1" {...props} />,
                            p: ({node, ...props}) => <p className="mb-2" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="ml-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                            em: ({node, ...props}) => <em className="italic" {...props} />,
                            code: ({node, inline, ...props}: any) =>
                              inline ?
                                <code className="bg-[#f8f9fa] px-1 py-0.5 rounded text-xs font-mono" {...props} /> :
                                <code className="block bg-[#f8f9fa] p-2 rounded my-2 text-xs font-mono overflow-x-auto" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#e9ecef] pl-3 my-2 italic text-[#6c757d]" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              ))}
{loading && messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
                <TypingIndicator modoColor={modoActual.activeColor} />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-[#e9ecef] p-3">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <QuickTemplates
                visible={showTemplates}
                onSelectTemplate={handleSelectTemplate}
              />
              <div className="flex gap-2">
                {/* Templates Button */}
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className={`p-2.5 rounded-lg transition-colors ${
                    showTemplates
                      ? 'bg-[#0066ff] text-white'
                      : 'bg-[#f8f9fa] text-[#6c757d] hover:bg-[#e9ecef]'
                  }`}
                  title="Templates rápidos"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Voice Button */}
                <button
                  onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                  className={`p-2.5 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-[#f8f9fa] text-[#6c757d] hover:bg-[#e9ecef]'
                  }`}
                  title={isListening ? 'Detener grabación' : 'Dictar con voz'}
                  disabled={loading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="19" x2="12" y2="23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="8" y1="23" x2="16" y2="23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Input */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  onFocus={() => setShowTemplates(false)}
                  placeholder={`Escribe tu ${modoActual.id === 'caso' ? 'caso' : 'pregunta'}...`}
                  className="flex-1 px-4 py-2.5 text-sm bg-[#f8f9fa] border border-[#e9ecef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-[#212529] placeholder-[#6c757d]"
                  disabled={loading}
                />

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="px-6 py-2.5 bg-[#0066ff] text-white rounded-lg text-sm font-semibold hover:bg-[#0052cc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Pensando...' : 'Enviar'}
                </button>
              </div>
            </div>

            {/* Tags detectados */}
            {currentTags.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-[#6c757d] mb-2">Materias detectadas:</p>
                <MateriaTags tags={currentTags} />
              </div>
            )}

            <p className="text-xs text-[#6c757d] mt-2 text-center">
              TutorLaw puede cometer errores. Verifica información importante.
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions Panel */}
      <SuggestionsPanel mode={modoActual.id} onSelectSuggestion={handleSelectSuggestion} />

      {/* Quick Quiz Modal */}
      <QuickQuizModal isOpen={showQuiz} onClose={() => setShowQuiz(false)} />

      {/* Exam Simulator Modal */}
      <ExamSimulator
        isOpen={showExam}
        onClose={() => setShowExam(false)}
        ramo={modoActual.nombre}
        jurisdiccion="Chile"
      />

      {/* Daily Challenge Modal */}
      <DailyChallenge
        isOpen={showChallenge}
        onClose={() => setShowChallenge(false)}
        jurisdiccion="Chile"
      />

      {/* Flashcard Generator Modal */}
      <FlashcardGenerator
        isOpen={showFlashcards}
        onClose={() => setShowFlashcards(false)}
        jurisdiccion="Chile"
      />

      {/* Knowledge Assessment Modal */}
      <KnowledgeAssessment
        isOpen={showAssessment}
        onClose={() => setShowAssessment(false)}
        jurisdiccion="Chile"
      />

      {/* Mind Map Generator Modal */}
      <MindMapGenerator
        isOpen={showMindMap}
        onClose={() => setShowMindMap(false)}
        jurisdiccion="Chile"
      />

      {/* Oral Debate Mode Modal */}
      <OralDebateMode
        isOpen={showOralDebate}
        onClose={() => setShowOralDebate(false)}
        ramo={modoActual.nombre}
        jurisdiccion="Chile"
      />
    </div>
  );
}
