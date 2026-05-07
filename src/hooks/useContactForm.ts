"use client";

import { useCallback, useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export type SendStatus = "idle" | "sending" | "success" | "error";

interface FormFields {
  name: string;
  email: string;
  message: string;
}

const EMPTY: FormFields = { name: "", email: "", message: "" };

/**
 * Encapsulates the contact form's state machine and EmailJS call.
 *
 * State machine:
 *   idle    → sending  (on submit)
 *   sending → success | error  (on EmailJS resolve)
 *   success → idle  (after RESET_MS)
 *   error   → idle  (next time the user types)
 */
export function useContactForm() {
  const [fields, setFields] = useState<FormFields>(EMPTY);
  const [status, setStatus] = useState<SendStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const update = useCallback(
    (key: keyof FormFields, value: string) => {
      setFields((prev) => ({ ...prev, [key]: value }));
      // Clear error state on next input — feels more forgiving than a
      // sticky error message
      if (status === "error") {
        setStatus("idle");
        setErrorMsg(null);
      }
    },
    [status]
  );

  const reset = useCallback(() => {
    setFields(EMPTY);
    setStatus("idle");
    setErrorMsg(null);
  }, []);

  const send = useCallback(async () => {
    // Basic validation — keep messages friendly, not bureaucratic
    if (!fields.name.trim()) {
      setStatus("error");
      setErrorMsg("A name would be nice.");
      return;
    }
    if (!fields.email.trim() || !/^\S+@\S+\.\S+$/.test(fields.email)) {
      setStatus("error");
      setErrorMsg("That email doesn't look right.");
      return;
    }
    if (fields.message.trim().length < 10) {
      setStatus("error");
      setErrorMsg("Tell me a little more — at least a sentence.");
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus("error");
      setErrorMsg("Mail service isn't configured. Try a direct email?");
      console.error("[useContactForm] Missing EmailJS env vars");
      return;
    }

    setStatus("sending");
    setErrorMsg(null);

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: fields.name,
          from_email: fields.email,
          message: fields.message,
          date: new Date().toLocaleString(),
        },
        { publicKey: PUBLIC_KEY }
      );
      setStatus("success");
    } catch (err) {
      console.error("[useContactForm] send failed", err);
      setStatus("error");
      setErrorMsg("The post office turned us away. Try again?");
    }
  }, [fields]);

  return { fields, status, errorMsg, update, send, reset };
}