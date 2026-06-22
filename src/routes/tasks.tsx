import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, Wand2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIOutput } from "@/components/ai-output";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";
import { generateAI } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace" },
      { name: "description", content: "Prioritize tasks and generate a realistic schedule." },
    ],
  }),
  component: TaskPlanner,
});

function TaskPlanner() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("09:00 - 17:00");
  const [scope, setScope] = useState("daily");
  const [priority, setPriority] = useState("balanced");
  const [deadlines, setDeadlines] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!tasks.trim()) {
      toast.error("Please add at least one task");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const system = `You are a productivity and project management expert.

Create a structured ${scope} schedule based on the user's tasks.

Requirements:
- Prioritize tasks by urgency and importance.
- Allocate realistic time blocks within the working hours.
- Suggest focus periods and short breaks (e.g. Pomodoro-style).
- Recommend productivity improvements.
- Identify scheduling conflicts and risks.
- Optimize workload distribution across the ${scope === "daily" ? "day" : "week"}.

Output in this Markdown format:

## Priority Ranking
1. <task> — <reason>

## ${scope === "daily" ? "Daily Schedule" : "Weekly Schedule"}
| Time | Task | Notes |
|---|---|---|
| ... | ... | ... |

## Recommended Breaks
- ...

## Productivity Suggestions
- ...

## Potential Risks
- ...`;

      const prompt = `Tasks:
${tasks}

Preferred Working Hours: ${hours}
Schedule scope: ${scope}
Priority preference: ${priority}
Deadlines: ${deadlines || "(none specified)"}`;

      const { content } = await generateAI({ data: { system, prompt } });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <CalendarCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Task Planner</h1>
          <p className="text-sm text-muted-foreground">
            Prioritize tasks and generate a focused schedule.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your tasks</CardTitle>
            <CardDescription>List tasks, one per line.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tasks">Tasks</Label>
              <Textarea
                id="tasks"
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder={"Write Q3 report\nReview PR #482\nClient call prep\nInbox triage"}
                className="min-h-[180px] font-mono text-sm"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hours">Working Hours</Label>
                <Input
                  id="hours"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="09:00 - 17:00"
                />
              </div>
              <div className="space-y-2">
                <Label>Schedule</Label>
                <Select value={scope} onValueChange={setScope}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Priority Style</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deep-work">Deep Work First</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="urgent">Urgent First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadlines">Deadlines</Label>
                <Input
                  id="deadlines"
                  value={deadlines}
                  onChange={(e) => setDeadlines(e.target.value)}
                  placeholder="Report due Fri 5pm"
                />
              </div>
            </div>

            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              <Wand2 className="h-4 w-4" />
              {loading ? "Planning…" : "Generate Schedule"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your schedule</CardTitle>
            <CardDescription>Editable — adapt to your reality.</CardDescription>
          </CardHeader>
          <CardContent>
            <AIOutput
              value={output}
              loading={loading}
              onChange={setOutput}
              placeholder="Your prioritized schedule will appear here."
              minHeight="520px"
            />
          </CardContent>
        </Card>
      </div>

      <ResponsibleAINotice />
    </div>
  );
}
