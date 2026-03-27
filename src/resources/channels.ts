import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

// Helper to create a channel resource with enable/disable
function makeChannelResource(name: string, path: string, opts?: { hasCreate?: boolean; hasSms?: boolean }) {
  const cmd = new Command(name).description(`Manage ${name} channel`);

  cmd.command("list").description(`List ${name} channels`)
    .option("--json", "Output as JSON").option("--format <fmt>", "Output format")
    .action(async (o) => {
      try { output(await client.get(path), { json: o.json, format: o.format }); }
      catch (err) { handleError(err, o.json); }
    });

  if (opts?.hasCreate) {
    cmd.command("get").description(`Get a ${name} channel`).argument("<id>", "Channel ID")
      .option("--json", "Output as JSON")
      .action(async (id, o) => {
        try { output(await client.get(`${path}/${id}`), { json: o.json }); }
        catch (err) { handleError(err, o.json); }
      });

    cmd.command("create").description(`Create a ${name} channel`)
      .option("--data <json>", "Channel config as JSON string")
      .option("--json", "Output as JSON")
      .action(async (o) => {
        try {
          const body = o.data ? JSON.parse(o.data) : {};
          output(await client.post(path, body), { json: o.json });
        } catch (err) { handleError(err, o.json); }
      });

    cmd.command("update").description(`Update a ${name} channel`).argument("<id>", "Channel ID")
      .option("--data <json>", "Channel config as JSON string")
      .option("--json", "Output as JSON")
      .action(async (id, o) => {
        try {
          const body = o.data ? JSON.parse(o.data) : {};
          output(await client.put(`${path}/${id}`, body), { json: o.json });
        } catch (err) { handleError(err, o.json); }
      });

    cmd.command("delete").description(`Delete a ${name} channel`).argument("<id>", "Channel ID")
      .option("--json", "Output as JSON")
      .action(async (id, o) => {
        try { await client.delete(`${path}/${id}`); output({ deleted: true, id }, { json: o.json }); }
        catch (err) { handleError(err, o.json); }
      });
  }

  cmd.command("enable").description(`Enable a ${name} channel`).argument("<id>", "Channel ID")
    .option("--json", "Output as JSON")
    .action(async (id, o) => {
      try {
        const enablePath = path.includes("/admin/") ? `${path}/${id}/enable` : `${path}_enable`;
        output(await client.post(enablePath, { id: Number(id) }), { json: o.json });
      } catch (err) { handleError(err, o.json); }
    });

  cmd.command("disable").description(`Disable a ${name} channel`).argument("<id>", "Channel ID")
    .option("--json", "Output as JSON")
    .action(async (id, o) => {
      try {
        const disablePath = path.includes("/admin/") ? `${path}/${id}/disable` : `${path}_disable`;
        output(await client.post(disablePath, { id: Number(id) }), { json: o.json });
      } catch (err) { handleError(err, o.json); }
    });

  if (opts?.hasSms) {
    cmd.command("test").description("Send a test SMS")
      .requiredOption("--number <phone>", "Phone number")
      .requiredOption("--message <text>", "Message text")
      .option("--json", "Output as JSON")
      .action(async (o) => {
        try {
          output(await client.post(`${path}/test`, { number: o.number, message: o.message }), { json: o.json });
        } catch (err) { handleError(err, o.json); }
      });
  }

  return cmd;
}

export const channelsSmsResource = makeChannelResource("channels-sms", "/channels_sms", { hasCreate: true, hasSms: true });
export const channelsTelegramResource = makeChannelResource("channels-telegram", "/channels_telegram", { hasCreate: true });
export const channelsTwitterResource = makeChannelResource("channels-twitter", "/channels_twitter");
export const channelsFacebookResource = makeChannelResource("channels-facebook", "/channels_facebook");
export const channelsWhatsappResource = makeChannelResource("channels-whatsapp", "/channels/admin/whatsapp", { hasCreate: true });
export const channelsMicrosoftGraphResource = makeChannelResource("channels-ms-graph", "/channels/admin/microsoft_graph");

// Microsoft Graph extra: folders
channelsMicrosoftGraphResource
  .command("folders")
  .description("List folders for a Microsoft Graph channel")
  .argument("<id>", "Channel ID")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    try {
      output(await client.get(`/channels/admin/microsoft_graph/${id}/folders`), { json: opts.json });
    } catch (err) { handleError(err, opts.json); }
  });
