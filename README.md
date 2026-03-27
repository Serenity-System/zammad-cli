# zammad-cli

CLI for the [Zammad](https://zammad.org/) helpdesk API. Built with [api2cli](https://github.com/Melvynx/api2cli).

## Install

```bash
npx api2cli install zammad
# or clone and build
git clone https://github.com/Serenity-System/zammad-cli.git
cd zammad-cli && npm install && npx api2cli bundle zammad && npx api2cli link zammad
```

## Auth

```bash
zammad-cli auth set "<your-zammad-api-token>"
zammad-cli auth test
```

Generate a token in Zammad: Profile → Token Access → Create.

## Commands

### Tickets
```bash
zammad-cli tickets list [--per-page N] [--page N] [--expand]
zammad-cli tickets get <id> [--expand]
zammad-cli tickets search "<query>" [--sort-by field] [--order asc|desc]
zammad-cli tickets create --group-id <id> --title "..." [--customer-id <id>] [--body "..."] [--priority <id>] [--state name]
zammad-cli tickets update <id> [--title "..."] [--state name] [--priority <id>] [--owner email]
zammad-cli tickets delete <id>
zammad-cli tickets articles <ticket-id>
zammad-cli tickets reply <ticket-id> --body "..." [--type note|email|phone] [--internal]
zammad-cli tickets tags <ticket-id>
zammad-cli tickets tag-add <ticket-id> --tag "name"
zammad-cli tickets tag-remove <ticket-id> --tag "name"
```

### Users
```bash
zammad-cli users list [--per-page N] [--expand]
zammad-cli users get <id>
zammad-cli users me
zammad-cli users search "<query>"
zammad-cli users create --email "..." [--firstname "..."] [--lastname "..."]
zammad-cli users update <id> [--email "..."] [--active true|false]
zammad-cli users delete <id>
```

### Organizations
```bash
zammad-cli organizations list     # alias: zammad-cli orgs list
zammad-cli organizations get <id>
zammad-cli organizations search "<query>"
zammad-cli organizations create --name "..."
zammad-cli organizations update <id> [--name "..."]
zammad-cli organizations delete <id>
```

### Groups
```bash
zammad-cli groups list
zammad-cli groups get <id>
zammad-cli groups create --name "..."
zammad-cli groups update <id> [--name "..."] [--active true|false]
zammad-cli groups delete <id>
```

### Tags
```bash
zammad-cli tags list
zammad-cli tags search "<term>"
zammad-cli tags create --name "..."
zammad-cli tags rename --from "old" --to "new"
zammad-cli tags delete --name "..."
```

### Admin Resources
```bash
zammad-cli priorities list|get <id>
zammad-cli states list|get <id>
zammad-cli overviews list|get <id>
zammad-cli slas list|get <id>
zammad-cli roles list|get <id>
zammad-cli macros list|get <id>
zammad-cli notifications list
zammad-cli notifications mark-read <id>
zammad-cli notifications mark-all-read
```

## Output Formats

All commands support:
- `--json` — JSON envelope `{ ok: true, data: ..., meta: { total } }`
- `--format text|json|csv|yaml`
- `--no-header` — omit table headers (for piping)
- `--no-color` — disable colors
- `--verbose` — debug logging

## Exit Codes

- `0` — success
- `1` — API error
- `2` — usage error

## Token Storage

Tokens are stored at `~/.config/tokens/zammad-cli.txt` (chmod 600).

## License

MIT
