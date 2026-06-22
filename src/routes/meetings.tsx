import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Wand2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIOutput } from "@/components/ai-output";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";
import { generateAI } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace" },
      { name: "description", content: "Turn meeting notes into concise summaries and action items." },
    ],
  }),
  component: MeetingSummarizer,
});

function MeetingSummarizer() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!notes.trim()) {
      toast.error("Please paste your meeting notes");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const system = `You are an executive assistant specializing in meeting documentation.

Analyze the meeting notes and produce a clean, professional summary.

Requirements:
- Remove unnecessary information.
- Focus on actionable insights.
- Clearly identify who is responsible for each action.
- Highlight important deadlines.
- Present results in a professional business format.

Output strictly in this Markdown format:

## Executive Summary
<2-4 sentences>

## Key Discussion Points
- ...

## Decisions Made
- ...

## Action Items
| Action | Responsible | Deadline |
|---|---|---|
| ... | ... | ... |

## Risks and Concerns
- ...`;

      const prompt = `Meeting Title: ${title || "(untitled)"}
Meeting Date: ${date || "(unspecified)"}

Meeting Notes:
${notes}`;

      const { content } = await generateAI({ data: { system, prompt } });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meeting Notes Summarizer</h1>
          <p className="text-sm text-muted-foreground">
            Convert raw notes into action-ready summaries.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Meeting input</CardTitle>
            <CardDescription>Paste your notes and add context.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Q3 Planning Sync"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Meeting Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Meeting Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste raw meeting notes, transcripts, or bullet points…"
                className="min-h-[320px] font-mono text-sm"
              />
            </div>

            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              <Wand2 className="h-4 w-4" />
              {loading ? "Summarizing…" : "Summarize Meeting"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
            <CardDescription>Editable — refine before sharing.</CardDescription>
          </CardHeader>
          <CardContent>
            <AIOutput
              value={output}
              loading={loading}
              onChange={setOutput}
              placeholder="Executive summary and action items will appear here."
              minHeight="480px"
            />
          </CardContent>
        </Card>
      </div>

      <ResponsibleAINotice />
    </div>
  );
}
