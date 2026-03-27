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

// ── HISTORY ──
usersResource.command("history")
  .description("Get history for a user")
  .argument("<id>", "User ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      output(await client.get(`/users/history/${id}`), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── AVATAR ──
usersResource.command("avatar-list")
  .description("List avatars for current user")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      output(await client.get("/users/avatar"), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── OUT OF OFFICE ──
usersResource.command("out-of-office")
  .description("Set out of office for current user")
  .requiredOption("--enabled <bool>", "true or false")
  .option("--from <date>", "Start date (YYYY-MM-DD)")
  .option("--to <date>", "End date (YYYY-MM-DD)")
  .option("--replacement-id <id>", "Replacement user ID")
  .option("--text <text>", "Out of office text")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {
        out_of_office: opts.enabled === "true",
      };
      if (opts.from) body.out_of_office_start_at = opts.from;
      if (opts.to) body.out_of_office_end_at = opts.to;
      if (opts.replacementId) body.out_of_office_replacement_id = Number(opts.replacementId);
      if (opts.text) body.preferences = { out_of_office_text: opts.text };
      output(await client.put("/users/out_of_office", body), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── PREFERENCES ──
usersResource.command("preferences")
  .description("Update current user preferences")
  .requiredOption("--data <json>", "Preferences as JSON")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      output(await client.put("/users/preferences", JSON.parse(opts.data)), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── IMPORT ──
usersResource.command("import")
  .description("Import users from CSV")
  .requiredOption("--data <json>", "Import data JSON")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.post("/users/import", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("import-example")
  .description("Download CSV import example")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.get("/users/import_example"), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

// ── PASSWORD ──
usersResource.command("password-change")
  .description("Change current user password")
  .requiredOption("--current <pass>", "Current password")
  .requiredOption("--new <pass>", "New password")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.post("/users/password_change", { password_old: opts.current, password_new: opts.new }), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("password-check")
  .description("Check if a password is valid")
  .requiredOption("--password <pass>", "Password")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.post("/users/password_check", { password: opts.password }), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("password-reset")
  .description("Request a password reset")
  .requiredOption("--username <user>", "Username/email")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.post("/users/password_reset", { username: opts.username }), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("password-reset-verify")
  .description("Verify a password reset token")
  .requiredOption("--token <token>", "Reset token")
  .requiredOption("--password <pass>", "New password")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.post("/users/password_reset_verify", { token: opts.token, password: opts.password }), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

// ── AVATAR ──
usersResource.command("avatar-set")
  .description("Set user avatar")
  .requiredOption("--data <json>", "Avatar data JSON")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.post("/users/avatar/set", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

// ── TWO-FACTOR AUTH ──
usersResource.command("2fa-config")
  .description("Get personal 2FA configuration")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.get("/users/two_factor/personal_configuration"), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("2fa-methods")
  .description("Get enabled 2FA methods")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.post("/users/two_factor/enabled_authentication_methods"), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("2fa-recovery-codes")
  .description("Generate new 2FA recovery codes")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.post("/users/two_factor/recovery_codes_generate"), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("2fa-set-default")
  .description("Set default 2FA method")
  .requiredOption("--method <name>", "Method name")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.post("/users/two_factor/default_authentication_method", { method: opts.method }), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("2fa-remove")
  .description("Remove a 2FA method")
  .requiredOption("--method <name>", "Method name")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { await client.delete("/users/two_factor/remove_authentication_method?method=" + opts.method); output({ removed: true, method: opts.method }, { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("2fa-verify")
  .description("Verify 2FA configuration")
  .requiredOption("--data <json>", "Verification data JSON")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.post("/users/two_factor/verify_configuration", JSON.parse(opts.data)), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

// ── ADMIN 2FA ──
usersResource.command("admin-2fa-methods")
  .description("Get 2FA methods for a user (admin)")
  .argument("<user-id>", "User ID")
  .option("--json", "Output as JSON")
  .action(async (userId, opts) => {
    try { output(await client.get("/users/" + userId + "/admin_two_factor/enabled_authentication_methods"), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("admin-2fa-remove-all")
  .description("Remove all 2FA methods for a user (admin)")
  .argument("<user-id>", "User ID")
  .option("--json", "Output as JSON")
  .action(async (userId, opts) => {
    try { await client.delete("/users/" + userId + "/admin_two_factor/remove_all_authentication_methods"); output({ removed_all: true, user_id: userId }, { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("admin-2fa-remove")
  .description("Remove a specific 2FA method for a user (admin)")
  .argument("<user-id>", "User ID")
  .requiredOption("--method <name>", "Method name")
  .option("--json", "Output as JSON")
  .action(async (userId, opts) => {
    try { await client.delete("/users/" + userId + "/admin_two_factor/remove_authentication_method?method=" + opts.method); output({ removed: true, user_id: userId, method: opts.method }, { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

// ── EMAIL VERIFY ──
usersResource.command("email-verify")
  .description("Verify email with token")
  .requiredOption("--token <token>", "Verification token")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.post("/users/email_verify", { token: opts.token }), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("email-verify-send")
  .description("Send email verification")
  .requiredOption("--email <email>", "Email")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.post("/users/email_verify_send", { email: opts.email }), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

// ── DELETE ACCOUNT ──
usersResource.command("delete-account")
  .description("Delete the current user account")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { await client.delete("/users/account"); output({ deleted: true }, { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

// ── ADMIN PASSWORD AUTH ──
usersResource.command("admin-password-auth")
  .description("Admin password authentication")
  .requiredOption("--login <login>", "Login")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.post("/users/admin_password_auth", { login: opts.login }), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });

usersResource.command("preferences-notifications-reset")
  .description("Reset notification preferences")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try { output(await client.post("/users/preferences_notifications_reset"), { json: opts.json }); } catch (err) { handleError(err, opts.json); }
  });
