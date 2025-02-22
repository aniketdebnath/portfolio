"use client";

import { useEffect } from "react";

export default function SentryFeedbackClient() {
  useEffect(() => {
    (async () => {
      const Sentry = await import("@sentry/nextjs");

      // Manually inject the User Feedback button
      Sentry.showReportDialog({
        title: "Feedback",
        subtitle: "We'd love to hear from you!",
        labelName: "Name",
        labelEmail: "Email",
        labelComments: "Comments",
        labelClose: "Close",
        labelSubmit: "Submit",
        colorScheme: "auto", // Matches system theme
      });
    })();
  }, []);

  return null;
}
