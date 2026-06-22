import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — AI Workplace" },
      { name: "description", content: "Guides, FAQs, and tips for getting the most out of AI." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "How do I write a good prompt?",
    a: "Be specific about the goal, audience, tone, and constraints. The more context you give, the more useful the output.",
  },
  {
    q: "Can I edit AI-generated content?",
    a: "Yes. Every output area is editable. Treat the AI's draft as a starting point and refine before sending or sharing.",
  },
  {
    q: "Is my data stored?",
    a: "Your inputs are sent to the AI model to generate a response and are not persisted by this app.",
  },
  {
    q: "What if the output is wrong?",
    a: "AI can make mistakes. Always review for accuracy — especially names, dates, numbers, and commitments — before acting on it.",
  },
];

function HelpPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Help & FAQ</h1>
          <p className="text-sm text-muted-foreground">Tips to get the best results.</p>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Quick start</CardTitle>
          <CardDescription>Three tools, one workflow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><span className="font-medium text-foreground">Smart Email Generator</span> — describe the purpose, pick audience and tone, then generate.</p>
          <p><span className="font-medium text-foreground">Meeting Notes Summarizer</span> — paste raw notes; get an executive summary and action items.</p>
          <p><span className="font-medium text-foreground">AI Task Planner</span> — list tasks; receive a prioritized, time-boxed schedule.</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Frequently asked questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem value={`item-${i}`} key={f.q}>
                <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <ResponsibleAINotice />
    </div>
  );
}
