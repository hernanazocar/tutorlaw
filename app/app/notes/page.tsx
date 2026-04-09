'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import type { Note } from '@/lib/types';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const createNewNote = () => {
    setSelectedNote(null);
    setIsEditing(true);
    setTitle('');
    setContent('');
    setTags([]);
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
  };

  const saveNote = async () => {
    try {
      if (selectedNote) {
        // Update existing note
        const res = await fetch('/api/notes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedNote.id, title, content, tags }),
        });

        if (res.ok) {
          const updated = await res.json();
          setNotes(notes.map(n => n.id === updated.id ? updated : n));
          setSelectedNote(updated);
          setIsEditing(false);
        }
      } else {
        // Create new note
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, tags }),
        });

        if (res.ok) {
          const newNote = await res.json();
          setNotes([newNote, ...notes]);
          setSelectedNote(newNote);
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este apunte?')) return;

    try {
      const res = await fetch('/api/notes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setNotes(notes.filter(n => n.id !== id));
        if (selectedNote?.id === id) {
          setSelectedNote(null);
        }
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      {/* Sidebar - Lista de apuntes */}
      <div className="w-80 bg-white border-r border-[#e9ecef] flex flex-col">
        <div className="p-6 border-b border-[#e9ecef]">
          <Logo size="md" showText={true} />
          <p className="text-xs text-[#6c757d] mt-2">Mis apuntes</p>
        </div>

        <div className="p-4 border-b border-[#e9ecef]">
          <button
            onClick={createNewNote}
            className="w-full px-4 py-3 bg-[#0066ff] text-white rounded-xl font-semibold hover:bg-[#0052cc] transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Nuevo apunte
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {notes.length === 0 ? (
            <p className="text-sm text-[#6c757d] text-center mt-8">
              No tienes apuntes aún
            </p>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedNote?.id === note.id
                      ? 'bg-[#e6f0ff] border border-[#0066ff]'
                      : 'bg-[#f8f9fa] hover:bg-[#e9ecef]'
                  }`}
                  onClick={() => selectNote(note)}
                >
                  <div className="font-semibold text-sm text-[#212529] mb-1">
                    {note.title || 'Sin título'}
                  </div>
                  <div className="text-xs text-[#6c757d]">
                    {new Date(note.updated_at).toLocaleDateString('es-ES')}
                  </div>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-[#e6f0ff] text-[#0066ff] text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#e9ecef]">
          <Link
            href="/app/chat"
            className="block text-center text-sm text-[#0066ff] hover:underline"
          >
            ← Volver al chat
          </Link>
        </div>
      </div>

      {/* Main - Editor de apunte */}
      <div className="flex-1 flex flex-col">
        {selectedNote || isEditing ? (
          <>
            <div className="bg-white border-b border-[#e9ecef] p-6 flex items-center justify-between">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del apunte..."
                disabled={!isEditing}
                className="flex-1 text-2xl font-bold text-[#212529] bg-transparent border-none focus:outline-none disabled:cursor-default"
              />
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        if (selectedNote) {
                          setTitle(selectedNote.title);
                          setContent(selectedNote.content);
                          setTags(selectedNote.tags || []);
                        }
                      }}
                      className="px-4 py-2 text-[#6c757d] hover:text-[#212529] transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={saveNote}
                      className="px-6 py-2 bg-[#0066ff] text-white rounded-lg font-semibold hover:bg-[#0052cc] transition-colors"
                    >
                      Guardar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-[#0066ff] hover:bg-[#e6f0ff] rounded-lg transition-colors"
                    >
                      Editar
                    </button>
                    {selectedNote && (
                      <button
                        onClick={() => deleteNote(selectedNote.id)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe tus apuntes aquí..."
                  disabled={!isEditing}
                  className="w-full h-[calc(100vh-200px)] p-6 bg-white border border-[#e9ecef] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#0066ff] disabled:bg-[#f8f9fa] disabled:cursor-default"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-[#e9ecef]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2v6h6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2 className="text-xl font-bold text-[#212529] mb-2">
                Selecciona un apunte o crea uno nuevo
              </h2>
              <p className="text-[#6c757d]">
                Tus apuntes se guardan automáticamente
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
