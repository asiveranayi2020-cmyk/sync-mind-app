import { useEffect, useState } from "react";
import { Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AIOutputProps {
  value: string;
  loading?: boolean;
  onChange?: (v: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function AIOutput({ value, loading, onChange, placeholder, minHeight = "400px" }: AIOutputProps) {
  const [local, setLocal] = useState(value);
  const [copied, setCopied] = useState(false);

  useEffect(() => setLocal(value), [value]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(local);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="relative">
      {loading ? (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/30"
          style={{ minHeight }}
        >
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">AI is generating your response…</p>
        </div>
      ) : (
        <>
          <Textarea
            value={local}
            onChange={(e) => {
              setLocal(e.target.value);
              onChange?.(e.target.value);
            }}
            placeholder={placeholder ?? "AI output will appear here…"}
            className="font-mono text-sm leading-relaxed"
            style={{ minHeight }}
          />
          {local && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleCopy}
              className="absolute right-3 top-3"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
            </Button>
          )}
        </>
      )}
    </div>
  );
}
