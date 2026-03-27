#!/usr/bin/env bun
import { Command } from "commander";
import { globalFlags } from "./lib/config.js";
import { authCommand } from "./commands/auth.js";
// Core resources
import { ticketsResource } from "./resources/tickets.js";
import { usersResource } from "./resources/users.js";
import { organizationsResource } from "./resources/organizations.js";
import { groupsResource } from "./resources/groups.js";
import { tagsResource } from "./resources/tags.js";
// User resources
import { userAccessTokenResource } from "./resources/user-tokens.js";
import { linksResource } from "./resources/links.js";
import { mentionsResource } from "./resources/mentions.js";
import {
  serverVersionResource,
  taskbarResource,
  recentViewResource,
  gettingStartedResource,
} from "./resources/misc.js";
// Admin - ticket config
import {
  prioritiesResource,
  statesResource,
  overviewsResource,
  slasResource,
  rolesResource,
  macrosResource,
  notificationsResource,
} from "./resources/admin.js";
// Admin - system config
import {
  settingsResource,
  triggersResource,
  webhooksResource,
  jobsResource,
  coreWorkflowsResource,
  publicLinksResource,
} from "./resources/admin-config.js";
// Admin - email
import {
  emailAddressesResource,
  signaturesResource,
  postmasterFiltersResource,
  channelsEmailResource,
  channelsMicrosoft365Resource,
  channelsGoogleResource,
} from "./resources/admin-email.js";
// Admin - objects & templates
import {
  objectAttributesResource,
  textModulesResource,
  templatesResource,
} from "./resources/admin-objects.js";
// Admin - system & monitoring
import {
  calendarsResource,
  reportProfilesResource,
  systemReportResource,
  packagesResource,
  timeAccountingsResource,
  dataPrivacyTasksResource,
  externalCredentialsResource,
  monitoringResource,
  sessionsResource,
  activityStreamResource,
  translationsResource,
  integrationsResource,
} from "./resources/admin-system.js";

const program = new Command();

program
  .name("zammad-cli")
  .description("CLI for the Zammad helpdesk API — 100% coverage")
  .version("0.3.0")
  .option("--json", "Output as JSON", false)
  .option("--format <fmt>", "Output format: text, json, csv, yaml", "text")
  .option("--verbose", "Enable debug logging", false)
  .option("--no-color", "Disable colored output")
  .option("--no-header", "Omit table/csv headers (for piping)")
  .hook("preAction", (_thisCmd, actionCmd) => {
    const root = actionCmd.optsWithGlobals();
    globalFlags.json = root.json ?? false;
    globalFlags.format = root.format ?? "text";
    globalFlags.verbose = root.verbose ?? false;
    globalFlags.noColor = root.color === false;
    globalFlags.noHeader = root.header === false;
  });

// Built-in commands
program.addCommand(authCommand);

// ── Core resources ──
program.addCommand(ticketsResource);
program.addCommand(usersResource);
program.addCommand(organizationsResource);
program.addCommand(groupsResource);
program.addCommand(tagsResource);

// ── User resources ──
program.addCommand(userAccessTokenResource);
program.addCommand(linksResource);
program.addCommand(mentionsResource);

// ── Misc / system info ──
program.addCommand(serverVersionResource);
program.addCommand(taskbarResource);
program.addCommand(recentViewResource);
program.addCommand(gettingStartedResource);

// ── Ticket config ──
program.addCommand(prioritiesResource);
program.addCommand(statesResource);
program.addCommand(overviewsResource);
program.addCommand(slasResource);
program.addCommand(rolesResource);
program.addCommand(macrosResource);
program.addCommand(notificationsResource);

// ── System config (admin) ──
program.addCommand(settingsResource);
program.addCommand(triggersResource);
program.addCommand(webhooksResource);
program.addCommand(jobsResource);
program.addCommand(coreWorkflowsResource);
program.addCommand(publicLinksResource);

// ── Email config (admin) ──
program.addCommand(emailAddressesResource);
program.addCommand(signaturesResource);
program.addCommand(postmasterFiltersResource);
program.addCommand(channelsEmailResource);
program.addCommand(channelsMicrosoft365Resource);
program.addCommand(channelsGoogleResource);

// ── Objects & templates (admin) ──
program.addCommand(objectAttributesResource);
program.addCommand(textModulesResource);
program.addCommand(templatesResource);

// ── System & monitoring (admin) ──
program.addCommand(calendarsResource);
program.addCommand(reportProfilesResource);
program.addCommand(systemReportResource);
program.addCommand(packagesResource);
program.addCommand(timeAccountingsResource);
program.addCommand(dataPrivacyTasksResource);
program.addCommand(externalCredentialsResource);
program.addCommand(monitoringResource);
program.addCommand(sessionsResource);
program.addCommand(activityStreamResource);
program.addCommand(translationsResource);
program.addCommand(integrationsResource);

program.parse();
