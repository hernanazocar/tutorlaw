'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export default function SettingsPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [universidad, setUniversidad] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setNombre(data.nombre || '');
        setEmail(data.email || '');
        setUniversidad(data.universidad || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, universidad }),
      });

      if (res.ok) {
        setMessage('Perfil actualizado correctamente');
      } else {
        setMessage('Error al actualizar perfil');
      }
    } catch (error) {
      setMessage('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-[#e9ecef]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Logo size="md" showText={true} />
          <Link
            href="/app/chat"
            className="text-sm text-[#0066ff] hover:underline font-medium"
          >
            ← Volver al chat
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-[#e9ecef] shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-[#212529] mb-6">Configuración</h1>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-[#212529] mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#e9ecef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-[#212529] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-[#e9ecef] border border-[#e9ecef] rounded-xl text-[#6c757d] cursor-not-allowed"
              />
              <p className="text-xs text-[#6c757d] mt-1">
                El email no se puede modificar
              </p>
            </div>

            {/* Universidad */}
            <div>
              <label className="block text-sm font-medium text-[#212529] mb-2">
                Universidad
              </label>
              <input
                type="text"
                value={universidad}
                onChange={(e) => setUniversidad(e.target.value)}
                className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#e9ecef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
              />
            </div>

            {/* Plan Info */}
            <div className="bg-[#f8f9fa] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#212529]">Plan Free</div>
                  <div className="text-xs text-[#6c757d] mt-1">5 preguntas gratis al mes</div>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#0066ff] text-white rounded-lg text-sm font-semibold hover:bg-[#0052cc] transition-colors"
                >
                  Upgrade
                </button>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-xl ${
                message.includes('Error')
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-[#0066ff] text-white rounded-xl font-semibold hover:bg-[#0052cc] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>

          {/* Danger Zone */}
          <div className="mt-12 pt-6 border-t border-[#e9ecef]">
            <h2 className="text-lg font-bold text-[#212529] mb-4">Zona de peligro</h2>
            <button
              type="button"
              className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
