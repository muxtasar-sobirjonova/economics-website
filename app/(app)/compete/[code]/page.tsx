import { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { CompetitionFormat } from "@prisma/client";
import {
  getCompetition,
  getPlaySession,
  getCompetitionReview,
} from "@/lib/compete/service";
import {
  getProblemSession,
  getProblemReview,
  getMarkingSheet,
  markingProgress,
} from "@/lib/compete/problemService";
import { Lobby } from "@/components/compete/Lobby";
import { CompetitionPlay } from "@/components/compete/CompetitionPlay";
import { ProblemPlay } from "@/components/compete/ProblemPlay";
import { ProblemReview } from "@/components/compete/ProblemReview";
import { MarkingRoom } from "@/components/compete/MarkingRoom";
import { FocusRecord } from "@/components/compete/FocusRecord";
import { focusRecord } from "@/lib/compete/focusService";
import { Standings } from "@/components/compete/Standings";
import { HostControls } from "@/components/compete/HostControls";
import { DuelReviewList } from "@/components/duel/DuelReviewList";

export const metadata: Metadata = { title: "Competition | That's So Econ" };
export const dynamic = "force-dynamic";

export default async function CompetitionPage({ params }: { params: { code: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const view = await getCompetition(userId, params.code);
  if (!view) notFound();

  const isProblems = view.format === CompetitionFormat.PROBLEMS;

  const shell = (children: React.ReactNode) => (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[820px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s4">
        <header>
          <Link href="/compete" className="font-mono text-label uppercase text-accent hover:text-accent-strong">
            ← Competitions
          </Link>
          <h1 className="text-h1 font-semibold text-ink mt-s2 pb-[3px] break-words">{view.title}</h1>
          <p className="text-meta text-muted mt-s2">
            Hosted by {view.isHost ? "you" : view.hostName || "Anonymous"} ·{" "}
            {view.questionCount} {isProblems ? "problems" : "questions"}
            {isProblems && view.durationMinutes ? ` · ${view.durationMinutes} minutes` : ""} ·
            unrated
          </p>
        </header>
        {children}
      </div>
    </div>
  );

  if (view.status === "LOBBY") {
    return shell(<Lobby view={view} joinUrl={joinUrl(view.code)} qr={await qrFor(view.code)} />);
  }

  if (view.status === "ENDED") {
    const podium = view.standings.slice(0, 3);

    const board = (
      <>
        <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
          <div className="px-s4 py-s3 border-b border-line bg-bg-sunk">
            <h2 className="text-label uppercase text-faint">
              Final · {view.standings.length} played
            </h2>
          </div>
          <Standings rows={view.standings} meId={userId} questionCount={view.questionCount} />
        </section>

        {podium.length > 0 && (
          <p className="text-meta text-muted">
            {podium[0].name || "Anonymous"} took it with {podium[0].score}
            {isProblems ? " marks" : ` of ${view.questionCount}`}.
          </p>
        )}
      </>
    );

    if (isProblems) {
      // The host's marking screen is loaded only for the host, so a player who
      // reads this page never has the sheet — or the solutions — in their HTML.
      const [review, sheet, progress, focus] = await Promise.all([
        getProblemReview(userId, view.id),
        view.isHost ? getMarkingSheet(userId, view.id) : Promise.resolve(null),
        view.isHost ? markingProgress(userId, view.id) : Promise.resolve(null),
        view.isHost ? focusRecord(userId, view.id) : Promise.resolve(null),
      ]);

      return shell(
        <>
          {focus && (
            <FocusRecord
              competitionId={view.id}
              policy={focus.policy}
              rows={focus.rows}
              ended
            />
          )}
          {sheet && progress && (
            <MarkingRoom competitionId={view.id} sheet={sheet} progress={progress} />
          )}
          {board}
          {review && review.length > 0 ? (
            <ProblemReview lines={review} />
          ) : (
            <p className="text-meta text-muted">You did not sit this one.</p>
          )}
        </>
      );
    }

    const review = await getCompetitionReview(userId, view.id);
    return shell(
      <>
        {board}
        {review ? (
          <DuelReviewList lines={review} />
        ) : (
          <p className="text-meta text-muted">You did not play this one.</p>
        )}
      </>
    );
  }

  // RUNNING
  if (isProblems) {
    const play = view.joined ? await getProblemSession(userId, view.code) : null;

    const focus = view.isHost ? await focusRecord(userId, view.id) : null;

    return shell(
      <>
        {view.isHost && <HostControls id={view.id} progress={view.progress} />}
        {focus && (
          <FocusRecord competitionId={view.id} policy={focus.policy} rows={focus.rows} />
        )}
        {play ? (
          <ProblemPlay session={play} />
        ) : (
          <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s6 text-center">
            <h2 className="text-h3 font-semibold text-ink">Already under way</h2>
            <p className="text-meta text-muted mt-s3 max-w-[44ch] mx-auto">
              You can still take a seat. The clock belongs to the room, so
              arriving late costs you the time already gone.
            </p>
            <Lobby view={view} joinUrl={joinUrl(view.code)} qr={null} />
          </section>
        )}
      </>
    );
  }

  const play = view.joined ? await getPlaySession(userId, view.code) : null;

  const quizFocus = view.isHost ? await focusRecord(userId, view.id) : null;

  return shell(
    <>
      {view.isHost && <HostControls id={view.id} progress={view.progress} />}
      {quizFocus && (
        <FocusRecord competitionId={view.id} policy={quizFocus.policy} rows={quizFocus.rows} />
      )}

      {play ? (
        <CompetitionPlay session={play} meId={userId} />
      ) : (
        <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s6 text-center">
          <h2 className="text-h3 font-semibold text-ink">Already under way</h2>
          <p className="text-meta text-muted mt-s3 max-w-[44ch] mx-auto">
            You can still join — arriving late costs you nothing but the time
            already on the clock.
          </p>
          <Lobby view={view} joinUrl={joinUrl(view.code)} qr={null} />
        </section>
      )}
    </>
  );
}

/**
 * The address to hand round the room.
 *
 * Read from the request rather than from a build-time variable: the same code
 * is shown on a laptop on the school wifi and on a phone on mobile data, and
 * only the request knows which host answered.
 */
function joinUrl(code: string): string {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return host ? `${proto}://${host}/compete/${code}` : `/compete/${code}`;
}

/**
 * A square to point a phone at.
 *
 * Rendered on the server as a data URI: a classroom joins a room by reading
 * six characters off a projector and mistyping one of them, and a code that
 * can be scanned skips the whole problem. Failing to draw it costs the square,
 * not the page.
 */
async function qrFor(code: string): Promise<string | null> {
  try {
    return await QRCode.toDataURL(joinUrl(code), {
      margin: 1,
      width: 320,
      errorCorrectionLevel: "M",
      color: { dark: "#000000", light: "#FFFFFF" },
    });
  } catch (e) {
    console.error("qr failed", e);
    return null;
  }
}
