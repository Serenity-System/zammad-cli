import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const tagsResource = new Command("tags")
  .description("Manage tags");

tagsResource.command("list")
  .description("List all tags")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/tags");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

tagsResource.command("search")
  .description("Search tags by name")
  .argument("<term>", "Search term")
  .option("--json", "Output as JSON")
  .action(async (term, opts) => {
    try {
      const data = await client.get("/tag_search", { term });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

tagsResource.command("create")
  .description("Create a new tag")
  .requiredOption("--name <name>", "Tag name")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/tags/add", { item: opts.name });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

tagsResource.command("rename")
  .description("Rename a tag")
  .requiredOption("--from <name>", "Current tag name")
  .requiredOption("--to <name>", "New tag name")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.put("/tags/rename", { name: opts.from, new_name: opts.to });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

tagsResource.command("delete")
  .description("Delete a tag")
  .requiredOption("--name <name>", "Tag name")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      await client.delete(`/tags?name=${encodeURIComponent(opts.name)}`);
      output({ deleted: true, name: opts.name }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });
