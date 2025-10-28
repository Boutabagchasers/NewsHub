'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';

/**
 * Props for PreferenceSection component
 */
interface PreferenceSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isSaved?: boolean;
  className?: string;
}

/**
 * PreferenceSection Component
 *
 * Reusable section container for settings/preferences pages.
 * Provides consistent styling and layout for preference sections with:
 * - Section header with optional icon
 * - Description text
 * - Form controls area
 * - Save indicator
 */
export default function PreferenceSection({
  title,
  description,
  icon,
  children,
  isSaved = false,
  className = '',
}: PreferenceSectionProps) {
  return (
    <div className={`bg-background-elevated rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              {icon && <div className="text-blue-600">{icon}</div>}
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
          </div>

          {/* Save Indicator */}
          {isSaved && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircle size={18} />
              <span>Saved</span>
            </div>
          )}
        </div>
      </div>

      {/* Section Content */}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
