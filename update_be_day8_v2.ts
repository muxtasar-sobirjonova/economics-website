import { PrismaClient, Track } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const track = Track.BEHAVIORAL_ECONOMICS;
  const dayOrder = 8;
  const title = "Why One Story Can Change What We Fear";

  console.log("Updating Day 8 for Behavioral Economics...");
  
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
    conceptText: `Ask most people whether flying or driving is more dangerous, and many will say flying. The images come quickly: a crash on the news, a headline, a story everyone remembers. Ask about ordinary car accidents, and far fewer people feel afraid, even though cars kill vastly more people every year.

This is the availability heuristic, a mental shortcut studied by Daniel Kahneman and Amos Tversky. When we judge how likely or common something is, we do not count real frequencies. We check how easily examples come to mind. If an event is easy to recall — vivid, recent, or widely reported — we treat it as more common than it truly is. If examples are hard to summon, we assume the event is rare.

The shortcut usually works. Easily recalled events often are common, so the mind saves effort by trusting memory instead of statistics. But it breaks whenever memory and reality pull apart. A single dramatic disaster, shown on every screen, becomes far more available than thousands of quiet, ordinary deaths that never make the news.

That gap has real consequences. When a rare but vivid danger feels large, people act to avoid it, and sometimes that action exposes them to a far greater everyday risk they never think about. The most striking proof came after one terrible morning in 2001, when the fear of a rare event pushed thousands of people toward a danger that turned out to be much worse.`,
    conceptSummary: `The availability heuristic is a mental shortcut studied by Kahneman and Tversky. To judge how likely something is, we check how easily examples come to mind rather than counting real frequencies. Vivid, recent, or widely reported events feel common; hard-to-recall events feel rare. The shortcut usually works, but it fails when a single dramatic story makes a rare danger feel far larger than it is.`,
    conceptTakeaways: [
      "The availability heuristic judges how likely an event is by how easily examples come to mind, not by real frequencies.",
      "Vivid, recent, or widely reported events feel more common than they are; quiet, ordinary events feel rarer than they are."
    ],
    articleTitle: "The Availability Heuristic",
    articleText: `Here is a fact that sounds impossible. In the year after the September 11 attacks, more Americans likely died on the roads because they were afraid to fly than the total number of passengers killed on the four hijacked planes.

**Why did so many Americans stop flying after September 11, 2001?**
The attacks killed nearly 3,000 people and were shown on television for weeks. The images were vivid, repeated, and impossible to forget. Flying suddenly felt terrifying. Even though air travel remained one of the safest ways to move, the fear was immediate and strong, because examples of the danger were now extremely easy to bring to mind. This is the availability heuristic taking hold of a whole nation at once.

**If people stopped flying, how did that put them in danger?**
They did not stop traveling. They drove instead. And driving, mile for mile, is far more dangerous than flying. Every person who swapped a long flight for a long drive traded a very small risk for a much larger one. The highways filled with people who felt safer inside a car, even though the car was the greater threat. The feeling of safety and the actual safety pointed in opposite directions.

**How do we know this actually cost lives?**
The psychologist Gerd Gigerenzer studied United States transport data. He estimated that in the three months after the attacks, about 353 more people died on American roads than would normally be expected — more than the number of passengers on the four planes combined. Over the full twelve months after September 11, his estimate for the extra road deaths rose to around 1,600.

**What does this reveal about how people judge risk?**
It reveals the availability heuristic working on a national scale. People did not compare the real numbers for flying and driving. They reacted to what was easy to recall. The plane attacks were unforgettable; ordinary car crashes were not. So the rare, vivid danger felt enormous, and the common, quiet danger felt small. Their sense of risk was almost exactly backwards.

**Did every country react the same way?**
No, and the difference is telling. Gigerenzer's team noted that after the 2004 train bombings in Madrid, Spaniards did not switch from trains to cars in the same way. The dread that gripped American travelers did not automatically follow every attack. The availability heuristic shapes behavior everywhere, but culture and habit help decide how strongly it takes hold in each place.

**What is the lasting lesson of the post-9/11 roads?**
That a single powerful story can distort an entire nation's sense of danger. The fear was real and deeply human, but it was aimed at the wrong risk. Understanding the availability heuristic does not remove fear. It gives us one useful question to ask in a frightening moment: am I judging this danger by the numbers, or only by how easily a terrifying picture comes to mind?`,
    articleSummary: `After September 11, vivid images made flying feel terrifying, so many Americans drove instead. But driving is far more dangerous than flying. Gerd Gigerenzer estimated that about 353 extra people died on U.S. roads in three months, and around 1,600 over the year, from this switch. A single powerful story pushed a nation toward the greater risk it had been ignoring.`,
    articleTakeaways: [
      "After 9/11, many Americans avoided flying and drove instead, even though driving is far more dangerous mile for mile.",
      "Gerd Gigerenzer estimated the switch caused about 353 extra U.S. road deaths in three months and roughly 1,600 over the following year.",
      "A single dramatic story can distort a whole population's sense of risk, aiming fear at the wrong danger."
    ]
  };

  await prisma.lesson.create({ data: lessonData });
  console.log("Created Lesson Day 8");

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
            questionText: "What is the availability heuristic?",
            options: [
              "A rule that people use to calculate the exact odds of any risky event",
              "A shortcut that judges likelihood by how easily examples come to mind",
              "A method for comparing two dangers by studying official safety data",
              "A habit of always choosing the option that feels the most comfortable"
            ],
            correctAnswer: "A shortcut that judges likelihood by how easily examples come to mind",
            explanation: "It skips real calculation and relies on ease of memory instead.",
            order: 0
          },
          {
            questionText: "Why did flying feel so dangerous to many people after 9/11?",
            options: [
              "Airlines had raised their ticket prices far beyond what people could pay",
              "The government had published new data showing that flights were unsafe",
              "Vivid, repeated images made examples of the danger very easy to recall",
              "Most airports across the country had closed down for many months"
            ],
            correctAnswer: "Vivid, repeated images made examples of the danger very easy to recall",
            explanation: "Price was not why fear rose; ease of recall was.",
            order: 1
          },
          {
            questionText: "Why was switching from flying to driving a dangerous trade?",
            options: [
              "Driving is far more dangerous than flying for the same distance traveled",
              "Driving was banned on major highways for months after the attacks",
              "Driving cost far more money than flying for the same long trip",
              "Driving routes were much longer than the flight paths they replaced"
            ],
            correctAnswer: "Driving is far more dangerous than flying for the same distance traveled",
            explanation: "The issue was the higher risk of driving, not route length or cost.",
            order: 2
          },
          {
            questionText: "What did Gerd Gigerenzer's study of transport data estimate?",
            options: [
              "That flying became more dangerous than driving in the year after 9/11",
              "That fewer people died overall because so many of them stopped traveling",
              "That the number of road deaths stayed exactly the same as a normal year",
              "That extra road deaths followed the switch from flying to driving"
            ],
            correctAnswer: "That extra road deaths followed the switch from flying to driving",
            explanation: "His estimate found an increase, not an unchanged total. Flying stayed safer; driving was the greater risk.",
            order: 3
          },
          {
            questionText: "How does the availability heuristic explain the post-9/11 behavior?",
            options: [
              "People carefully compared the real risk of flying with the risk of driving",
              "People judged the danger by how easily a frightening image came to mind",
              "People trusted official statistics far more than their own strong feelings",
              "People chose the cheapest way to travel without thinking about safety"
            ],
            correctAnswer: "People judged the danger by how easily a frightening image came to mind",
            explanation: "They did not compare the real risks; that is the whole point. The driver of behavior was fear and memory, not price.",
            order: 4
          },
          {
            questionText: "Why does the Madrid train bombing comparison matter?",
            options: [
              "It proved that Spaniards feared trains more than Americans feared planes",
              "It showed that no country ever changes its travel habits after an attack",
              "It showed the same fear did not automatically follow every terror attack",
              "It proved that trains are always safer than both cars and airplanes"
            ],
            correctAnswer: "It showed the same fear did not automatically follow every terror attack",
            explanation: "Spaniards did not switch away from trains in the same way. Behavior can change; it simply did not change the same way here.",
            order: 5
          },
          {
            questionText: "Why does the availability heuristic usually work well?",
            options: [
              "Events that are easy to recall often really are common in daily life",
              "People always double-check their memory against official records first",
              "Rare events are never shown on the news, so they stay forgotten by all",
              "The mind counts exact frequencies before it makes any judgment at all"
            ],
            correctAnswer: "Events that are easy to recall often really are common in daily life",
            explanation: "The shortcut skips checking records; it trusts memory.",
            order: 6
          },
          {
            questionText: "When does the availability heuristic lead people astray?",
            options: [
              "When an event is boring and almost no one can remember it happening",
              "When people have access to clear and complete statistics about a risk",
              "When two dangers are equally common and also equally easy to recall",
              "When a rare danger is vivid and a common danger is quiet and forgettable"
            ],
            correctAnswer: "When a rare danger is vivid and a common danger is quiet and forgettable",
            explanation: "The trap needs a mismatch between memory and reality, not a match.",
            order: 7
          },
          {
            questionText: "What does the lesson say understanding this heuristic can do?",
            options: [
              "It removes fear completely so that people never feel afraid again at all",
              "It helps people pause and ask whether they are judging danger by numbers",
              "It guarantees that people will always end up picking the safest option",
              "It makes vivid news stories stop appearing on television and on screens"
            ],
            correctAnswer: "It helps people pause and ask whether they are judging danger by numbers",
            explanation: "It offers a way to check judgment, not a guarantee of safety.",
            order: 8
          },
          {
            questionText: "Which situation best shows the availability heuristic in action?",
            options: [
              "Fearing a shark attack after a news story while ignoring safer daily risks",
              "Reading crash statistics carefully before deciding how to take a long trip",
              "Choosing a train over a plane purely because the train ticket is cheaper",
              "Buying insurance after an expert clearly explains the odds of a rare event"
            ],
            correctAnswer: "Fearing a shark attack after a news story while ignoring safer daily risks",
            explanation: "Careful use of statistics is the opposite of this shortcut.",
            order: 9
          }
        ]
      }
    }
  });

  console.log("Created Quiz for Day 8.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
