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

prioritiesResource.command("create")
  .description("Create a priority")
  .requiredOption("--name <name>", "Priority name")
  .option("--default-create", "Default for new tickets")
  .option("--ui-color <color>", "UI color")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = { name: opts.name };
      if (opts.defaultCreate) body.default_create = true;
      if (opts.uiColor) body.ui_color = opts.uiColor;
      const data = await client.post("/ticket_priorities", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

prioritiesResource.command("update")
  .description("Update a priority")
  .argument("<id>", "Priority ID")
  .option("--name <name>", "Priority name")
  .option("--active <bool>", "Active status")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.active !== undefined) body.active = opts.active === "true";
      const data = await client.put(`/ticket_priorities/${id}`, body);
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

statesResource.command("create")
  .description("Create a ticket state")
  .requiredOption("--name <name>", "State name")
  .requiredOption("--state-type-id <id>", "State type ID (1=new,2=open,3=pending reminder,4=pending close,5=merged,6=removed,7=closed)")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/ticket_states", {
        name: opts.name,
        state_type_id: Number(opts.stateTypeId),
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

statesResource.command("update")
  .description("Update a ticket state")
  .argument("<id>", "State ID")
  .option("--name <name>", "State name")
  .option("--active <bool>", "Active status")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.active !== undefined) body.active = opts.active === "true";
      const data = await client.put(`/ticket_states/${id}`, body);
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

overviewsResource.command("create")
  .description("Create an overview")
  .requiredOption("--name <name>", "Overview name")
  .requiredOption("--condition <json>", "Condition JSON")
  .option("--order-by <field>", "Order by field", "created_at")
  .option("--order-direction <dir>", "Order direction (ASC/DESC)", "DESC")
  .option("--prio <n>", "Priority/order position")
  .option("--view <json>", "View columns JSON")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {
        name: opts.name,
        condition: JSON.parse(opts.condition),
        order: { by: opts.orderBy, direction: opts.orderDirection },
      };
      if (opts.prio) body.prio = Number(opts.prio);
      if (opts.view) body.view = JSON.parse(opts.view);
      const data = await client.post("/overviews", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

overviewsResource.command("update")
  .description("Update an overview")
  .argument("<id>", "Overview ID")
  .option("--name <name>", "Overview name")
  .option("--condition <json>", "Condition JSON")
  .option("--active <bool>", "Active status")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.condition) body.condition = JSON.parse(opts.condition);
      if (opts.active !== undefined) body.active = opts.active === "true";
      const data = await client.put(`/overviews/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

overviewsResource.command("delete")
  .description("Delete an overview")
  .argument("<id>", "Overview ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/overviews/${id}`);
      output({ deleted: true, id }, { json: opts.json });
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

slasResource.command("create")
  .description("Create an SLA")
  .requiredOption("--name <name>", "SLA name")
  .option("--first-response-time <min>", "First response time in minutes")
  .option("--update-time <min>", "Update time in minutes")
  .option("--solution-time <min>", "Solution time in minutes")
  .option("--condition <json>", "Condition JSON")
  .option("--calendar-id <id>", "Calendar ID")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = { name: opts.name };
      if (opts.firstResponseTime) body.first_response_time = Number(opts.firstResponseTime);
      if (opts.updateTime) body.update_time = Number(opts.updateTime);
      if (opts.solutionTime) body.solution_time = Number(opts.solutionTime);
      if (opts.condition) body.condition = JSON.parse(opts.condition);
      if (opts.calendarId) body.calendar_id = Number(opts.calendarId);
      const data = await client.post("/slas", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

slasResource.command("delete")
  .description("Delete an SLA")
  .argument("<id>", "SLA ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/slas/${id}`);
      output({ deleted: true, id }, { json: opts.json });
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

rolesResource.command("create")
  .description("Create a role")
  .requiredOption("--name <name>", "Role name")
  .option("--permission-ids <ids>", "Comma-separated permission IDs")
  .option("--default-at-signup", "Assign at signup")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = { name: opts.name };
      if (opts.permissionIds) body.permission_ids = opts.permissionIds.split(",").map(Number);
      if (opts.defaultAtSignup) body.default_at_signup = true;
      const data = await client.post("/roles", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

rolesResource.command("update")
  .description("Update a role")
  .argument("<id>", "Role ID")
  .option("--name <name>", "Role name")
  .option("--permission-ids <ids>", "Comma-separated permission IDs")
  .option("--active <bool>", "Active status")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.permissionIds) body.permission_ids = opts.permissionIds.split(",").map(Number);
      if (opts.active !== undefined) body.active = opts.active === "true";
      const data = await client.put(`/roles/${id}`, body);
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

macrosResource.command("create")
  .description("Create a macro")
  .requiredOption("--name <name>", "Macro name")
  .requiredOption("--perform <json>", "Perform actions JSON")
  .option("--active", "Activate", true)
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/macros", {
        name: opts.name,
        perform: JSON.parse(opts.perform),
        active: opts.active,
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

macrosResource.command("update")
  .description("Update a macro")
  .argument("<id>", "Macro ID")
  .option("--name <name>", "Macro name")
  .option("--perform <json>", "Perform actions JSON")
  .option("--active <bool>", "Active status")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.perform) body.perform = JSON.parse(opts.perform);
      if (opts.active !== undefined) body.active = opts.active === "true";
      const data = await client.put(`/macros/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

macrosResource.command("delete")
  .description("Delete a macro")
  .argument("<id>", "Macro ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/macros/${id}`);
      output({ deleted: true, id }, { json: opts.json });
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

// ── OVERVIEWS PRIO ──
overviewsResource.command("prio").description("Set overview priorities/order").requiredOption("--data <json>", "Priority JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/overviews_prio", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
