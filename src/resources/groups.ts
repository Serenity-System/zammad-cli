import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const groupsResource = new Command("groups")
  .description("Manage ticket groups");

groupsResource.command("list")
  .description("List all groups")
  .option("--per-page <n>", "Results per page", "50")
  .option("--page <n>", "Page number", "1")
  .option("--fields <cols>", "Comma-separated columns")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/groups", { per_page: opts.perPage, page: opts.page });
      output(data, { json: opts.json, format: opts.format, fields: opts.fields?.split(",") });
    } catch (err) { handleError(err, opts.json); }
  });

groupsResource.command("get")
  .description("Get a group by ID")
  .argument("<id>", "Group ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/groups/${id}`);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

groupsResource.command("create")
  .description("Create a group")
  .requiredOption("--name <name>", "Group name")
  .option("--note <text>", "Note")
  .option("--parent-id <id>", "Parent group ID")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = { name: opts.name };
      if (opts.note) body.note = opts.note;
      if (opts.parentId) body.parent_id = Number(opts.parentId);
      const data = await client.post("/groups", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

groupsResource.command("update")
  .description("Update a group")
  .argument("<id>", "Group ID")
  .option("--name <name>", "New name")
  .option("--note <text>", "New note")
  .option("--active <bool>", "Active: true/false")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.note) body.note = opts.note;
      if (opts.active !== undefined) body.active = opts.active === "true";
      const data = await client.put(`/groups/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

groupsResource.command("delete")
  .description("Delete a group")
  .argument("<id>", "Group ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/groups/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });
