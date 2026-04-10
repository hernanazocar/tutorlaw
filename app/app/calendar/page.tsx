'use client';

import { StudyCalendar } from '@/components/calendar/StudyCalendar';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Logo size="sm" showText={true} />
          </div>
          <Link
            href="/app/chat"
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">Volver al Chat</span>
            <span className="sm:hidden">Chat</span>
          </Link>
        </div>
      </div>

      {/* Calendar */}
      <StudyCalendar />
    </div>
  );
}
