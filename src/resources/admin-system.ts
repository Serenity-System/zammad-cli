import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

// ── CALENDARS ──
export const calendarsResource = new Command("calendars")
  .description("Manage business calendars (admin)");

calendarsResource.command("list")
  .description("List all calendars")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/calendars");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

calendarsResource.command("get")
  .description("Get a calendar by ID")
  .argument("<id>", "Calendar ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/calendars/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

calendarsResource.command("create")
  .description("Create a calendar")
  .requiredOption("--name <name>", "Calendar name")
  .requiredOption("--timezone <tz>", "Timezone (e.g. Europe/Paris)")
  .option("--business-hours <json>", "Business hours JSON")
  .option("--default", "Set as default calendar")
  .option("--ical-url <url>", "iCal holiday URL")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {
        name: opts.name,
        timezone: opts.timezone,
      };
      if (opts.businessHours) body.business_hours = JSON.parse(opts.businessHours);
      if (opts.default) body.default = true;
      if (opts.icalUrl) body.ical_url = opts.icalUrl;
      const data = await client.post("/calendars", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

calendarsResource.command("delete")
  .description("Delete a calendar")
  .argument("<id>", "Calendar ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/calendars/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── REPORT PROFILES ──
export const reportProfilesResource = new Command("report-profiles")
  .description("Manage report profiles (admin)");

reportProfilesResource.command("list")
  .description("List all report profiles")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/report_profiles");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

reportProfilesResource.command("get")
  .description("Get a report profile by ID")
  .argument("<id>", "Profile ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/report_profiles/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── SYSTEM REPORT ──
export const systemReportResource = new Command("system-report")
  .description("View system report and statistics (admin)");

systemReportResource.command("show")
  .description("Show full system report")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.get("/system_report");
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── PACKAGES ──
export const packagesResource = new Command("packages")
  .description("Manage installed packages (admin)");

packagesResource.command("list")
  .description("List installed packages")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/packages");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

// ── TIME ACCOUNTINGS ──
export const timeAccountingsResource = new Command("time-accountings")
  .description("Manage time accounting entries");

timeAccountingsResource.command("list")
  .description("List all time accounting entries")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/time_accountings");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

// ── DATA PRIVACY TASKS (GDPR) ──
export const dataPrivacyTasksResource = new Command("data-privacy")
  .description("Manage GDPR data privacy deletion tasks (admin)");

dataPrivacyTasksResource.command("list")
  .description("List all data privacy tasks")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/data_privacy_tasks");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

dataPrivacyTasksResource.command("create")
  .description("Create a data privacy deletion task for a user")
  .requiredOption("--user-id <id>", "User ID to delete")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/data_privacy_tasks", {
        deletable_id: Number(opts.userId),
        deletable_type: "User",
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── EXTERNAL CREDENTIALS ──
export const externalCredentialsResource = new Command("external-credentials")
  .description("Manage external service credentials (admin)");

externalCredentialsResource.command("list")
  .description("List all external credentials")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/external_credentials");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

// ── MONITORING ──
export const monitoringResource = new Command("monitoring")
  .description("System monitoring and health checks");

monitoringResource.command("health")
  .description("Run a health check")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.get("/monitoring/health_check");
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

monitoringResource.command("status")
  .description("Get system status")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.get("/monitoring/status");
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── SESSIONS ──
export const sessionsResource = new Command("sessions")
  .description("Manage active sessions (admin)");

sessionsResource.command("list")
  .description("List active sessions")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/sessions");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

sessionsResource.command("delete")
  .description("Delete/terminate a session")
  .argument("<id>", "Session ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/sessions/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── ACTIVITY STREAM ──
export const activityStreamResource = new Command("activity")
  .description("View activity stream");

activityStreamResource.command("list")
  .description("List recent activity")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/activity_stream");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

// ── TRANSLATIONS ──
export const translationsResource = new Command("translations")
  .description("Manage translations (admin)");

translationsResource.command("list")
  .description("List all translations")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.get("/translations");
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── INTEGRATIONS ──
export const integrationsResource = new Command("integrations")
  .description("Manage third-party integrations (admin)");

integrationsResource.command("github")
  .description("Get GitHub integration config")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.get("/integration/github");
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

integrationsResource.command("gitlab")
  .description("Get GitLab integration config")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.get("/integration/gitlab");
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });
