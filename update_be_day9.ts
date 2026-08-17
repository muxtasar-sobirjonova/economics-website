import { PrismaClient, Track } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const track = Track.BEHAVIORAL_ECONOMICS;
  const dayOrder = 9;
  const title = "Why We Judge People Too Quickly";

  // Check if Day 9 already exists to avoid duplication, though it shouldn't
  await prisma.lesson.deleteMany({
    where: { track, dayOrder }
  });
  await prisma.quiz.deleteMany({
    where: { track, dayOrder }
  });

  const lessonData = {
    title,
    tag: "ECON",
    timeEstimate: 10,
    dayOrder,
    track: track,
    conceptText: `A tall teenager walks into a gym for the first time. Before he touches a ball, people assume he plays basketball. He fits the picture in their heads of what a basketball player looks like, so their minds fill in the rest. He might have never played in his life.

This is the representativeness heuristic, another shortcut mapped by Daniel Kahneman and Amos Tversky. When we judge how likely something is, we compare it to a mental picture, a stereotype of what that kind of thing usually looks like. The closer the match, the more certain we feel. We ask "does this resemble the type?" instead of "what are the real chances?"

The shortcut feels reasonable and often helps. Patterns in the world are real, and matching to a type is faster than gathering evidence. But it has a dangerous flaw. It ignores base rates, the actual frequencies in the background, and it treats resemblance as proof. A person who looks like a type is judged to be that type, even when the numbers say otherwise.

The danger grows when we hand this shortcut to a machine. A computer trained on past examples will learn the pattern it is shown, including every bias hidden inside it. It will then apply that pattern to new cases with perfect confidence and no awareness that the pattern was flawed. One of the world's most advanced companies learned this the hard way, when it tried to let an algorithm decide who deserved a job.`,
    conceptSummary: `The representativeness heuristic, studied by Kahneman and Tversky, judges how likely something is by how closely it matches a mental stereotype of the type. The closer the resemblance, the more certain we feel. It is fast and often useful, but it ignores real base rates and treats resemblance as proof. Handed to a machine trained on biased data, the shortcut repeats the bias with total confidence.`,
    conceptTakeaways: [
      "The representativeness heuristic judges likelihood by how well something matches a mental stereotype, rather than by real base rates.",
      "Matching new cases to a biased past pattern carries old mistakes forward with confident, unquestioned judgments."
    ],
    articleTitle: "The Representativeness Heuristic",
    articleText: `Around 2014, inside Amazon, a team of engineers set out to build something many companies dreamed of. They wanted software that could read a stack of résumés and pick out the best people to hire automatically, the same way the website picks products to recommend.

**What was the hiring tool supposed to do?**
The team wanted an engine that could rate job seekers from one to five stars, just as shoppers rate products on Amazon. Feed it a hundred résumés, and it would hand back the top five to hire. It was meant to remove slow, expensive human judgment and find the best talent faster than any recruiter ever could. On paper, it looked like the future of hiring.

**How did the software learn what a good candidate looked like?**
It studied the résumés Amazon had received over the previous ten years and learned which ones matched people the company had actually hired. In other words, it built a mental picture of a successful Amazon employee from the past, then searched for new people who resembled that picture. This is the representativeness heuristic, rebuilt in computer code: judge the new by how well it matches the old.

**Why did that approach create a problem?**
Because most of those past résumés came from men, since the technology industry had long been dominated by men. The software learned that the "type" of a strong hire looked male. No one told it to prefer men. It simply matched new candidates against a pattern drawn from the past, and the pattern itself was already tilted. The machine treated a biased history as if it were a fair description of talent.

**How did the bias actually show up?**
By 2015, Amazon saw the tool was not rating candidates in a gender-neutral way for technical jobs. It downgraded résumés that contained the word "women's," as in "women's chess club captain." It marked down graduates of two all-women's colleges. It also favored forceful verbs like "executed" and "captured," which appeared more often on the résumés of male engineers. The bias was quiet, but it was everywhere.

**Could Amazon simply fix the bias?**
They tried. Engineers edited the program to ignore those specific words. But they could not be sure the machine would not find new, hidden ways to sort men above women. The bias was not one rule to delete; it lived inside the whole learned pattern. Around 2017, Amazon lost confidence in the tool and scrapped the project entirely.

**What is the real lesson of Amazon's failed tool?**
That judging by resemblance to a past type quietly carries the past's mistakes forward. The machine did exactly what the representativeness heuristic does inside a human mind: it treated "looks like our old hires" as "will be a good hire." When the old pattern was biased, the confident new judgments were biased too, and not one line of code had told it to discriminate.`,
    articleSummary: `Amazon built a tool to rate job candidates by matching them to its successful hires from the past ten years. Because those hires were mostly men, the software learned to favor men, downgrading résumés with the word "women's" and all-women's colleges. Amazon could not fully remove the bias and scrapped the tool around 2017. Judging by resemblance to a past type carried the past's bias forward.`,
    articleTakeaways: [
      "Amazon's hiring tool learned the \"type\" of a good employee from ten years of mostly male résumés.",
      "The tool downgraded résumés containing the word \"women's\" and graduates of two all-women's colleges, without being told to.",
      "Amazon could not guarantee the bias was gone, because it lived in the whole pattern, and scrapped the project around 2017."
    ]
  };

  await prisma.lesson.create({ data: lessonData });
  console.log("Created Lesson Day 9");

  const quizTitle = "Quiz: " + title;
  await prisma.quiz.create({
    data: {
      title: quizTitle,
      tag: "ECON",
      timeEstimate: 5,
      dayOrder,
      track: track,
      questions: {
        create: [
          {
            questionText: "What is the representativeness heuristic?",
            options: [
              "Judging how likely something is by how well it matches a mental stereotype",
              "Calculating the exact odds of an outcome using detailed background data",
              "Choosing the option that most of the people around you have already chosen",
              "Preferring whatever choice takes the very least effort to reach a decision"
            ],
            correctAnswer: "Judging how likely something is by how well it matches a mental stereotype",
            explanation: "It skips real calculation and matches to a type instead.",
            order: 0
          },
          {
            questionText: "What did Amazon want its hiring tool to do?",
            options: [
              "Replace all of its human recruiters with a single new senior manager",
              "Lower the salaries it paid by hiring only much less experienced people",
              "Read many résumés and automatically rate the strongest candidates",
              "Advertise its open jobs to a far wider group of possible applicants"
            ],
            correctAnswer: "Read many résumés and automatically rate the strongest candidates",
            explanation: "It rated candidates; it was not meant to replace managers wholesale.",
            order: 1
          },
          {
            questionText: "How did the tool learn what a strong candidate looked like?",
            options: [
              "By asking current employees to describe their own ideal future coworker",
              "By studying ten years of past résumés tied to people Amazon had hired",
              "By testing each applicant with a long series of technical skill exams",
              "By copying the exact hiring rules used by other large technology firms"
            ],
            correctAnswer: "By studying ten years of past résumés tied to people Amazon had hired",
            explanation: "It learned from past résumés, not from employee surveys or tests.",
            order: 2
          },
          {
            questionText: "Why did the tool end up biased against women?",
            options: [
              "The engineers who built it deliberately programmed it to prefer men",
              "The tool was tested only on the résumés that had been sent in by men",
              "Women had asked the company not to consider them for technical roles",
              "Most of the past résumés came from men, so the learned pattern favored men"
            ],
            correctAnswer: "Most of the past résumés came from men, so the learned pattern favored men",
            explanation: "No one wrote a rule to prefer men; the bias came from the data.",
            order: 3
          },
          {
            questionText: "How did the bias appear in the tool's judgments?",
            options: [
              "It downgraded résumés with the word \"women's\" and all-women's colleges",
              "It rejected every single résumé that came from anyone with a technical degree",
              "It gave the highest rating to whichever résumé it simply happened to read first",
              "It refused to rate any candidate who had less than ten full years of work"
            ],
            correctAnswer: "It downgraded résumés with the word \"women's\" and all-women's colleges",
            explanation: "It did not reject all technical degrees; it penalized female-linked words.",
            order: 4
          },
          {
            questionText: "Why couldn't Amazon simply fix the bias?",
            options: [
              "The company was legally forbidden from changing the software in any way",
              "The engineers who had built the tool had all left the company by then",
              "The bias lived in the whole pattern, so new hidden forms could appear",
              "Fixing the bias would have made the tool far too slow to be at all useful"
            ],
            correctAnswer: "The bias lived in the whole pattern, so new hidden forms could appear",
            explanation: "The problem was the pattern, not a shortage of engineers or a legal ban.",
            order: 5
          },
          {
            questionText: "What did Amazon finally do with the project?",
            options: [
              "It sold the hiring tool to another large company for a very high price",
              "It lost confidence in the tool and scrapped the project around 2017",
              "It kept on using the tool, but only for hiring non-technical workers",
              "It made the tool public so that anyone at all could download and use it"
            ],
            correctAnswer: "It lost confidence in the tool and scrapped the project around 2017",
            explanation: "Amazon scrapped it; it did not sell it or narrow its use.",
            order: 6
          },
          {
            questionText: "What does the tool show about judging by resemblance to a type?",
            options: [
              "It is always the fastest and the most accurate way to choose between people",
              "It removes human bias completely whenever a machine is the one judging",
              "It works perfectly well as long as the training data set is very large",
              "It can carry the mistakes of the past forward into brand-new decisions"
            ],
            correctAnswer: "It can carry the mistakes of the past forward into brand-new decisions",
            explanation: "It was fast but wrong, and the machine repeated human bias rather than removing it.",
            order: 7
          },
          {
            questionText: "How is the tool's behavior like the representativeness heuristic in a person?",
            options: [
              "It treated \"looks like our past hires\" as \"will be a good hire\"",
              "It counted the true base rates carefully before making any judgment",
              "It ignored all patterns and rated every candidate completely at random",
              "It asked each candidate to prove their real skills before rating them"
            ],
            correctAnswer: "It treated \"looks like our past hires\" as \"will be a good hire\"",
            explanation: "It ignored base rates; that is the flaw, not a strength.",
            order: 8
          },
          {
            questionText: "What is the broader warning from Amazon's experience?",
            options: [
              "Machines should never be used to help with any hiring decision at all, ever",
              "Companies should always hire the same kinds of people they have hired before",
              "A pattern learned from a biased past will produce biased, confident judgments",
              "Human recruiters make far more mistakes than any computer system ever does"
            ],
            correctAnswer: "A pattern learned from a biased past will produce biased, confident judgments",
            explanation: "The tool showed machines can inherit human bias, not beat it cleanly.",
            order: 9
          }
        ]
      }
    }
  });

  console.log("Created Quiz for Day 9.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
