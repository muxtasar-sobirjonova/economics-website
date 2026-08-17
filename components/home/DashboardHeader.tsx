import React from 'react';

interface DashboardHeaderProps {
  title: string;
}

/**
 * Simple header displayed at the top of the dashboard page.
 * Uses the custom purple accent colors defined in the design tokens.
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  return (
    <header className="px-s4 md:px-s6 lg:px-s7 py-s4">
      <h1 className="text-3xl font-bold text-[var(--accent-strong)]">
        {title}
      </h1>
    </header>
  );
};
