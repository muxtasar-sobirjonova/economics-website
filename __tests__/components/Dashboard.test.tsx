import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dashboard, type AgendaItem } from "@/components/home/Dashboard";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const item = (over: Partial<AgendaItem> = {}): AgendaItem => ({
  id: "1",
  itemType: "LESSON",
  itemId: "1-concept",
  title: "Can Money Measure a Good Life?",
  tag: "CONCEPT",
  timeEstimate: 10,
  isCompleted: false,
  url: "/lessons/1/concepts",
  ...over,
});

describe("Dashboard", () => {
  it("lists today's tasks with their kind and the time they take", () => {
    render(<Dashboard userName="Muxtasar" items={[item()]} completedDates={[]} />);

    expect(screen.getByText("Can Money Measure a Good Life?")).toBeDefined();
    expect(screen.getByText("CONCEPT")).toBeDefined();
    expect(screen.getByText("5–10 min")).toBeDefined();
  });

  it("counts what is done against what there is", () => {
    render(
      <Dashboard
        userName="Muxtasar"
        completedDates={[]}
        items={[item({ id: "a", isCompleted: true }), item({ id: "b" })]}
      />
    );
    expect(screen.getByText("1 of 2 done")).toBeDefined();
  });

  it("says so when the day is finished, and stops asking for more", () => {
    render(
      <Dashboard userName="Muxtasar" completedDates={[]} items={[item({ isCompleted: true })]} />
    );

    expect(screen.getByText(/done for today/i)).toBeDefined();
    expect(screen.getByText("Completed")).toBeDefined();
    // The nudge to study is for a day with something left in it.
    expect(screen.queryByText(/build your streak/i)).toBeNull();
  });

  it("survives a day with nothing scheduled", () => {
    render(<Dashboard userName="Muxtasar" items={[]} completedDates={[]} />);
    expect(screen.getByText(/Nothing scheduled for today/i)).toBeDefined();
  });

  it("points Continue learning at the next unfinished task", () => {
    render(
      <Dashboard
        userName="Muxtasar"
        completedDates={[]}
        items={[
          item({ id: "a", isCompleted: true, url: "/lessons/1/concepts" }),
          item({ id: "b", url: "/lessons/1/quizzes" }),
        ]}
      />
    );

    const link = screen.getByText("Continue learning").closest("a");
    expect(link?.getAttribute("href")).toBe("/lessons/1/quizzes");
  });
});
