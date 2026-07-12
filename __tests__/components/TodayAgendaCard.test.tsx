import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TodayAgendaCard from '@/components/TodayAgendaCard';

// Mock the next/link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock framer-motion to avoid animation issues in jsdom
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('TodayAgendaCard', () => {
  it('renders correctly with lessons', () => {
    const mockItems: any[] = [
      {
        id: '1',
        itemId: 1,
        itemType: 'LESSON',
        title: 'Introduction to Microeconomics',
        description: 'Learn the basics',
        type: 'lesson' as const,
        completed: false,
        isCompleted: false,
        timeEstimate: 10,
        tag: 'LESSON',
        href: '/lessons/1',
      },
    ];

    render(<TodayAgendaCard initialItems={mockItems} />);
    
    expect(screen.getByText('Today\'s Agenda')).toBeDefined();
    expect(screen.getByText('Introduction to Microeconomics')).toBeDefined();
    expect(screen.getByText('Introduction to Microeconomics')).toBeDefined();
  });

  it('renders completed state', () => {
    render(<TodayAgendaCard initialItems={[]} />);
    
    expect(screen.getByText(/All caught up!/i)).toBeDefined();
    expect(screen.getByText(/You've finished your agenda for today./i)).toBeDefined();
  });
});
