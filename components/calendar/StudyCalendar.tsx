'use client';

import { useState, useEffect } from 'react';
import { ClockIcon, TargetIcon, CheckCircleIcon } from '@/components/ui/Icons';

type StudyEvent = {
  id: string;
  title: string;
  ramo: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: 'study' | 'exam' | 'review';
  completed: boolean;
};

export function StudyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<StudyEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newEvent, setNewEvent] = useState<Partial<StudyEvent>>({
    type: 'study',
    duration: 60,
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const saved = JSON.parse(localStorage.getItem('studyEvents') || '[]');
    setEvents(saved);
  };

  const saveEvents = (updatedEvents: StudyEvent[]) => {
    localStorage.setItem('studyEvents', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date: string) => {
    return events.filter(e => e.date === date);
  };

  const addEvent = () => {
    if (!newEvent.title || !selectedDate || !newEvent.time) {
      alert('Por favor completa todos los campos');
      return;
    }

    const event: StudyEvent = {
      id: Date.now().toString(),
      title: newEvent.title!,
      ramo: newEvent.ramo || 'General',
      date: selectedDate,
      time: newEvent.time!,
      duration: newEvent.duration || 60,
      type: newEvent.type || 'study',
      completed: false,
    };

    saveEvents([...events, event]);
    setShowAddModal(false);
    setNewEvent({ type: 'study', duration: 60 });
    setSelectedDate('');
  };

  const toggleEventComplete = (eventId: string) => {
    const updated = events.map(e =>
      e.id === eventId ? { ...e, completed: !e.completed } : e
    );
    saveEvents(updated);
  };

  const deleteEvent = (eventId: string) => {
    const updated = events.filter(e => e.id !== eventId);
    saveEvents(updated);
  };

  const generateSmartSchedule = () => {
    // Get user's assessment levels
    const levels = JSON.parse(localStorage.getItem('ramoLevels') || '{}');
    const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');

    // Determine weak areas
    const weakRamos = assessments
      .filter((a: any) => a.porcentaje < 70)
      .map((a: any) => a.ramo);

    // Generate events for next 2 weeks
    const newEvents: StudyEvent[] = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      // Don't schedule on existing days with events
      if (getEventsForDate(dateStr).length > 0) continue;

      // Alternate between weak and general review
      const isWeakDay = i % 2 === 0;
      const ramo = isWeakDay && weakRamos.length > 0
        ? weakRamos[Math.floor(Math.random() * weakRamos.length)]
        : 'Repaso General';

      newEvents.push({
        id: `auto-${Date.now()}-${i}`,
        title: isWeakDay ? `Reforzar: ${ramo}` : 'Repaso de conceptos',
        ramo,
        date: dateStr,
        time: '18:00',
        duration: 90,
        type: 'study',
        completed: false,
      });
    }

    if (newEvents.length > 0) {
      saveEvents([...events, ...newEvents]);
      alert(`Se generaron ${newEvents.length} sesiones de estudio inteligentes`);
    } else {
      alert('Ya tienes eventos programados para los próximos días');
    }
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Calendario de Estudio</h1>
          <button
            onClick={generateSmartSchedule}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold text-sm transition-all shadow-md"
          >
            🤖 Generar Calendario Inteligente
          </button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-900 capitalize">{monthName}</h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Days of week */}
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days of month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = getEventsForDate(dateStr);
            const isToday = dateStr === today;

            return (
              <button
                key={day}
                onClick={() => {
                  setSelectedDate(dateStr);
                  setShowAddModal(true);
                }}
                className={`aspect-square border rounded-lg p-2 hover:bg-gray-50 transition-all ${
                  isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="text-sm font-semibold text-gray-900">{day}</div>
                {dayEvents.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs px-1 py-0.5 rounded truncate ${
                          event.type === 'exam'
                            ? 'bg-red-100 text-red-700'
                            : event.type === 'review'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        } ${event.completed ? 'line-through opacity-50' : ''}`}
                      >
                        {event.time.slice(0, 5)}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayEvents.length - 2}</div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Próximos Eventos</h2>
        {events
          .filter(e => e.date >= today)
          .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
          .slice(0, 10)
          .map(event => (
            <div
              key={event.id}
              className={`flex items-center justify-between p-4 mb-2 rounded-lg border ${
                event.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => toggleEventComplete(event.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    event.completed
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {event.completed && (
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  )}
                </button>

                <div className="flex-1">
                  <div className={`font-semibold ${event.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {event.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })} • {event.time} • {event.duration} min • {event.ramo}
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    event.type === 'exam'
                      ? 'bg-red-100 text-red-700'
                      : event.type === 'review'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {event.type === 'exam' ? 'Examen' : event.type === 'review' ? 'Repaso' : 'Estudio'}
                </span>
              </div>

              <button
                onClick={() => deleteEvent(event.id)}
                className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}

        {events.filter(e => e.date >= today).length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No hay eventos programados. Usa el botón "Generar Calendario Inteligente" o agrega eventos manualmente.
          </p>
        )}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Agregar Evento - {new Date(selectedDate).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
              })}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={newEvent.title || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Estudiar Contratos"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ramo</label>
                <input
                  type="text"
                  value={newEvent.ramo || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, ramo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Derecho Civil"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hora</label>
                  <input
                    type="time"
                    value={newEvent.time || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duración (min)</label>
                  <input
                    type="number"
                    value={newEvent.duration || 60}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                <select
                  value={newEvent.type || 'study'}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="study">Estudio</option>
                  <option value="review">Repaso</option>
                  <option value="exam">Examen</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewEvent({ type: 'study', duration: 60 });
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={addEvent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
