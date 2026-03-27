import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

// --- Version ---
export const serverVersionResource = new Command("server-version")
  .description("Show Zammad server version")
  .action(async () => {
    try {
      const data = await client.get("/version");
      output(data as Record<string, unknown>);
    } catch (e) { handleError(e); }
  });

// --- Taskbar ---
export const taskbarResource = new Command("taskbar")
  .description("Manage taskbar items (open tabs in Zammad UI)");

taskbarResource
  .command("list")
  .description("List all taskbar items")
  .option("--fields <fields>", "Comma-separated fields to display")
  .action(async (opts) => {
    try {
      const data = await client.get("/taskbar");
      output(data as Record<string, unknown>[], opts.fields);
    } catch (e) { handleError(e); }
  });

taskbarResource
  .command("delete <id>")
  .description("Delete a taskbar item")
  .action(async (id) => {
    try {
      await client.delete(`/taskbar/${id}`);
      console.log(`Taskbar item ${id} deleted.`);
    } catch (e) { handleError(e); }
  });

// --- Recent View ---
export const recentViewResource = new Command("recent-view")
  .description("View recently accessed items");

recentViewResource
  .command("list")
  .description("List recently viewed items")
  .option("--fields <fields>", "Comma-separated fields to display")
  .action(async (opts) => {
    try {
      const data = await client.get("/recent_view");
      output(data as Record<string, unknown>[], opts.fields);
    } catch (e) { handleError(e); }
  });

// --- First Steps / Getting Started ---
export const gettingStartedResource = new Command("getting-started")
  .description("Server setup status and first steps");

gettingStartedResource
  .command("status")
  .description("Check setup/getting started status")
  .action(async () => {
    try {
      const data = await client.get("/getting_started");
      output(data as Record<string, unknown>);
    } catch (e) { handleError(e); }
  });

gettingStartedResource
  .command("first-steps")
  .description("Show onboarding checklist")
  .action(async () => {
    try {
      const data = await client.get("/first_steps");
      output(data as Record<string, unknown>[]);
    } catch (e) { handleError(e); }
  });
