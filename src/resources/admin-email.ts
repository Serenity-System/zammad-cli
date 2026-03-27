import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

// ── EMAIL ADDRESSES ──
export const emailAddressesResource = new Command("email-addresses")
  .description("Manage email addresses (admin)");

emailAddressesResource.command("list")
  .description("List all email addresses")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/email_addresses");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

emailAddressesResource.command("get")
  .description("Get an email address by ID")
  .argument("<id>", "Email address ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/email_addresses/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

emailAddressesResource.command("create")
  .description("Create an email address")
  .requiredOption("--realname <name>", "Display name")
  .requiredOption("--email <email>", "Email address")
  .requiredOption("--channel-id <id>", "Channel ID")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/email_addresses", {
        realname: opts.realname,
        email: opts.email,
        channel_id: Number(opts.channelId),
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

emailAddressesResource.command("update")
  .description("Update an email address")
  .argument("<id>", "Email address ID")
  .option("--realname <name>", "Display name")
  .option("--email <email>", "Email address")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.realname) body.realname = opts.realname;
      if (opts.email) body.email = opts.email;
      const data = await client.put(`/email_addresses/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

emailAddressesResource.command("delete")
  .description("Delete an email address")
  .argument("<id>", "Email address ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/email_addresses/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── SIGNATURES ──
export const signaturesResource = new Command("signatures")
  .description("Manage email signatures (admin)");

signaturesResource.command("list")
  .description("List all signatures")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/signatures");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

signaturesResource.command("get")
  .description("Get a signature by ID")
  .argument("<id>", "Signature ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/signatures/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

signaturesResource.command("create")
  .description("Create a signature")
  .requiredOption("--name <name>", "Signature name")
  .requiredOption("--body <html>", "Signature body (HTML)")
  .option("--active", "Activate the signature", true)
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/signatures", {
        name: opts.name,
        body: opts.body,
        active: opts.active,
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

signaturesResource.command("update")
  .description("Update a signature")
  .argument("<id>", "Signature ID")
  .option("--name <name>", "Signature name")
  .option("--body <html>", "Signature body (HTML)")
  .option("--active <bool>", "Active status")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.body) body.body = opts.body;
      if (opts.active !== undefined) body.active = opts.active === "true";
      const data = await client.put(`/signatures/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

signaturesResource.command("delete")
  .description("Delete a signature")
  .argument("<id>", "Signature ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/signatures/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── POSTMASTER FILTERS ──
export const postmasterFiltersResource = new Command("postmaster-filters")
  .description("Manage inbound email filters (admin)");

postmasterFiltersResource.command("list")
  .description("List all postmaster filters")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/postmaster_filters");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

postmasterFiltersResource.command("get")
  .description("Get a postmaster filter by ID")
  .argument("<id>", "Filter ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/postmaster_filters/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

postmasterFiltersResource.command("create")
  .description("Create a postmaster filter")
  .requiredOption("--name <name>", "Filter name")
  .requiredOption("--match <json>", "Match conditions JSON")
  .requiredOption("--perform <json>", "Perform actions JSON")
  .option("--channel <channel>", "Channel (default: email)")
  .option("--active", "Activate the filter", true)
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/postmaster_filters", {
        name: opts.name,
        match: JSON.parse(opts.match),
        perform: JSON.parse(opts.perform),
        channel: opts.channel ?? "email",
        active: opts.active,
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

postmasterFiltersResource.command("delete")
  .description("Delete a postmaster filter")
  .argument("<id>", "Filter ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/postmaster_filters/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── CHANNELS EMAIL ──
export const channelsEmailResource = new Command("channels-email")
  .description("Manage email channels (admin)");

channelsEmailResource.command("list")
  .description("List all email channels")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/channels_email");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

channelsEmailResource.command("get")
  .description("Get an email channel by ID")
  .argument("<id>", "Channel ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/channels_email/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── CHANNELS MICROSOFT365 ──
export const channelsMicrosoft365Resource = new Command("channels-microsoft365")
  .description("Manage Microsoft 365 channels (admin)");

channelsMicrosoft365Resource.command("list")
  .description("List Microsoft 365 channels config")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.get("/channels_microsoft365");
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── CHANNELS GOOGLE ──
export const channelsGoogleResource = new Command("channels-google")
  .description("Manage Google channels (admin)");

channelsGoogleResource.command("list")
  .description("List Google channels config")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.get("/channels_google");
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });
