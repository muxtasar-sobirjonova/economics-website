import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 26;
  const track = "BEHAVIORAL_ECONOMICS";
  console.log(`Starting update for Day \${dayOrder} (\${track})...`);

  // UPDATE LESSON
  const lesson = await prisma.lesson.findUnique({
    where: {
      track_dayOrder: {
        track: track,
        dayOrder: dayOrder
      }
    }
  });

  if (lesson) {
    const updatedLesson = await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: 'Why Default Choices Change Our Behavior',
        conceptText: `In 2012, Britain ran an experiment on itself. It changed one box on a form from unchecked to checked, and pension saving among working people rose more in five years than decades of tax breaks, financial literacy campaigns, and stern advice from parents had ever managed to achieve.

The box was the default. Left alone, most people simply do whatever requires the least effort, not whatever serves them best — economists call this status quo bias. It isn't stupidity; it's a reasonable shortcut for a species that cannot re-examine every decision from scratch every day. But shortcuts have consequences. If joining a pension scheme requires paperwork, and skipping it requires nothing, most people will skip it — not because they've decided saving is a bad idea, but because they never decided anything at all.

*Nobody chose. That was the point.*

Richard Thaler and Cass Sunstein named this design trick "the nudge": build the default so that doing nothing produces the outcome you'd want people to choose anyway, while still leaving the exit door unlocked for anyone who disagrees. The power isn't in removing freedom. It's in recognizing that freedom, in practice, is mostly spent on the first option in front of you. The article ahead follows that single checked box across an entire country's paychecks.`,
        conceptSummary: `Most people, most of the time, keep whatever option requires no action — economists call this status quo bias. A default is powerful because it turns inaction into an outcome. Richard Thaler and Cass Sunstein's "nudge" idea uses this deliberately: design the default to match what people would likely choose anyway, while still leaving a clear way to opt out.`,
        conceptTakeaways: [
          "Status quo bias means people overwhelmingly stick with whatever requires no action, regardless of whether it's the best option available to them.",
          "A default doesn't remove choice — it just decides what happens to everyone who never actively chooses anything, while leaving an exit door open."
        ],
        articleTitle: 'The Checkbox That Out-Earned a Thousand Advertisements',
        articleText: `Before October 2012, fewer than half of Britain's private-sector employees were saving into a workplace pension, and only 17% held a defined contribution scheme — the modern kind employees and employers both pay into over a working life. Governments had tried the obvious levers for decades: tax relief on contributions, matching incentives, endless public information campaigns explaining compound interest. None of it moved the needle much. People agreed, in surveys, that saving for retirement mattered. Then they went back to not doing it.

The UK's Behavioural Insights Team, a small unit inside the Cabinet Office nicknamed the "Nudge Unit" and shaped directly by Thaler and Sunstein's work, proposed something almost embarrassingly modest: stop asking people to opt in to a pension. Automatically enrol them instead, and let anyone who truly didn't want to save do the paperwork to leave.

Starting with the largest employers in October 2012 and phasing down to the smallest by 2018, every eligible worker aged 22 to State Pension age, earning above roughly £10,000 a year, was placed into a workplace pension the moment they took a job — no form, no decision, no meeting with an advisor. A new low-cost scheme called NEST was built to receive anyone whose employer didn't already offer a plan. Minimum contributions started small and climbed on a schedule, reaching a combined 8% of qualifying earnings — split between employee, employer, and a small government top-up — by 2019.

*Nobody chose. That was the point.*

The results embarrassed almost every earlier assumption about British saving habits. Economists inside government had modeled a pessimistic scenario in which half of newly enrolled workers would opt straight back out. The actual opt-out rate settled at around 10% — roughly one in ten. Private-sector pension participation climbed from 42% in 2011 to 86% by 2022. Among defined contribution savers specifically, participation nearly tripled, from 17% in 2012 to 43% in 2017. The starkest shift showed up among young workers aged 22 to 29, the group least likely to think about retirement at all: their participation rate rose from just 16% to 63% in the same five years.

The reform wasn't a flawless miracle, and a careful economist wouldn't pretend otherwise. Later research found that the small minority who do opt out skew toward lower earners, for the plain reason that even a modest pension contribution bites harder into a tight monthly budget. A default built for the median worker doesn't automatically fit the worker with the least room to spare, and policymakers have kept adjusting contribution schedules and earnings thresholds precisely because of this gap. A well-designed default expands the group that benefits; it doesn't erase every reason a rational person might still choose differently.

Jeff Bezos built an empire on a strikingly similar insight, aimed the opposite direction. Amazon's 1-Click ordering, patented in 1999, didn't improve the product being sold or the price being charged. It simply removed every remaining decision point between "I want this" and "I own this" — no cart to review, no shipping form to re-enter. Where Britain's pension reform made saving the path of least resistance, Amazon made spending the path of least resistance. Same lever. Opposite direction. Both moved billions.

None of this means people are gullible, or that defaults are a trick played on the unwitting. It means most decisions are never really decisions — they're inherited from whatever was already selected before the person showed up to choose. Change what's already selected, and you've changed the outcome for millions of people who never noticed they'd been asked a question at all.`,
        articleSummary: `When Britain automatically enrolled workers into pensions in 2012 instead of asking them to opt in, participation jumped from 42% to 86% within a decade, and opt-outs stayed near 10% instead of the 50% economists feared. Amazon's 1-Click ordering used the identical lever toward spending instead of saving — proof that removing a decision point shapes behavior more than persuasion ever does.`,
        articleTakeaways: [
          "The UK's 2012 pension auto-enrolment, shaped by Thaler and Sunstein's 'nudge' thinking, lifted private-sector pension participation from 42% (2011) to 86% (2022).",
          "The feared mass opt-out never happened — actual opt-out rates settled around 10%, far below the 50% some economists had modeled in advance.",
          "The same design lever works in either direction: Amazon's 1-Click ordering removed friction from spending the same way UK auto-enrolment removed friction from saving."
        ],
      }
    });
    console.log(`Successfully updated Lesson text for Day \${dayOrder}: \${updatedLesson.title}`);
  } else {
    console.log(`Lesson for Day \${dayOrder} not found!`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
