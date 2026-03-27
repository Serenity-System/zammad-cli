import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const chatsResource = new Command("chats")
  .description("Manage chat configurations");

chatsResource
  .command("list")
  .description("List chat configurations")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      output(await client.get("/chats"), { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

chatsResource
  .command("get")
  .description("Get a chat by ID")
  .argument("<id>", "Chat ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      output(await client.get(`/chats/${id}`), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

chatsResource
  .command("create")
  .description("Create a chat configuration")
  .requiredOption("--name <name>", "Chat name")
  .option("--max-queue <n>", "Max queue size")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = { name: opts.name };
      if (opts.maxQueue) body.max_queue = Number(opts.maxQueue);
      output(await client.post("/chats", body), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

chatsResource
  .command("update")
  .description("Update a chat configuration")
  .argument("<id>", "Chat ID")
  .option("--name <name>", "New name")
  .option("--max-queue <n>", "New max queue size")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.maxQueue) body.max_queue = Number(opts.maxQueue);
      output(await client.put(`/chats/${id}`, body), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

chatsResource
  .command("delete")
  .description("Delete a chat configuration")
  .argument("<id>", "Chat ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/chats/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── CHAT SESSIONS ──
export const chatSessionsResource = new Command("chat-sessions")
  .description("Manage chat sessions");

chatSessionsResource
  .command("get")
  .description("Get a chat session by ID")
  .argument("<id>", "Session ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      output(await client.get(`/chat_sessions/${id}`), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });
