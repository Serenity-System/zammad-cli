import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const mentionsResource = new Command("mentions")
  .description("Manage @mentions (subscriptions) on tickets");

mentionsResource
  .command("list <ticket-id>")
  .description("List mentions/subscriptions for a ticket")
  .option("--fields <fields>", "Comma-separated fields to display")
  .action(async (ticketId, opts) => {
    try {
      const data = await client.get("/mentions", {
        mentionable_type: "Ticket",
        mentionable_id: ticketId,
      }) as Record<string, unknown>;
      output((data.mentions ?? data) as Record<string, unknown>[], opts.fields);
    } catch (e) { handleError(e); }
  });

mentionsResource
  .command("subscribe <ticket-id>")
  .description("Subscribe (mention yourself) on a ticket")
  .action(async (ticketId) => {
    try {
      const data = await client.post("/mentions", {
        mentionable_type: "Ticket",
        mentionable_id: parseInt(ticketId),
      });
      output(data as Record<string, unknown>);
    } catch (e) { handleError(e); }
  });

mentionsResource
  .command("unsubscribe <mention-id>")
  .description("Unsubscribe (remove mention) by mention ID")
  .action(async (mentionId) => {
    try {
      await client.delete(`/mentions/${mentionId}`);
      console.log(`Mention ${mentionId} removed.`);
    } catch (e) { handleError(e); }
  });
