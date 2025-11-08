import React from "react";

interface ExamCoverProps {
  title: string;
  topic: string;
  mcqCount: number;
  shortAnswerCount: number;
  totalQuestions: number;
  totalMarks?: number;
  duration?: string;
}

export default function ExamCover({ 
  title, 
  topic, 
  mcqCount, 
  shortAnswerCount, 
  totalQuestions,
  totalMarks,
  duration = "2 hours"
}: ExamCoverProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate estimated total marks if not provided
  const estimatedMarks = totalMarks || (mcqCount * 2 + shortAnswerCount * 5);
  const sectionsLabel = mcqCount > 0 && shortAnswerCount > 0 ? "two sections" : "a single section";

  return (
    <div className="exam-cover relative flex flex-col gap-8 rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm print:gap-4 print:rounded-none print:border-0 print:bg-white print:p-5 print:text-sm print:text-black">
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-primary/15 via-transparent to-transparent opacity-70 dark:from-primary/10 print:hidden"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-8">
        {/* Header */}
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Exam Day Brief
          </p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl print:text-2xl">
            {title}
          </h2>
          <p className="text-base text-muted-foreground">
            {topic} | {currentDate}
          </p>
        </header>

    {/* Exam Details Box */}
    <section className="rounded-2xl border border-border/70 bg-muted/40 p-6 print:rounded-xl print:border-2 print:border-gray-800 print:bg-transparent print:p-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3 text-sm print:space-y-2">
              <p>
                <span className="font-semibold text-card-foreground">Duration:</span> {duration}
              </p>
              <p>
                <span className="font-semibold text-card-foreground">Total Questions:</span> {totalQuestions}
              </p>
              <p>
                <span className="font-semibold text-card-foreground">Question Breakdown:</span>
              </p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                {mcqCount > 0 && <li>{mcqCount} multiple choice</li>}
                {shortAnswerCount > 0 && <li>{shortAnswerCount} short answer</li>}
              </ul>
            </div>
            <div className="space-y-3 text-sm print:space-y-2">
              <p>
                <span className="font-semibold text-card-foreground">Estimated Marks:</span> {estimatedMarks}
              </p>
              <p>
                <span className="font-semibold text-card-foreground">Pass Target:</span> {Math.ceil(estimatedMarks * 0.5)} marks
              </p>
              <p>
                <span className="font-semibold text-card-foreground">You'll Explore:</span> {sectionsLabel}
              </p>
              <p className="rounded-xl border border-dashed border-border/60 bg-background/80 px-4 py-2 text-xs text-muted-foreground print:px-3 print:py-1.5 print:text-[11px] print:border-0 print:bg-transparent">
                Settle in, take a breath, and show what you know.
              </p>
            </div>
          </div>
        </section>

        {/* Student Information */}
        <section className="rounded-2xl border border-border/70 bg-background/60 p-6 print:rounded-xl print:border-2 print:border-gray-800 print:bg-transparent print:p-4">
          <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Candidate Details
          </h3>
          <div className="space-y-4 text-sm print:space-y-3">
            <div className="flex items-center gap-4">
              <span className="w-32 font-medium text-card-foreground print:w-28">Name</span>
              <span className="flex-1 border-b border-dashed border-border/70 text-muted-foreground print:min-h-[18px]">Please print clearly</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-32 font-medium text-card-foreground print:w-28">Student ID</span>
              <span className="flex-1 border-b border-dashed border-border/70 text-muted-foreground print:min-h-[18px]">Numbers only</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-32 font-medium text-card-foreground print:w-28">Signature</span>
              <span className="flex-1 border-b border-dashed border-border/70 text-muted-foreground print:min-h-[18px]">Sign when ready</span>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="rounded-2xl border border-border/70 bg-muted/40 p-6 print:rounded-xl print:border-2 print:border-gray-800 print:bg-transparent print:p-4">
          <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Friendly Reminders
          </h3>
          <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground print:space-y-2">
            <li>Write your name and student ID above so we can celebrate your success.</li>
            <li>This exam includes {totalQuestions} questions across {sectionsLabel}. Take them one at a time.</li>
            <li>Circle MCQ answers neatly and use the provided space for short responses.</li>
            <li>Bring your best explanations and show your working where it helps tell your story.</li>
            <li>Keep devices tucked away and enjoy a quiet focus zone.</li>
            <li>Need a calculator? Yes, it is welcome today.</li>
            <li>When you finish, give your paper a quick check before handing it in.</li>
          </ul>
          <p className="mt-6 rounded-2xl border border-dashed border-border/70 bg-background/70 px-4 py-3 text-center text-sm font-medium text-card-foreground print:mt-4 print:px-3 print:py-2 print:text-xs print:border-0 print:bg-transparent">
            You have prepared for this. Deep breath, steady pace, you've got this!
          </p>
        </section>
      </div>
    </div>
  );
}