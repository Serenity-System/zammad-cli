#!/usr/bin/env bun
import { Command } from "commander";
import { globalFlags } from "./lib/config.js";
import { authCommand } from "./commands/auth.js";
import { ticketsResource } from "./resources/tickets.js";
import { usersResource } from "./resources/users.js";
import { organizationsResource } from "./resources/organizations.js";
import { groupsResource } from "./resources/groups.js";
import { tagsResource } from "./resources/tags.js";
import {
  prioritiesResource,
  statesResource,
  overviewsResource,
  slasResource,
  rolesResource,
  macrosResource,
  notificationsResource,
} from "./resources/admin.js";

const program = new Command();

program
  .name("zammad-cli")
  .description("CLI for the Zammad helpdesk API")
  .version("0.1.0")
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

// Core resources
program.addCommand(ticketsResource);
program.addCommand(usersResource);
program.addCommand(organizationsResource);
program.addCommand(groupsResource);
program.addCommand(tagsResource);

// Admin resources
program.addCommand(prioritiesResource);
program.addCommand(statesResource);
program.addCommand(overviewsResource);
program.addCommand(slasResource);
program.addCommand(rolesResource);
program.addCommand(macrosResource);
program.addCommand(notificationsResource);

program.parse();
