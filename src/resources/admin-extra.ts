import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

// ── LDAP SOURCES ──
export const ldapSourcesResource = new Command("ldap-sources")
  .description("Manage LDAP sources");

ldapSourcesResource
  .command("list")
  .description("List LDAP sources")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      output(await client.get("/ldap_sources"), { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

ldapSourcesResource
  .command("get")
  .description("Get an LDAP source")
  .argument("<id>", "LDAP source ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      output(await client.get(`/ldap_sources/${id}`), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

ldapSourcesResource
  .command("create")
  .description("Create an LDAP source")
  .requiredOption("--name <name>", "Source name")
  .requiredOption("--host <host>", "LDAP host")
  .option("--port <n>", "Port", "389")
  .option("--ssl", "Use SSL")
  .option("--bind-dn <dn>", "Bind DN")
  .option("--bind-pw <pw>", "Bind password")
  .option("--base-dn <dn>", "Base DN")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {
        name: opts.name, host: opts.host, port: Number(opts.port),
      };
      if (opts.ssl) body.ssl = true;
      if (opts.bindDn) body.bind_dn = opts.bindDn;
      if (opts.bindPw) body.bind_pw = opts.bindPw;
      if (opts.baseDn) body.base_dn = opts.baseDn;
      output(await client.post("/ldap_sources", body), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

ldapSourcesResource
  .command("update")
  .description("Update an LDAP source")
  .argument("<id>", "LDAP source ID")
  .option("--name <name>", "New name")
  .option("--host <host>", "New host")
  .option("--data <json>", "Full config as JSON")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      let body: Record<string, unknown> = {};
      if (opts.data) body = JSON.parse(opts.data);
      if (opts.name) body.name = opts.name;
      if (opts.host) body.host = opts.host;
      output(await client.put(`/ldap_sources/${id}`, body), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

ldapSourcesResource
  .command("delete")
  .description("Delete an LDAP source")
  .argument("<id>", "LDAP source ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/ldap_sources/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── SSL CERTIFICATES ──
export const sslCertificatesResource = new Command("ssl-certificates")
  .description("Manage SSL certificates");

sslCertificatesResource
  .command("list")
  .description("List SSL certificates")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      output(await client.get("/ssl_certificates"), { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

sslCertificatesResource
  .command("download")
  .description("Download an SSL certificate")
  .argument("<id>", "Certificate ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      output(await client.get(`/ssl_certificates/${id}/download`), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── HTTP LOGS ──
export const httpLogsResource = new Command("http-logs")
  .description("View HTTP integration logs");

httpLogsResource
  .command("list")
  .description("List HTTP logs for a facility")
  .argument("<facility>", "Facility name (e.g. webhook, github, gitlab)")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (facility, opts) => {
    try {
      output(await client.get(`/http_logs/${facility}`), { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

// ── REPORTS ──
export const reportsResource = new Command("reports")
  .description("Generate and view reports");

reportsResource
  .command("config")
  .description("Get report configuration")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      output(await client.get("/reports/config"), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

reportsResource
  .command("generate")
  .description("Generate a report")
  .option("--profile-id <id>", "Report profile ID")
  .option("--metric <name>", "Metric name (e.g. count, create_channels)")
  .option("--year <y>", "Year")
  .option("--month <m>", "Month (1-12)")
  .option("--week <w>", "Week number")
  .option("--day <d>", "Day (1-31)")
  .option("--time-range <range>", "Time range: year, month, week, day")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.profileId) body.profiles = { id: Number(opts.profileId) };
      if (opts.metric) body.metric = opts.metric;
      if (opts.year) body.year = Number(opts.year);
      if (opts.month) body.month = Number(opts.month);
      if (opts.week) body.week = Number(opts.week);
      if (opts.day) body.day = Number(opts.day);
      if (opts.timeRange) body.timeRange = opts.timeRange;
      output(await client.post("/reports/generate", body), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

reportsResource
  .command("sets")
  .description("Get report sets")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      output(await client.get("/reports/sets"), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── USER DEVICES ──
export const userDevicesResource = new Command("user-devices")
  .description("Manage user devices");

userDevicesResource
  .command("list")
  .description("List user devices")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      output(await client.get("/user_devices"), { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

// ── GLOBAL SEARCH ──
export const searchResource = new Command("search")
  .description("Global cross-entity search (tickets, users, organizations, knowledge base)");

searchResource
  .command("query")
  .description("Search across all entities")
  .argument("<query>", "Search query")
  .option("--per-page <n>", "Results per page", "20")
  .option("--page <n>", "Page number", "1")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (query, opts) => {
    try {
      const params: Record<string, string> = {
        query, per_page: opts.perPage, page: opts.page,
      };
      output(await client.get("/search", params), { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

// ── USER OVERVIEW SORTINGS ──
export const userOverviewSortingsResource = new Command("overview-sortings")
  .description("Manage user overview sortings");

userOverviewSortingsResource
  .command("list")
  .description("List overview sortings")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      output(await client.get("/user_overview_sortings"), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

userOverviewSortingsResource
  .command("prio")
  .description("Update overview sorting priority")
  .requiredOption("--data <json>", "Priority data as JSON")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      output(await client.post("/user_overview_sortings_prio", JSON.parse(opts.data)), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── TICKET STATS ──
export const ticketStatsResource = new Command("ticket-stats")
  .description("Get ticket statistics");

ticketStatsResource
  .command("get")
  .description("Get ticket stats for a user/org")
  .option("--user-id <id>", "User ID")
  .option("--organization-id <id>", "Organization ID")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.userId) params.user_id = opts.userId;
      if (opts.organizationId) params.organization_id = opts.organizationId;
      output(await client.get("/ticket_stats", params), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });
