import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, CalendarCheck, Sparkles, ArrowRight, Zap, ShieldCheck, BrainCircuit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "Your AI-powered workspace for emails, meetings, and task planning." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    description: "Draft professional workplace emails tailored to your audience and tone.",
    icon: Mail,
    href: "/email" as const,
    accent: "from-blue-500/15 to-blue-500/0",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn long meeting notes into clear summaries, decisions, and action items.",
    icon: FileText,
    href: "/meetings" as const,
    accent: "from-emerald-500/15 to-emerald-500/0",
  },
  {
    title: "AI Task Planner",
    description: "Prioritize tasks and generate a realistic, focused daily or weekly schedule.",
    icon: CalendarCheck,
    href: "/tasks" as const,
    accent: "from-violet-500/15 to-violet-500/0",
  },
];

const benefits = [
  { icon: Zap, title: "Faster output", text: "Cut hours of writing and planning into seconds." },
  { icon: BrainCircuit, title: "Context-aware", text: "Prompts tuned for real workplace scenarios." },
  { icon: ShieldCheck, title: "Responsible AI", text: "You stay in control — review and edit every output." },
];

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-10">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Workplace Productivity</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Automate the busywork. Focus on the work that matters.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Generate professional emails, summarize meetings into action items, and plan your day
          with AI built for modern professionals.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/email">
              Try Email Generator <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/tasks">Plan my day</Link>
          </Button>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {benefits.map((b) => (
          <div key={b.title} className="rounded-xl border border-border bg-card p-4">
            <b.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-semibold">{b.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{b.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Your AI tools</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.title} to={t.href} className="group">
              <Card className={`relative h-full overflow-hidden transition hover:border-primary/50 hover:shadow-md`}>
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${t.accent}`} />
                <CardHeader className="relative">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-3 text-base">{t.title}</CardTitle>
                  <CardDescription>{t.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    Open tool
                    <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <ResponsibleAINotice />
    </div>
  );
}
