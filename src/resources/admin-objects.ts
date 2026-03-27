import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

// ── OBJECT MANAGER ATTRIBUTES (Custom Fields) ──
export const objectAttributesResource = new Command("object-attributes")
  .description("Manage custom object attributes/fields (admin)");

objectAttributesResource.command("list")
  .description("List all custom object attributes")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/object_manager_attributes");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

objectAttributesResource.command("get")
  .description("Get a custom attribute by ID")
  .argument("<id>", "Attribute ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/object_manager_attributes/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

objectAttributesResource.command("create")
  .description("Create a custom attribute")
  .requiredOption("--object <obj>", "Object type (Ticket, User, Organization)")
  .requiredOption("--name <name>", "Attribute name (snake_case)")
  .requiredOption("--display <display>", "Display label")
  .requiredOption("--data-type <type>", "Data type (input, select, boolean, date, datetime, integer, textarea, richtext)")
  .option("--data-option <json>", "Data options JSON (for select: {options: {key: val}})")
  .option("--active", "Activate", true)
  .option("--position <n>", "Position order", "100")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {
        object: opts.object,
        name: opts.name,
        display: opts.display,
        data_type: opts.dataType,
        active: opts.active,
        position: Number(opts.position),
        screens: {
          create_middle: { "ticket.agent": { shown: true, required: false } },
          edit: { "ticket.agent": { shown: true, required: false } },
        },
      };
      if (opts.dataOption) body.data_option = JSON.parse(opts.dataOption);
      const data = await client.post("/object_manager_attributes", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

objectAttributesResource.command("update")
  .description("Update a custom attribute")
  .argument("<id>", "Attribute ID")
  .option("--display <display>", "Display label")
  .option("--data-option <json>", "Data options JSON")
  .option("--active <bool>", "Active status")
  .option("--position <n>", "Position order")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.display) body.display = opts.display;
      if (opts.dataOption) body.data_option = JSON.parse(opts.dataOption);
      if (opts.active !== undefined) body.active = opts.active === "true";
      if (opts.position) body.position = Number(opts.position);
      const data = await client.put(`/object_manager_attributes/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

objectAttributesResource.command("delete")
  .description("Delete a custom attribute")
  .argument("<id>", "Attribute ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/object_manager_attributes/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

objectAttributesResource.command("migrate")
  .description("Execute pending attribute migrations (required after create/update/delete)")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/object_manager_attributes_execute");
      output(data ?? { ok: true, message: "Migration executed" }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── TEXT MODULES (Response Templates) ──
export const textModulesResource = new Command("text-modules")
  .description("Manage text modules / response templates (admin)");

textModulesResource.command("list")
  .description("List all text modules")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/text_modules");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

textModulesResource.command("get")
  .description("Get a text module by ID")
  .argument("<id>", "Text module ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/text_modules/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

textModulesResource.command("create")
  .description("Create a text module")
  .requiredOption("--name <name>", "Module name")
  .requiredOption("--keywords <kw>", "Keywords (comma-separated)")
  .requiredOption("--content <html>", "Content body (HTML)")
  .option("--active", "Activate", true)
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/text_modules", {
        name: opts.name,
        keywords: opts.keywords,
        content: opts.content,
        active: opts.active,
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

textModulesResource.command("update")
  .description("Update a text module")
  .argument("<id>", "Text module ID")
  .option("--name <name>", "Module name")
  .option("--keywords <kw>", "Keywords")
  .option("--content <html>", "Content body")
  .option("--active <bool>", "Active status")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.keywords) body.keywords = opts.keywords;
      if (opts.content) body.content = opts.content;
      if (opts.active !== undefined) body.active = opts.active === "true";
      const data = await client.put(`/text_modules/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

textModulesResource.command("delete")
  .description("Delete a text module")
  .argument("<id>", "Text module ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/text_modules/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── TEMPLATES (Ticket Templates) ──
export const templatesResource = new Command("templates")
  .description("Manage ticket templates (admin)");

templatesResource.command("list")
  .description("List all ticket templates")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/templates");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

templatesResource.command("get")
  .description("Get a template by ID")
  .argument("<id>", "Template ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/templates/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

templatesResource.command("create")
  .description("Create a ticket template")
  .requiredOption("--name <name>", "Template name")
  .option("--options <json>", "Template options JSON (title, group_id, owner_id, state_id, priority_id, body, etc.)")
  .option("--active", "Activate", true)
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {
        name: opts.name,
        active: opts.active,
      };
      if (opts.options) body.options = JSON.parse(opts.options);
      const data = await client.post("/templates", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

templatesResource.command("delete")
  .description("Delete a ticket template")
  .argument("<id>", "Template ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/templates/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── TEXT MODULES IMPORT ──
textModulesResource.command("import").description("Import text modules").requiredOption("--data <json>", "Data JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/text_modules/import", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
textModulesResource.command("import-example").description("Download import example").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.get("/text_modules/import_example"), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
