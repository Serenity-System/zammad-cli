import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const userAccessTokenResource = new Command("user-access-token")
  .description("Manage API access tokens for the current user");

userAccessTokenResource
  .command("list")
  .description("List all access tokens")
  .option("--fields <fields>", "Comma-separated fields to display")
  .action(async (opts) => {
    try {
      const data = await client.get("/user_access_token") as Record<string, unknown>;
      output((data.tokens ?? data) as Record<string, unknown>[], opts.fields);
    } catch (e) { handleError(e); }
  });

userAccessTokenResource
  .command("create <name>")
  .description("Create a new access token")
  .requiredOption("--permissions <perms>", "Comma-separated permissions (e.g. ticket.agent,admin)")
  .option("--expires <date>", "Expiration date (YYYY-MM-DD)")
  .action(async (name, opts) => {
    try {
      const body: Record<string, unknown> = {
        name,
        permission: opts.permissions.split(",").map((p: string) => p.trim()),
      };
      if (opts.expires) body.expires_at = opts.expires;
      const data = await client.post("/user_access_token", body);
      output(data as Record<string, unknown>);
    } catch (e) { handleError(e); }
  });

userAccessTokenResource
  .command("delete <id>")
  .description("Delete an access token by ID")
  .action(async (id) => {
    try {
      await client.delete(`/user_access_token/${id}`);
      console.log(`Token ${id} deleted.`);
    } catch (e) { handleError(e); }
  });
