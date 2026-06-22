import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Wand2 } from "lucide-react";
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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace" },
      { name: "description", content: "Generate professional workplace emails by audience and tone." },
    ],
  }),
  component: EmailGenerator,
});

function EmailGenerator() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [audience, setAudience] = useState("client");
  const [tone, setTone] = useState("formal");
  const [instructions, setInstructions] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!purpose.trim()) {
      toast.error("Please describe the email purpose");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const system = `You are an expert workplace communication specialist. Generate a professional email.

Requirements:
- Produce a suitable Subject line.
- Use professional workplace language.
- Adapt tone and style to the audience.
- Include greeting and closing.
- Keep it concise, clear, and effective.
- Avoid overly complex language.

Output in this exact Markdown format:

**Subject:** <subject line>

**Email Body:**
<full email body>

**Suggested Improvements:**
- <improvement 1>
- <improvement 2>`;

      const prompt = `Purpose: ${purpose}
Recipient Name: ${recipient || "(unspecified)"}
Audience: ${audience}
Tone: ${tone}
Additional Instructions: ${instructions || "(none)"}`;

      const { content } = await generateAI({ data: { system, prompt } });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Smart Email Generator</h1>
          <p className="text-sm text-muted-foreground">
            Draft polished workplace emails in seconds.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email details</CardTitle>
            <CardDescription>Provide context for the AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Email Purpose</Label>
              <Textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Follow up on the Q3 marketing proposal and request a meeting next week."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Name</Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Sarah Johnson"
                />
              </div>

              <div className="space-y-2">
                <Label>Audience Type</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="informal">Informal</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Additional Instructions</Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Any specific points, links, or constraints…"
                className="min-h-[80px]"
              />
            </div>

            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              <Wand2 className="h-4 w-4" />
              {loading ? "Generating…" : "Generate Email"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generated email</CardTitle>
            <CardDescription>Editable — refine before sending.</CardDescription>
          </CardHeader>
          <CardContent>
            <AIOutput
              value={output}
              loading={loading}
              onChange={setOutput}
              placeholder="Your AI-generated email will appear here."
            />
          </CardContent>
        </Card>
      </div>

      <ResponsibleAINotice />
    </div>
  );
}
