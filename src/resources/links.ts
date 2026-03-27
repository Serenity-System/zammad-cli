import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const linksResource = new Command("links")
  .description("Manage links between Zammad objects (tickets, users, etc.)");

linksResource
  .command("list <object> <id>")
  .description("List links for an object (e.g. links list Ticket 1)")
  .option("--fields <fields>", "Comma-separated fields to display")
  .action(async (object, id, opts) => {
    try {
      const data = await client.get("/links", {
        link_object: object,
        link_object_value: id,
      }) as Record<string, unknown>;
      output((data.links ?? data) as Record<string, unknown>[], opts.fields);
    } catch (e) { handleError(e); }
  });

linksResource
  .command("add")
  .description("Add a link between two objects")
  .requiredOption("--source-object <type>", "Source object type (e.g. Ticket)")
  .requiredOption("--source-id <id>", "Source object ID")
  .requiredOption("--target-object <type>", "Target object type (e.g. Ticket)")
  .requiredOption("--target-id <id>", "Target object ID")
  .option("--link-type <type>", "Link type (normal, parent, child)", "normal")
  .action(async (opts) => {
    try {
      const data = await client.post("/links/add", {
        link_type: opts.linkType,
        link_object_source: opts.sourceObject,
        link_object_source_value: parseInt(opts.sourceId),
        link_object_target: opts.targetObject,
        link_object_target_value: parseInt(opts.targetId),
      });
      output(data as Record<string, unknown>);
    } catch (e) { handleError(e); }
  });

linksResource
  .command("remove")
  .description("Remove a link between two objects")
  .requiredOption("--source-object <type>", "Source object type")
  .requiredOption("--source-id <id>", "Source object ID")
  .requiredOption("--target-object <type>", "Target object type")
  .requiredOption("--target-id <id>", "Target object ID")
  .option("--link-type <type>", "Link type", "normal")
  .action(async (opts) => {
    try {
      await client.delete("/links/remove");
      console.log("Link removed.");
    } catch (e) { handleError(e); }
  });
