import { Inngest } from "inngest";

// Initialize the Inngest client
export const inngest = new Inngest({
  id: "pikofy",
  name: "Pikofy",
  eventKey: process.env.INNGEST_EVENT_KEY,
});