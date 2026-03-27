import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const usersResource = new Command("users")
  .description("Manage users");

usersResource.command("list")
  .description("List users")
  .option("--per-page <n>", "Results per page", "20")
  .option("--page <n>", "Page number", "1")
  .option("--expand", "Include expanded data")
  .option("--fields <cols>", "Comma-separated columns")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const params: Record<string, string> = { per_page: opts.perPage, page: opts.page };
      if (opts.expand) params.expand = "true";
      const data = await client.get("/users", params);
      output(data, { json: opts.json, format: opts.format, fields: opts.fields?.split(",") });
    } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("search")
  .description("Search users")
  .argument("<query>", "Search query")
  .option("--per-page <n>", "Results per page", "20")
  .option("--page <n>", "Page number", "1")
  .option("--expand", "Include expanded data")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (query, opts) => {
    try {
      const params: Record<string, string> = { query, per_page: opts.perPage, page: opts.page };
      if (opts.expand) params.expand = "true";
      const data = await client.get("/users/search", params);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("get")
  .description("Get a user by ID")
  .argument("<id>", "User ID")
  .option("--expand", "Include expanded data")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (id, opts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.expand) params.expand = "true";
      const data = await client.get(`/users/${id}`, params);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("me")
  .description("Get current authenticated user")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (opts) => {
    try {
      const data = await client.get("/users/me");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("create")
  .description("Create a new user")
  .requiredOption("--email <email>", "User email")
  .option("--firstname <name>", "First name")
  .option("--lastname <name>", "Last name")
  .option("--phone <phone>", "Phone number")
  .option("--organization <name>", "Organization name or ID")
  .option("--role <role>", "Role: Customer, Agent, Admin")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = { email: opts.email };
      if (opts.firstname) body.firstname = opts.firstname;
      if (opts.lastname) body.lastname = opts.lastname;
      if (opts.phone) body.phone = opts.phone;
      if (opts.organization) body.organization = opts.organization;
      if (opts.role) body.roles = [opts.role];
      const data = await client.post("/users", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("update")
  .description("Update a user")
  .argument("<id>", "User ID")
  .option("--email <email>", "New email")
  .option("--firstname <name>", "New first name")
  .option("--lastname <name>", "New last name")
  .option("--phone <phone>", "New phone")
  .option("--active <bool>", "Active status: true/false")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.email) body.email = opts.email;
      if (opts.firstname) body.firstname = opts.firstname;
      if (opts.lastname) body.lastname = opts.lastname;
      if (opts.phone) body.phone = opts.phone;
      if (opts.active !== undefined) body.active = opts.active === "true";
      const data = await client.put(`/users/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("delete")
  .description("Delete a user")
  .argument("<id>", "User ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/users/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });
