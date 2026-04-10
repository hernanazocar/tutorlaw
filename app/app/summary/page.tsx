'use client';

import { DailySummary } from '@/components/summary/DailySummary';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export default function SummaryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" showText={true} />
          </div>
          <Link
            href="/app/chat"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors"
          >
            Volver al Chat
          </Link>
        </div>
      </div>

      {/* Summary */}
      <DailySummary />
    </div>
  );
}
