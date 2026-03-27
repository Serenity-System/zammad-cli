import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

// ── CHECKLISTS ──
export const checklistsResource = new Command("checklists")
  .description("Manage ticket checklists");

checklistsResource
  .command("get")
  .description("Get a checklist by ID")
  .argument("<id>", "Checklist ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/checklists/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

checklistsResource
  .command("create")
  .description("Create a checklist on a ticket")
  .requiredOption("--ticket-id <id>", "Ticket ID")
  .option("--name <name>", "Checklist name")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = { ticket_id: Number(opts.ticketId) };
      if (opts.name) body.name = opts.name;
      const data = await client.post("/checklists", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

checklistsResource
  .command("update")
  .description("Update a checklist")
  .argument("<id>", "Checklist ID")
  .option("--name <name>", "New name")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      const data = await client.put(`/checklists/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

checklistsResource
  .command("delete")
  .description("Delete a checklist")
  .argument("<id>", "Checklist ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/checklists/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── CHECKLIST ITEMS ──
export const checklistItemsResource = new Command("checklist-items")
  .description("Manage checklist items");

checklistItemsResource
  .command("get")
  .description("Get a checklist item")
  .argument("<id>", "Item ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/checklist_items/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

checklistItemsResource
  .command("create")
  .description("Add an item to a checklist")
  .requiredOption("--checklist-id <id>", "Checklist ID")
  .requiredOption("--text <text>", "Item text")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/checklist_items", {
        checklist_id: Number(opts.checklistId),
        text: opts.text,
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

checklistItemsResource
  .command("update")
  .description("Update a checklist item")
  .argument("<id>", "Item ID")
  .option("--text <text>", "New text")
  .option("--checked", "Mark as checked")
  .option("--no-checked", "Uncheck")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.text) body.text = opts.text;
      if (opts.checked !== undefined) body.checked = opts.checked;
      const data = await client.put(`/checklist_items/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

checklistItemsResource
  .command("delete")
  .description("Delete a checklist item")
  .argument("<id>", "Item ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/checklist_items/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── CHECKLIST TEMPLATES ──
export const checklistTemplatesResource = new Command("checklist-templates")
  .description("Manage checklist templates");

checklistTemplatesResource
  .command("list")
  .description("List checklist templates")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/checklist_templates");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

checklistTemplatesResource
  .command("get")
  .description("Get a checklist template")
  .argument("<id>", "Template ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/checklist_templates/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

checklistTemplatesResource
  .command("create")
  .description("Create a checklist template")
  .requiredOption("--name <name>", "Template name")
  .option("--items <items>", "Comma-separated item texts")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = { name: opts.name };
      if (opts.items) body.items = opts.items.split(",").map((t: string) => ({ text: t.trim() }));
      const data = await client.post("/checklist_templates", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

checklistTemplatesResource
  .command("update")
  .description("Update a checklist template")
  .argument("<id>", "Template ID")
  .option("--name <name>", "New name")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      const data = await client.put(`/checklist_templates/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

checklistTemplatesResource
  .command("delete")
  .description("Delete a checklist template")
  .argument("<id>", "Template ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/checklist_templates/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });
