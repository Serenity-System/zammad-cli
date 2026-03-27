import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const organizationsResource = new Command("organizations")
  .alias("orgs")
  .description("Manage organizations");

organizationsResource.command("list")
  .description("List organizations")
  .option("--per-page <n>", "Results per page", "20")
  .option("--page <n>", "Page number", "1")
  .option("--expand", "Include expanded data")
  .option("--fields <cols>", "Comma-separated columns")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const params: Record<string, string> = { per_page: opts.perPage, page: opts.page };
      if (opts.expand) params.expand = "true";
      const data = await client.get("/organizations", params);
      output(data, { json: opts.json, format: opts.format, fields: opts.fields?.split(",") });
    } catch (err) { handleError(err, opts.json); }
  });

organizationsResource.command("search")
  .description("Search organizations")
  .argument("<query>", "Search query")
  .option("--per-page <n>", "Results per page", "20")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (query, opts) => {
    try {
      const data = await client.get("/organizations/search", { query, per_page: opts.perPage });
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

organizationsResource.command("get")
  .description("Get an organization by ID")
  .argument("<id>", "Organization ID")
  .option("--expand", "Include expanded data")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (id, opts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.expand) params.expand = "true";
      const data = await client.get(`/organizations/${id}`, params);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

organizationsResource.command("create")
  .description("Create an organization")
  .requiredOption("--name <name>", "Organization name")
  .option("--domain <domain>", "Email domain for auto-assign")
  .option("--shared", "Shared organization (all members see all tickets)")
  .option("--note <text>", "Note")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = { name: opts.name };
      if (opts.domain) body.domain = opts.domain;
      if (opts.shared) body.shared = true;
      if (opts.note) body.note = opts.note;
      const data = await client.post("/organizations", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

organizationsResource.command("update")
  .description("Update an organization")
  .argument("<id>", "Organization ID")
  .option("--name <name>", "New name")
  .option("--domain <domain>", "New domain")
  .option("--shared <bool>", "Shared: true/false")
  .option("--note <text>", "New note")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.domain) body.domain = opts.domain;
      if (opts.shared !== undefined) body.shared = opts.shared === "true";
      if (opts.note) body.note = opts.note;
      const data = await client.put(`/organizations/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

organizationsResource.command("delete")
  .description("Delete an organization")
  .argument("<id>", "Organization ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/organizations/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── HISTORY ──
organizationsResource.command("history")
  .description("Get history for an organization")
  .argument("<id>", "Organization ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      output(await client.get(`/organizations/history/${id}`), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── IMPORT ──
organizationsResource.command("import").description("Import organizations from CSV").requiredOption("--data <json>", "Data JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/organizations/import", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
organizationsResource.command("import-example").description("Download CSV import example").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.get("/organizations/import_example"), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
