import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const applicationsResource = new Command("applications")
  .description("Manage OAuth applications");

applicationsResource
  .command("list")
  .description("List OAuth applications")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      output(await client.get("/applications"), { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

applicationsResource
  .command("get")
  .description("Get an OAuth application")
  .argument("<id>", "Application ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      output(await client.get(`/applications/${id}`), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

applicationsResource
  .command("create")
  .description("Create an OAuth application")
  .requiredOption("--name <name>", "Application name")
  .requiredOption("--redirect-uri <uri>", "Redirect URI")
  .option("--confidential", "Mark as confidential client")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {
        name: opts.name,
        redirect_uri: opts.redirectUri,
      };
      if (opts.confidential) body.confidential = true;
      output(await client.post("/applications", body), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

applicationsResource
  .command("update")
  .description("Update an OAuth application")
  .argument("<id>", "Application ID")
  .option("--name <name>", "New name")
  .option("--redirect-uri <uri>", "New redirect URI")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.redirectUri) body.redirect_uri = opts.redirectUri;
      output(await client.put(`/applications/${id}`, body), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

applicationsResource
  .command("delete")
  .description("Delete an OAuth application")
  .argument("<id>", "Application ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/applications/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });
