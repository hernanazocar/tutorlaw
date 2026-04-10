'use client';

import { useState } from 'react';
import { MessageIcon, CheckCircleIcon } from '@/components/ui/Icons';

export function WhatsAppSetup() {
  const [step, setStep] = useState(1);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bot de WhatsApp</h1>
        <p className="text-gray-600">Estudia directamente desde WhatsApp con TutorLaw</p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-bold text-green-900 mb-2">Pregunta por WhatsApp</h3>
          <p className="text-sm text-green-700">Envía tus dudas y recibe respuestas al instante</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="font-bold text-blue-900 mb-2">Quick Quiz diario</h3>
          <p className="text-sm text-blue-700">Recibe un desafío diario automáticamente</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="text-3xl mb-3">📚</div>
          <h3 className="font-bold text-purple-900 mb-2">Flashcards por mensaje</h3>
          <p className="text-sm text-purple-700">Genera y estudia flashcards desde tu celular</p>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Configuración</h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > 1 ? <CheckCircleIcon className="w-6 h-6" /> : '1'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Crear cuenta en Twilio</h3>
              <p className="text-sm text-gray-600 mb-3">
                Twilio es la plataforma que conecta WhatsApp con TutorLaw.
              </p>
              <a
                href="https://www.twilio.com/try-twilio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
              >
                Ir a Twilio →
              </a>
              {step === 1 && (
                <button
                  onClick={() => setStep(2)}
                  className="ml-3 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-semibold"
                >
                  Ya tengo cuenta →
                </button>
              )}
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > 2 ? <CheckCircleIcon className="w-6 h-6" /> : '2'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Configurar WhatsApp Sandbox</h3>
              <p className="text-sm text-gray-600 mb-3">
                En tu consola de Twilio, ve a Messaging → Try it out → Send a WhatsApp message
              </p>
              {step >= 2 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                  <p className="text-xs font-mono text-gray-600 mb-2">Envía este mensaje a tu número de Twilio:</p>
                  <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                    join [tu-código-sandbox]
                  </code>
                </div>
              )}
              {step === 2 && (
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-semibold"
                >
                  Listo →
                </button>
              )}
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > 3 ? <CheckCircleIcon className="w-6 h-6" /> : '3'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Configurar Webhook</h3>
              <p className="text-sm text-gray-600 mb-3">
                En Twilio, configura el webhook para que apunte a TutorLaw
              </p>
              {step >= 3 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                  <p className="text-xs text-gray-600 mb-2">URL del webhook:</p>
                  <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm break-all">
                    https://tutorlaw.com/api/whatsapp/webhook
                  </code>
                  <p className="text-xs text-gray-500 mt-2">
                    Método: POST
                  </p>
                </div>
              )}
              {step === 3 && (
                <button
                  onClick={() => setStep(4)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-semibold"
                >
                  Configurado →
                </button>
              )}
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 4 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              4
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">¡Listo para usar!</h3>
              <p className="text-sm text-gray-600 mb-3">
                Ahora puedes enviar mensajes a tu número de WhatsApp de Twilio y TutorLaw responderá automáticamente.
              </p>
              {step >= 4 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Comandos disponibles:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li><code className="bg-green-100 px-2 py-1 rounded">/ayuda</code> - Ver comandos disponibles</li>
                    <li><code className="bg-green-100 px-2 py-1 rounded">/quiz</code> - Recibir un quiz rápido</li>
                    <li><code className="bg-green-100 px-2 py-1 rounded">/flashcards [tema]</code> - Generar flashcards</li>
                    <li><code className="bg-green-100 px-2 py-1 rounded">/estadisticas</code> - Ver tu progreso</li>
                    <li>O simplemente escribe tu pregunta legal</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-2">💡 Información importante</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• La cuenta gratuita de Twilio tiene limitaciones. Para uso intensivo, considera un plan de pago.</li>
          <li>• El sandbox de WhatsApp solo funciona con números que hayan enviado el mensaje "join".</li>
          <li>• Para producción, necesitas solicitar aprobación de WhatsApp Business API.</li>
          <li>• Tus conversaciones de WhatsApp se sincronizan con tu cuenta de TutorLaw.</li>
        </ul>
      </div>
    </div>
  );
}
