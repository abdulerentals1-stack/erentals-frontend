"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // optional: toggle UI

export default function AIPromptModal() {
  const [field1, setField1] = useState(""); // Content type
  const [field2, setField2] = useState(""); // Product details
  const [includeCSS, setIncludeCSS] = useState(false); // Tailwind toggle
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field1, field2, includeCSS }),
      });

      const data = await res.json();
      console.log(data);

      if (data?.choices?.[0]?.message?.content) {
        setResponse(data.choices[0].message.content);
      } else {
        setResponse("AI did not return any content.");
      }
    } catch (err) {
      console.error(err);
      setResponse("❌ Error contacting AI API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-blue-600 text-sm underline cursor-pointer">
          ℹ️ AI Assist
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Content with AI</DialogTitle>
          <DialogDescription>
            Select content type, product info, and optionally add Tailwind CSS formatting.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="field1">What to Generate (e.g. Description, FAQ)</Label>
            <Input
              id="field1"
              value={field1}
              onChange={(e) => setField1(e.target.value)}
              placeholder="e.g. Product Description"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="field2">Product Name + Details</Label>
            <Input
              id="field2"
              value={field2}
              onChange={(e) => setField2(e.target.value)}
              placeholder="e.g. Canon DSLR 1500D, 24.1MP, for wedding rental"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="css-toggle" checked={includeCSS} onCheckedChange={setIncludeCSS} />
            <Label htmlFor="css-toggle">Include Tailwind CSS</Label>
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Generate Content"
            )}
          </Button>

          <div className="mt-4">
            <Label>AI Response</Label>
            {includeCSS ? (
              <div
                className="mt-2 p-4 border border-gray-300 rounded-md bg-gray-50 text-sm prose max-w-none"
                dangerouslySetInnerHTML={{ __html: response }}
              />
            ) : (
              <textarea
                readOnly
                value={response}
                rows={6}
                className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
