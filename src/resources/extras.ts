import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

// ── CTI (Computer Telephony Integration) ──
export const ctiResource = new Command("cti")
  .description("Computer Telephony Integration (call log)");

ctiResource.command("log")
  .description("Get CTI call log")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.get("/cti/log");
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

ctiResource.command("done-bulk")
  .description("Mark multiple CTI entries as done")
  .requiredOption("--ids <json>", "JSON array of IDs")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/cti/done/bulk", { ids: JSON.parse(opts.ids) });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── Attachments ──
export const attachmentsResource = new Command("attachments")
  .description("Manage attachments");

attachmentsResource.command("get")
  .description("Get an attachment by ID")
  .argument("<id>", "Attachment ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/attachments/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── Forms (public form) ──
export const formsResource = new Command("forms")
  .description("Public form endpoints");

formsResource.command("config")
  .description("Get form configuration")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/form_config");
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

formsResource.command("submit")
  .description("Submit a form")
  .requiredOption("--data <json>", "Form data JSON")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/form_submit", JSON.parse(opts.data));
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── Proxy ──
export const proxyResource = new Command("proxy")
  .description("Test proxy settings");

proxyResource.command("test")
  .description("Test proxy configuration")
  .requiredOption("--url <url>", "URL to test through proxy")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/proxy", { url: opts.url });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── Import Tools ──
export const importResource = new Command("import")
  .description("Import data from other helpdesk systems");

for (const system of ["freshdesk", "kayako", "zendesk"]) {
  const sub = importResource.command(system).description(`Import from ${system}`);

  sub.command("url-check")
    .description(`Check ${system} URL`)
    .requiredOption("--url <url>", `${system} URL`)
    .option("--json", "Output as JSON")
    .action(async (opts) => {
      try {
        const data = await client.post(`/import/${system}/url_check`, { url: opts.url });
        output(data, { json: opts.json });
      } catch (err) { handleError(err, opts.json); }
    });

  sub.command("credentials-check")
    .description(`Check ${system} credentials`)
    .requiredOption("--data <json>", "Credentials JSON")
    .option("--json", "Output as JSON")
    .action(async (opts) => {
      try {
        const data = await client.post(`/import/${system}/credentials_check`, JSON.parse(opts.data));
        output(data, { json: opts.json });
      } catch (err) { handleError(err, opts.json); }
    });

  sub.command("start")
    .description(`Start ${system} import`)
    .option("--json", "Output as JSON")
    .action(async (opts) => {
      try {
        const data = await client.post(`/import/${system}/import_start`);
        output(data, { json: opts.json });
      } catch (err) { handleError(err, opts.json); }
    });

  sub.command("status")
    .description(`Get ${system} import status`)
    .option("--json", "Output as JSON")
    .action(async (opts) => {
      try {
        const data = await client.get(`/import/${system}/import_status`);
        output(data, { json: opts.json });
      } catch (err) { handleError(err, opts.json); }
    });
}

// OTRS
const otrs = importResource.command("otrs").description("Import from OTRS");
otrs.command("url-check").description("Check OTRS URL").requiredOption("--url <url>", "OTRS URL").option("--json", "Output as JSON")
  .action(async (opts) => { try { const data = await client.post("/import/otrs/url_check", { url: opts.url }); output(data, { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
otrs.command("import-check").description("Check OTRS import").requiredOption("--data <json>", "Data JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { const data = await client.post("/import/otrs/import_check", JSON.parse(opts.data)); output(data, { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
otrs.command("start").description("Start OTRS import").option("--json", "Output as JSON")
  .action(async (opts) => { try { const data = await client.post("/import/otrs/import_start"); output(data, { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
otrs.command("status").description("Get OTRS import status").option("--json", "Output as JSON")
  .action(async (opts) => { try { const data = await client.get("/import/otrs/import_status"); output(data, { json: opts.json }); } catch (err) { handleError(err, opts.json); } });

// ── Integration services ──
export const integrationExchangeResource = new Command("integration-exchange")
  .description("Microsoft Exchange integration");
integrationExchangeResource.command("config").description("Get Exchange config").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.get("/integration/exchange/index"), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationExchangeResource.command("autodiscover").description("Run Exchange autodiscovery").requiredOption("--data <json>", "Data JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/integration/exchange/autodiscover", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationExchangeResource.command("folders").description("Get Exchange folders").requiredOption("--data <json>", "Data JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/integration/exchange/folders", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationExchangeResource.command("mapping").description("Set Exchange mapping").requiredOption("--data <json>", "Data JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/integration/exchange/mapping", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationExchangeResource.command("job-start").description("Start Exchange sync").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.get("/integration/exchange/job_start"), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationExchangeResource.command("job-try").description("Try Exchange sync (dry run)").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.get("/integration/exchange/job_try"), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationExchangeResource.command("oauth-delete").description("Delete Exchange OAuth credentials").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.delete("/integration/exchange/oauth") ?? { deleted: true }, { json: opts.json }); } catch (err) { handleError(err, opts.json); } });

export const integrationGithubResource = new Command("integration-github").description("GitHub integration");
integrationGithubResource.command("query").description("Query GitHub issues").requiredOption("--links <json>", "Links JSON array").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/integration/github", { links: JSON.parse(opts.links) }), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationGithubResource.command("verify").description("Verify GitHub API").requiredOption("--endpoint <url>", "API endpoint").requiredOption("--api-token <token>", "Token").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/integration/github/verify", { endpoint: opts.endpoint, api_token: opts.apiToken }), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationGithubResource.command("update-ticket").description("Update ticket with GitHub data").requiredOption("--ticket-id <id>", "Ticket ID").requiredOption("--issue-links <json>", "Links JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/integration/github_ticket_update", { ticket_id: Number(opts.ticketId), issue_links: JSON.parse(opts.issueLinks) }), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });

export const integrationGitlabResource = new Command("integration-gitlab").description("GitLab integration");
integrationGitlabResource.command("query").description("Query GitLab issues").requiredOption("--links <json>", "Links JSON array").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/integration/gitlab", { links: JSON.parse(opts.links) }), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationGitlabResource.command("verify").description("Verify GitLab API").requiredOption("--endpoint <url>", "API endpoint").requiredOption("--api-token <token>", "Token").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/integration/gitlab/verify", { endpoint: opts.endpoint, api_token: opts.apiToken }), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });

export const integrationIdoitResource = new Command("integration-idoit").description("i-doit CMDB integration");
integrationIdoitResource.command("query").description("Query i-doit objects").requiredOption("--method <method>", "Method").option("--filter <json>", "Filter JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { const body: Record<string, unknown> = { method: opts.method }; if (opts.filter) body.filter = JSON.parse(opts.filter); output(await client.post("/integration/idoit", body), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationIdoitResource.command("verify").description("Verify i-doit connection").requiredOption("--data <json>", "Data JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/integration/idoit/verify", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });

export const integrationLdapResource = new Command("integration-ldap").description("LDAP integration");
integrationLdapResource.command("discover").description("Discover LDAP servers").requiredOption("--data <json>", "Data JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/integration/ldap/discover", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationLdapResource.command("bind").description("Test LDAP bind").requiredOption("--data <json>", "Data JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/integration/ldap/bind", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationLdapResource.command("job-start").description("Start LDAP sync").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.get("/integration/ldap/job_start"), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationLdapResource.command("job-try").description("Try LDAP sync (dry run)").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.get("/integration/ldap/job_try"), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });

export const integrationPgpResource = new Command("integration-pgp").description("PGP encryption");
integrationPgpResource.command("status").description("Get PGP status").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.get("/integration/pgp/status"), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationPgpResource.command("key").description("Get PGP key").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.get("/integration/pgp/key"), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationPgpResource.command("add-key").description("Add PGP key").requiredOption("--data <json>", "Key data JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/integration/pgp", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });

export const integrationSmimeResource = new Command("integration-smime").description("S/MIME integration");
integrationSmimeResource.command("add-cert").description("Add S/MIME certificate").requiredOption("--data <json>", "Cert data JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/integration/smime/certificate", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
integrationSmimeResource.command("add-private-key").description("Add S/MIME private key").requiredOption("--data <json>", "Key data JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/integration/smime/private_key", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });

// ── External Data Source ──
export const externalDataSourceResource = new Command("external-data-source").description("External data source");
externalDataSourceResource.command("preview").description("Preview external data source").requiredOption("--data <json>", "Config JSON").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/external_data_source/preview", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });

// ── Auth Session (signin/signout) ──
export const authSessionResource = new Command("auth-session").description("Session authentication");
authSessionResource.command("signin").description("Sign in with credentials").requiredOption("--username <user>", "Username/email").requiredOption("--password <pass>", "Password").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/signin", { username: opts.username, password: opts.password }), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
authSessionResource.command("signout").description("Sign out").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.delete("/signout") ?? { signed_out: true }, { json: opts.json }); } catch (err) { handleError(err, opts.json); } });

// ── First Steps ──
export const firstStepsResource = new Command("first-steps").description("First steps / onboarding");
firstStepsResource.command("get").description("Get first steps info").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.get("/first_steps"), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
firstStepsResource.command("test-ticket").description("Create a test ticket").option("--json", "Output as JSON")
  .action(async (opts) => { try { output(await client.post("/first_steps/test_ticket"), { json: opts.json }); } catch (err) { handleError(err, opts.json); } });
