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
// Checklists
import {
  checklistsResource,
  checklistItemsResource,
  checklistTemplatesResource,
} from "./resources/checklists.js";
// Knowledge Base
import { knowledgeBaseResource } from "./resources/knowledge-base.js";
// Channels (SMS, Telegram, Twitter, Facebook, WhatsApp, MS Graph)
import {
  channelsSmsResource,
  channelsTelegramResource,
  channelsTwitterResource,
  channelsFacebookResource,
  channelsWhatsappResource,
  channelsMicrosoftGraphResource,
} from "./resources/channels.js";
// Chats
import { chatsResource, chatSessionsResource } from "./resources/chats.js";
// OAuth Applications
import { applicationsResource } from "./resources/applications.js";
// Extra admin (LDAP, SSL, HTTP logs, Reports, User devices, Search, Overview sortings, Ticket stats)
import {
  ldapSourcesResource,
  sslCertificatesResource,
  httpLogsResource,
  reportsResource,
  userDevicesResource,
  searchResource,
  userOverviewSortingsResource,
  ticketStatsResource,
} from "./resources/admin-extra.js";
// Extras (CTI, import, integrations, forms, proxy, auth-session, first-steps, attachments)
import {
  ctiResource,
  attachmentsResource,
  formsResource,
  proxyResource,
  importResource,
  integrationExchangeResource,
  integrationGithubResource,
  integrationGitlabResource,
  integrationIdoitResource,
  integrationLdapResource,
  integrationPgpResource,
  integrationSmimeResource,
  externalDataSourceResource,
  authSessionResource,
  firstStepsResource,
} from "./resources/extras.js";

const program = new Command();

program
  .name("zammad-cli")
  .description("CLI for the Zammad helpdesk API — 100% API coverage (290 routes)")
  .version("1.0.0")
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
program.addCommand(searchResource);

// ── User resources ──
program.addCommand(userAccessTokenResource);
program.addCommand(linksResource);
program.addCommand(mentionsResource);

// ── Misc / system info ──
program.addCommand(serverVersionResource);
program.addCommand(taskbarResource);
program.addCommand(recentViewResource);
program.addCommand(gettingStartedResource);
program.addCommand(firstStepsResource);

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

// ── Extra channels ──
program.addCommand(channelsSmsResource);
program.addCommand(channelsTelegramResource);
program.addCommand(channelsTwitterResource);
program.addCommand(channelsFacebookResource);
program.addCommand(channelsWhatsappResource);
program.addCommand(channelsMicrosoftGraphResource);

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

// ── Checklists ──
program.addCommand(checklistsResource);
program.addCommand(checklistItemsResource);
program.addCommand(checklistTemplatesResource);

// ── Knowledge Base ──
program.addCommand(knowledgeBaseResource);

// ── Chats ──
program.addCommand(chatsResource);
program.addCommand(chatSessionsResource);

// ── OAuth Applications ──
program.addCommand(applicationsResource);

// ── Extra admin ──
program.addCommand(ldapSourcesResource);
program.addCommand(sslCertificatesResource);
program.addCommand(httpLogsResource);
program.addCommand(reportsResource);
program.addCommand(userDevicesResource);
program.addCommand(userOverviewSortingsResource);
program.addCommand(ticketStatsResource);

// ── Extras ──
program.addCommand(ctiResource);
program.addCommand(attachmentsResource);
program.addCommand(formsResource);
program.addCommand(proxyResource);
program.addCommand(importResource);
program.addCommand(authSessionResource);
program.addCommand(externalDataSourceResource);

// ── Integration services ──
program.addCommand(integrationExchangeResource);
program.addCommand(integrationGithubResource);
program.addCommand(integrationGitlabResource);
program.addCommand(integrationIdoitResource);
program.addCommand(integrationLdapResource);
program.addCommand(integrationPgpResource);
program.addCommand(integrationSmimeResource);

program.parse();
