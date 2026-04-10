'use client';

import { useState, useEffect, useRef } from 'react';
import { MicIcon } from '@/components/ui/Icons';

interface OralDebateModeProps {
  isOpen: boolean;
  onClose: () => void;
  ramo: string;
  jurisdiccion: string;
}

export function OralDebateMode({ isOpen, onClose, ramo, jurisdiccion }: OralDebateModeProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [topic, setTopic] = useState('');
  const [started, setStarted] = useState(false);
  const [error, setError] = useState('');

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'es-CL';
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          handleUserSpeech(text);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setError('Error en el reconocimiento de voz. Intenta de nuevo.');
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      // Initialize Speech Synthesis
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
      }
    }

    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [isListening]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
      return;
    }

    setError('');
    setTranscript('');
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) {
      setError('Tu navegador no soporta síntesis de voz.');
      return;
    }

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const handleUserSpeech = async (text: string) => {
    const newMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/debate/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          topic,
          ramo,
          jurisdiccion,
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const data = await response.json();
      const assistantMessage = { role: 'assistant' as const, content: data.response };
      setMessages([...newMessages, assistantMessage]);

      // Speak the response
      speak(data.response);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al obtener respuesta. Intenta de nuevo.');
    }
  };

  const startDebate = () => {
    if (!topic.trim()) {
      alert('Por favor ingresa un tema de debate');
      return;
    }

    setStarted(true);
    const intro = `Bienvenido al debate oral sobre ${topic}. Expón tu posición cuando estés listo. Presiona el botón del micrófono para hablar.`;
    setMessages([{ role: 'assistant', content: intro }]);
    speak(intro);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MicIcon className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Modo Debate Oral</h2>
              </div>
              <p className="text-orange-100 text-sm">Argumenta en voz alta y recibe respuestas habladas</p>
            </div>
            <button
              onClick={() => {
                stopListening();
                stopSpeaking();
                onClose();
              }}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!started ? (
            /* Setup */
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tema de debate
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ej: Legítima defensa, Responsabilidad extracontractual..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">¿Cómo funciona?</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Habla con el micrófono para exponer tu argumento</li>
                  <li>• La IA responderá con contraargumentos y preguntas</li>
                  <li>• Escucha las respuestas en voz alta</li>
                  <li>• Desarrolla tus habilidades de argumentación oral</li>
                  <li>• Requiere Chrome o Edge para funcionar correctamente</li>
                </ul>
              </div>

              <button
                onClick={startDebate}
                disabled={!topic.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                Comenzar Debate
              </button>
            </div>
          ) : (
            /* Debate Interface */
            <div className="space-y-6">
              {/* Messages */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-h-96 overflow-y-auto space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-orange-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-900'
                      }`}
                    >
                      <div className="text-sm">{msg.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Transcript */}
              {transcript && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-700 font-medium mb-1">Escuchando:</div>
                  <div className="text-gray-900">{transcript}</div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isSpeaking}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl ${
                    isListening
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                      : isSpeaking
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  <MicIcon className="w-12 h-12 text-white" />
                </button>

                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {isListening
                      ? '🎤 Escuchando...'
                      : isSpeaking
                      ? '🔊 TutorLaw está hablando...'
                      : 'Presiona para hablar'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {isSpeaking && (
                      <button
                        onClick={stopSpeaking}
                        className="text-red-600 hover:underline"
                      >
                        Detener voz
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">
                  💡 Espera a que termine de hablar antes de responder
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
