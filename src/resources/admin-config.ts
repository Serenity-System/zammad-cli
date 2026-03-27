import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

// ── SETTINGS ──
export const settingsResource = new Command("settings")
  .description("Manage system settings (admin)");

settingsResource.command("list")
  .description("List all system settings")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/settings");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

settingsResource.command("get")
  .description("Get a setting by ID")
  .argument("<id>", "Setting ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/settings/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

settingsResource.command("update")
  .description("Update a setting value")
  .argument("<id>", "Setting ID")
  .requiredOption("--value <val>", "New value (JSON string for complex values)")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      let value: unknown = opts.value;
      try { value = JSON.parse(opts.value); } catch { /* keep as string */ }
      const data = await client.put(`/settings/${id}`, { state_current: { value } });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── TRIGGERS ──
export const triggersResource = new Command("triggers")
  .description("Manage automation triggers (admin)");

triggersResource.command("list")
  .description("List all triggers")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/triggers");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

triggersResource.command("get")
  .description("Get a trigger by ID")
  .argument("<id>", "Trigger ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/triggers/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

triggersResource.command("create")
  .description("Create a trigger")
  .requiredOption("--name <name>", "Trigger name")
  .requiredOption("--condition <json>", "Condition JSON")
  .requiredOption("--perform <json>", "Perform actions JSON")
  .option("--active", "Activate the trigger", true)
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/triggers", {
        name: opts.name,
        condition: JSON.parse(opts.condition),
        perform: JSON.parse(opts.perform),
        active: opts.active,
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

triggersResource.command("update")
  .description("Update a trigger")
  .argument("<id>", "Trigger ID")
  .option("--name <name>", "New name")
  .option("--condition <json>", "New condition JSON")
  .option("--perform <json>", "New perform actions JSON")
  .option("--active <bool>", "Active status")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.condition) body.condition = JSON.parse(opts.condition);
      if (opts.perform) body.perform = JSON.parse(opts.perform);
      if (opts.active !== undefined) body.active = opts.active === "true";
      const data = await client.put(`/triggers/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

triggersResource.command("delete")
  .description("Delete a trigger")
  .argument("<id>", "Trigger ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/triggers/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── WEBHOOKS ──
export const webhooksResource = new Command("webhooks")
  .description("Manage outgoing webhooks (admin)");

webhooksResource.command("list")
  .description("List all webhooks")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/webhooks");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

webhooksResource.command("get")
  .description("Get a webhook by ID")
  .argument("<id>", "Webhook ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/webhooks/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

webhooksResource.command("create")
  .description("Create a webhook")
  .requiredOption("--name <name>", "Webhook name")
  .requiredOption("--endpoint <url>", "Target URL")
  .option("--active", "Activate the webhook", true)
  .option("--ssl-verify", "Verify SSL", true)
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/webhooks", {
        name: opts.name,
        endpoint: opts.endpoint,
        active: opts.active,
        ssl_verify: opts.sslVerify,
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

webhooksResource.command("delete")
  .description("Delete a webhook")
  .argument("<id>", "Webhook ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/webhooks/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── JOBS (Schedulers) ──
export const jobsResource = new Command("jobs")
  .description("Manage scheduled jobs (admin)");

jobsResource.command("list")
  .description("List all scheduled jobs")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/jobs");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

jobsResource.command("get")
  .description("Get a job by ID")
  .argument("<id>", "Job ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/jobs/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

jobsResource.command("create")
  .description("Create a scheduled job")
  .requiredOption("--name <name>", "Job name")
  .requiredOption("--timeplan <json>", "Schedule JSON")
  .requiredOption("--condition <json>", "Condition JSON")
  .requiredOption("--perform <json>", "Perform actions JSON")
  .option("--active", "Activate the job", true)
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/jobs", {
        name: opts.name,
        timeplan: JSON.parse(opts.timeplan),
        condition: JSON.parse(opts.condition),
        perform: JSON.parse(opts.perform),
        active: opts.active,
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

jobsResource.command("delete")
  .description("Delete a scheduled job")
  .argument("<id>", "Job ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/jobs/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── CORE WORKFLOWS ──
export const coreWorkflowsResource = new Command("core-workflows")
  .description("Manage conditional form workflows (admin)");

coreWorkflowsResource.command("list")
  .description("List all core workflows")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/core_workflows");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

coreWorkflowsResource.command("get")
  .description("Get a core workflow by ID")
  .argument("<id>", "Workflow ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/core_workflows/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

coreWorkflowsResource.command("delete")
  .description("Delete a core workflow")
  .argument("<id>", "Workflow ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/core_workflows/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── PUBLIC LINKS ──
export const publicLinksResource = new Command("public-links")
  .description("Manage public links (admin)");

publicLinksResource.command("list")
  .description("List all public links")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/public_links");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

publicLinksResource.command("create")
  .description("Create a public link")
  .requiredOption("--link <url>", "URL")
  .requiredOption("--title <title>", "Title")
  .option("--description <desc>", "Description")
  .option("--new-tab", "Open in new tab", true)
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/public_links", {
        link: opts.link,
        title: opts.title,
        description: opts.description,
        new_tab: opts.newTab,
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

publicLinksResource.command("delete")
  .description("Delete a public link")
  .argument("<id>", "Link ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/public_links/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });
