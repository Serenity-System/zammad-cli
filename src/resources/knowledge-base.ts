import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const knowledgeBaseResource = new Command("knowledge-base")
  .description("Manage knowledge base (articles, categories, permissions)");

// ── INIT / OVERVIEW ──
knowledgeBaseResource
  .command("init")
  .description("Get full knowledge base overview (all data)")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/knowledge_bases/init");
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── SHOW ──
knowledgeBaseResource
  .command("get")
  .description("Get a knowledge base by ID")
  .argument("<id>", "Knowledge base ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/knowledge_bases/${id}`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── UPDATE ──
knowledgeBaseResource
  .command("update")
  .description("Update knowledge base settings")
  .argument("<id>", "Knowledge base ID")
  .option("--color-highlight <hex>", "Highlight color")
  .option("--color-header <hex>", "Header color")
  .option("--icon <name>", "Icon name")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.colorHighlight) body.color_highlight = opts.colorHighlight;
      if (opts.colorHeader) body.color_header = opts.colorHeader;
      if (opts.icon) body.icon = opts.icon;
      const data = await client.patch(`/knowledge_bases/manage/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── SEARCH ──
knowledgeBaseResource
  .command("search")
  .description("Search knowledge base articles")
  .argument("<query>", "Search query")
  .option("--json", "Output as JSON")
  .action(async (query, opts) => {
    try {
      const data = await client.post("/knowledge_bases/search", { query });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── PERMISSIONS ──
knowledgeBaseResource
  .command("permissions")
  .description("Get permissions for a knowledge base")
  .argument("<id>", "Knowledge base ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.get(`/knowledge_bases/${id}/permissions`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

knowledgeBaseResource
  .command("set-permissions")
  .description("Update permissions for a knowledge base")
  .argument("<id>", "Knowledge base ID")
  .requiredOption("--role-id <id>", "Role ID")
  .requiredOption("--access <level>", "Access level: reader, editor, none")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      const data = await client.put(`/knowledge_bases/${id}/permissions`, {
        permissions_dialog: { role_ids: { [opts.roleId]: opts.access } },
      });
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── CATEGORIES ──
knowledgeBaseResource
  .command("category-create")
  .description("Create a category in a knowledge base")
  .argument("<kb-id>", "Knowledge base ID")
  .requiredOption("--title <title>", "Category title")
  .option("--parent-id <id>", "Parent category ID")
  .option("--json", "Output as JSON")
  .action(async (kbId, opts) => {
    try {
      const body: Record<string, unknown> = {
        translations_attributes: [{ title: opts.title, locale_id: 1 }],
      };
      if (opts.parentId) body.parent_id = Number(opts.parentId);
      const data = await client.post(`/knowledge_bases/${kbId}/categories`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

knowledgeBaseResource
  .command("category-update")
  .description("Update a category")
  .argument("<kb-id>", "Knowledge base ID")
  .argument("<cat-id>", "Category ID")
  .option("--title <title>", "New title")
  .option("--json", "Output as JSON")
  .action(async (kbId, catId, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.title) body.translations_attributes = [{ title: opts.title, locale_id: 1 }];
      const data = await client.patch(`/knowledge_bases/${kbId}/categories/${catId}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

knowledgeBaseResource
  .command("category-delete")
  .description("Delete a category")
  .argument("<kb-id>", "Knowledge base ID")
  .argument("<cat-id>", "Category ID")
  .option("--json", "Output as JSON")
  .action(async (kbId, catId, opts) => {
    try {
      await client.delete(`/knowledge_bases/${kbId}/categories/${catId}`);
      output({ deleted: true, id: catId }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

// ── ANSWERS ──
knowledgeBaseResource
  .command("answer-create")
  .description("Create an answer in a category")
  .argument("<kb-id>", "Knowledge base ID")
  .requiredOption("--category-id <id>", "Category ID")
  .requiredOption("--title <title>", "Answer title")
  .option("--body <text>", "Answer body (HTML)")
  .option("--json", "Output as JSON")
  .action(async (kbId, opts) => {
    try {
      const body: Record<string, unknown> = {
        category_id: Number(opts.categoryId),
        translations_attributes: [{
          title: opts.title,
          locale_id: 1,
          content_attributes: { body: opts.body ?? "" },
        }],
      };
      const data = await client.post(`/knowledge_bases/${kbId}/answers`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

knowledgeBaseResource
  .command("answer-update")
  .description("Update an answer")
  .argument("<kb-id>", "Knowledge base ID")
  .argument("<answer-id>", "Answer ID")
  .option("--title <title>", "New title")
  .option("--body <text>", "New body (HTML)")
  .option("--json", "Output as JSON")
  .action(async (kbId, answerId, opts) => {
    try {
      const body: Record<string, unknown> = {};
      const translation: Record<string, unknown> = { locale_id: 1 };
      if (opts.title) translation.title = opts.title;
      if (opts.body) translation.content_attributes = { body: opts.body };
      body.translations_attributes = [translation];
      const data = await client.patch(`/knowledge_bases/${kbId}/answers/${answerId}`, body);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

knowledgeBaseResource
  .command("answer-delete")
  .description("Delete an answer")
  .argument("<kb-id>", "Knowledge base ID")
  .argument("<answer-id>", "Answer ID")
  .option("--json", "Output as JSON")
  .action(async (kbId, answerId, opts) => {
    try {
      await client.delete(`/knowledge_bases/${kbId}/answers/${answerId}`);
      output({ deleted: true, id: answerId }, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

knowledgeBaseResource
  .command("answer-publish")
  .description("Publish an answer")
  .argument("<kb-id>", "Knowledge base ID")
  .argument("<answer-id>", "Answer ID")
  .option("--json", "Output as JSON")
  .action(async (kbId, answerId, opts) => {
    try {
      const data = await client.post(`/knowledge_bases/${kbId}/answers/${answerId}/publish`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });

knowledgeBaseResource
  .command("answer-archive")
  .description("Archive an answer")
  .argument("<kb-id>", "Knowledge base ID")
  .argument("<answer-id>", "Answer ID")
  .option("--json", "Output as JSON")
  .action(async (kbId, answerId, opts) => {
    try {
      const data = await client.post(`/knowledge_bases/${kbId}/answers/${answerId}/archive`);
      output(data, { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });
