import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const ticketsResource = new Command("tickets")
  .description("Manage support tickets");

// ── LIST ──
ticketsResource
  .command("list")
  .description("List tickets")
  .option("--per-page <n>", "Results per page", "20")
  .option("--page <n>", "Page number", "1")
  .option("--expand", "Include expanded data (group, user, org names)")
  .option("--fields <cols>", "Comma-separated columns")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (opts) => {
    try {
      const params: Record<string, string> = {
        per_page: opts.perPage,
        page: opts.page,
      };
      if (opts.expand) params.expand = "true";
      const data = await client.get("/tickets", params);
      output(data, { json: opts.json, format: opts.format, fields: opts.fields?.split(",") });
    } catch (err) { handleError(err, opts.json); }
  });

// ── SEARCH ──
ticketsResource
  .command("search")
  .description("Search tickets")
  .argument("<query>", "Search query (Zammad query language)")
  .option("--per-page <n>", "Results per page", "20")
  .option("--page <n>", "Page number", "1")
  .option("--sort-by <field>", "Sort field")
  .option("--order <dir>", "Sort order: asc or desc")
  .option("--expand", "Include expanded data")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (query, opts) => {
    try {
      const params: Record<string, string> = {
        query,
        per_page: opts.perPage,
        page: opts.page,
      };
      if (opts.sortBy) params.sort_by = opts.sortBy;
      if (opts.order) params.order_by = opts.order;
      if (opts.expand) params.expand = "true";
      const data = await client.get("/tickets/search", params);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

// ── GET ──
ticketsResource
  .command("get")
  .description("Get a ticket by ID")
  .argument("<id>", "Ticket ID")
  .option("--expand", "Include expanded data")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (id, opts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.expand) params.expand = "true";
      const data = await client.get(`/tickets/${id}`, params);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

// ── CREATE ──
ticketsResource
  .command("create")
  .description("Create a new ticket")
  .requiredOption("--title <title>", "Ticket title")
  .requiredOption("--group-id <id>", "Group ID (see: zammad-cli groups list)")
  .option("--customer-id <id>", "Customer ID (see: zammad-cli users list)")
  .option("--priority <id>", "Priority ID (1=low, 2=normal, 3=high)")
  .option("--state <name>", "State name (new, open, closed, etc.)")
  .option("--body <text>", "Initial article body")
  .option("--type <type>", "Article type: note, email, phone (default: note)")
  .option("--tags <tags>", "Comma-separated tags")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {
        title: opts.title,
        group_id: Number(opts.groupId),
      };
      if (opts.customerId) body.customer_id = Number(opts.customerId);
      if (opts.priority) body.priority_id = Number(opts.priority);
      if (opts.state) body.state = opts.state;
      if (opts.tags) body.tags = opts.tags;
      if (opts.body) {
        body.article = {
          body: opts.body,
          type: opts.type ?? "note",
          internal: false,
        };
      }
      const data = await client.post("/tickets", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── UPDATE ──
ticketsResource
  .command("update")
  .description("Update a ticket")
  .argument("<id>", "Ticket ID")
  .option("--title <title>", "New title")
  .option("--group-id <id>", "New group ID")
  .option("--state <name>", "New state (open, closed, etc.)")
  .option("--priority <id>", "New priority ID")
  .option("--owner <email>", "New owner email or ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.title) body.title = opts.title;
      if (opts.groupId) body.group_id = Number(opts.groupId);
      if (opts.state) body.state = opts.state;
      if (opts.priority) body.priority_id = Number(opts.priority);
      if (opts.owner) body.owner = opts.owner;
      const data = await client.put(`/tickets/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── DELETE ──
ticketsResource
  .command("delete")
  .description("Delete a ticket")
  .argument("<id>", "Ticket ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      await client.delete(`/tickets/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── ARTICLES ──
ticketsResource
  .command("articles")
  .description("List articles (messages) for a ticket")
  .argument("<ticket-id>", "Ticket ID")
  .option("--expand", "Include expanded data")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format")
  .action(async (ticketId, opts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.expand) params.expand = "true";
      const data = await client.get(`/ticket_articles/by_ticket/${ticketId}`, params);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) { handleError(err, opts.json); }
  });

// ── REPLY ──
ticketsResource
  .command("reply")
  .description("Add a reply/note to a ticket")
  .argument("<ticket-id>", "Ticket ID")
  .requiredOption("--body <text>", "Article body")
  .option("--type <type>", "Article type: note, email, phone", "note")
  .option("--internal", "Mark as internal note")
  .option("--to <email>", "Recipient email (for email type)")
  .option("--subject <subj>", "Subject line (for email type)")
  .option("--json", "Output as JSON")
  .action(async (ticketId, opts) => {
    try {
      const body: Record<string, unknown> = {
        ticket_id: Number(ticketId),
        body: opts.body,
        type: opts.type,
        internal: opts.internal ?? false,
      };
      if (opts.to) body.to = opts.to;
      if (opts.subject) body.subject = opts.subject;
      const data = await client.post("/ticket_articles", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── TAGS ──
ticketsResource
  .command("tags")
  .description("Get tags for a ticket")
  .argument("<ticket-id>", "Ticket ID")
  .option("--json", "Output as JSON")
  .action(async (ticketId, opts) => {
    try {
      const data = await client.get("/tags", { object: "Ticket", o_id: ticketId });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── TAG ADD ──
ticketsResource
  .command("tag-add")
  .description("Add a tag to a ticket")
  .argument("<ticket-id>", "Ticket ID")
  .requiredOption("--tag <name>", "Tag name")
  .option("--json", "Output as JSON")
  .action(async (ticketId, opts) => {
    try {
      const data = await client.post("/tags/add", {
        object: "Ticket",
        o_id: Number(ticketId),
        item: opts.tag,
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── TAG REMOVE ──
ticketsResource
  .command("tag-remove")
  .description("Remove a tag from a ticket")
  .argument("<ticket-id>", "Ticket ID")
  .requiredOption("--tag <name>", "Tag name")
  .option("--json", "Output as JSON")
  .action(async (ticketId, opts) => {
    try {
      await client.delete(`/tags/remove?object=Ticket&o_id=${ticketId}&item=${opts.tag}`);
      output({ removed: true, tag: opts.tag }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── MASS UPDATE ──
ticketsResource
  .command("mass-update")
  .description("Update multiple tickets at once")
  .requiredOption("--ids <ids>", "Comma-separated ticket IDs")
  .option("--state <name>", "New state for all tickets")
  .option("--priority <id>", "New priority ID for all tickets")
  .option("--group-id <id>", "New group ID for all tickets")
  .option("--owner-id <id>", "New owner ID for all tickets")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {
        ticket_ids: opts.ids.split(",").map(Number),
        attributes: {} as Record<string, unknown>,
      };
      const attrs = body.attributes as Record<string, unknown>;
      if (opts.state) attrs.state = opts.state;
      if (opts.priority) attrs.priority_id = Number(opts.priority);
      if (opts.groupId) attrs.group_id = Number(opts.groupId);
      if (opts.ownerId) attrs.owner_id = Number(opts.ownerId);
      const data = await client.post("/tickets/mass_update", body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── MASS MACRO ──
ticketsResource
  .command("mass-macro")
  .description("Apply a macro to multiple tickets")
  .requiredOption("--ids <ids>", "Comma-separated ticket IDs")
  .requiredOption("--macro-id <id>", "Macro ID to apply")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/tickets/mass_macro", {
        ticket_ids: opts.ids.split(",").map(Number),
        macro_id: Number(opts.macroId),
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── SPLIT ──
ticketsResource
  .command("split")
  .description("Get ticket split data")
  .argument("<ticket-id>", "Ticket ID")
  .argument("<article-id>", "Article ID")
  .option("--json", "Output as JSON")
  .action(async (ticketId, articleId, opts) => {
    try {
      const data = await client.get("/ticket_split", { ticket_id: ticketId, article_id: articleId });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

ticketsResource
  .command("overview")
  .description("Get ticket overview data")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.get("/ticket_overviews");
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

ticketsResource
  .command("recent")
  .description("Get recently viewed tickets")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.get("/ticket_recent");
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });
