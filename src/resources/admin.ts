import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

// ── PRIORITIES ──
export const prioritiesResource = new Command("priorities")
  .description("Manage ticket priorities");

prioritiesResource.command("list")
  .description("List all priorities")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/ticket_priorities");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

prioritiesResource.command("get")
  .description("Get a priority by ID")
  .argument("<id>", "Priority ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/ticket_priorities/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── STATES ──
export const statesResource = new Command("states")
  .description("Manage ticket states");

statesResource.command("list")
  .description("List all ticket states")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/ticket_states");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

statesResource.command("get")
  .description("Get a state by ID")
  .argument("<id>", "State ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/ticket_states/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── OVERVIEWS ──
export const overviewsResource = new Command("overviews")
  .description("Manage ticket overviews (views/filters)");

overviewsResource.command("list")
  .description("List all overviews")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/overviews");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

overviewsResource.command("get")
  .description("Get an overview by ID")
  .argument("<id>", "Overview ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/overviews/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── SLAs ──
export const slasResource = new Command("slas")
  .description("Manage SLA policies");

slasResource.command("list")
  .description("List all SLAs")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/slas");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

slasResource.command("get")
  .description("Get an SLA by ID")
  .argument("<id>", "SLA ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/slas/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── ROLES ──
export const rolesResource = new Command("roles")
  .description("Manage user roles");

rolesResource.command("list")
  .description("List all roles")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/roles");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

rolesResource.command("get")
  .description("Get a role by ID")
  .argument("<id>", "Role ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/roles/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── MACROS ──
export const macrosResource = new Command("macros")
  .description("Manage macros (automated actions)");

macrosResource.command("list")
  .description("List all macros")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/macros");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

macrosResource.command("get")
  .description("Get a macro by ID")
  .argument("<id>", "Macro ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/macros/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── NOTIFICATIONS ──
export const notificationsResource = new Command("notifications")
  .description("Manage online notifications");

notificationsResource.command("list")
  .description("List notifications")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/online_notifications");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

notificationsResource.command("mark-read")
  .description("Mark a notification as read")
  .argument("<id>", "Notification ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.put(`/online_notifications/${id}`, { seen: true });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

notificationsResource.command("mark-all-read")
  .description("Mark all notifications as read")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/online_notifications/mark_all_as_read");
      output(data ?? { ok: true }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });
