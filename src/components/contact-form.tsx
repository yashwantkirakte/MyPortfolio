"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type Status = "idle" | "sending" | "success" | "error" | "missing";

const formEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formEndpoint) {
      setStatus("missing");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Message could not be sent");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <input
        className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
        name="name"
        placeholder="Your name"
        required
      />
      <input
        className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
        name="email"
        placeholder="Email address"
        required
        type="email"
      />
      <textarea
        className="min-h-32 resize-none rounded-md border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
        name="message"
        placeholder="Tell me about your project"
        required
      />
      <Button disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send Message"}
        <ArrowUpRight size={18} />
      </Button>

      {status === "success" ? (
        <p className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={17} />
          Message sent. I will get back to you soon.
        </p>
      ) : null}

      {status === "error" ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          Something went wrong. Please email me directly instead.
        </p>
      ) : null}

      {status === "missing" ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Contact form setup is pending. Please add a Formspree endpoint in
          Vercel to receive messages.
        </p>
      ) : null}
    </form>
  );
}
