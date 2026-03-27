# zammad-cli

CLI for the Zammad helpdesk API. Manage tickets, users, organizations, groups, and admin resources.

Use `zammad-cli` for all Zammad operations. Use `--json` when calling programmatically.

## Auth

```bash
zammad-cli auth set "<token>"    # Save token
zammad-cli auth test             # Verify (shows user info)
zammad-cli auth show [--raw]     # Display token
zammad-cli auth remove           # Delete token
```

Token stored at `~/.config/tokens/zammad-cli.txt` (chmod 600).

## Resources

### tickets — Support ticket management

| Command | Description | Key Flags |
|---------|-------------|-----------|
| `tickets list` | List tickets | `--per-page`, `--page`, `--expand` |
| `tickets get <id>` | Get ticket details | `--expand` |
| `tickets search "<query>"` | Search (Zammad query language) | `--sort-by`, `--order asc\|desc` |
| `tickets create` | Create ticket | `--group-id` (required), `--title` (required), `--customer-id`, `--body`, `--priority`, `--state`, `--type note\|email\|phone` |
| `tickets update <id>` | Update ticket | `--title`, `--state`, `--priority`, `--group-id`, `--owner` |
| `tickets delete <id>` | Delete ticket | |
| `tickets articles <id>` | List articles/messages | `--expand` |
| `tickets reply <id>` | Add reply/note | `--body` (required), `--type`, `--internal`, `--to`, `--subject` |
| `tickets tags <id>` | Get ticket tags | |
| `tickets tag-add <id>` | Add tag | `--tag` (required) |
| `tickets tag-remove <id>` | Remove tag | `--tag` (required) |

### users — User management

| Command | Description | Key Flags |
|---------|-------------|-----------|
| `users list` | List users | `--per-page`, `--page`, `--expand`, `--fields` |
| `users get <id>` | Get user | `--expand` |
| `users me` | Current auth user | |
| `users search "<query>"` | Search users | `--per-page`, `--expand` |
| `users create` | Create user | `--email` (required), `--firstname`, `--lastname`, `--phone`, `--organization`, `--role` |
| `users update <id>` | Update user | `--email`, `--firstname`, `--lastname`, `--active` |
| `users delete <id>` | Delete user | |

### organizations (alias: orgs) — Organization management

| Command | Description | Key Flags |
|---------|-------------|-----------|
| `orgs list` | List organizations | `--per-page`, `--expand`, `--fields` |
| `orgs get <id>` | Get organization | `--expand` |
| `orgs search "<query>"` | Search | `--per-page` |
| `orgs create` | Create | `--name` (required), `--domain`, `--shared`, `--note` |
| `orgs update <id>` | Update | `--name`, `--domain`, `--shared`, `--note` |
| `orgs delete <id>` | Delete | |

### groups — Ticket groups/pools

| Command | Description | Key Flags |
|---------|-------------|-----------|
| `groups list` | List groups | `--per-page`, `--fields` |
| `groups get <id>` | Get group | |
| `groups create` | Create | `--name` (required), `--note`, `--parent-id` |
| `groups update <id>` | Update | `--name`, `--note`, `--active` |
| `groups delete <id>` | Delete | |

### tags — Tag management

| Command | Description | Key Flags |
|---------|-------------|-----------|
| `tags list` | List all tags | |
| `tags search "<term>"` | Search tags | |
| `tags create` | Create tag | `--name` (required) |
| `tags rename` | Rename tag | `--from`, `--to` (both required) |
| `tags delete` | Delete tag | `--name` (required) |

### Admin resources (read-only)

| Resource | Commands |
|----------|----------|
| `priorities` | `list`, `get <id>` — Ticket priorities (1=low, 2=normal, 3=high) |
| `states` | `list`, `get <id>` — Ticket states (new, open, pending reminder, closed, merged, pending close) |
| `overviews` | `list`, `get <id>` — Ticket views/filters |
| `slas` | `list`, `get <id>` — SLA policies |
| `roles` | `list`, `get <id>` — User roles |
| `macros` | `list`, `get <id>` — Automated actions |
| `notifications` | `list`, `mark-read <id>`, `mark-all-read` — Online notifications |

## Output

All commands support: `--json`, `--format text|json|csv|yaml`, `--no-header`, `--no-color`, `--verbose`

JSON envelope: `{ "ok": true, "data": [...], "meta": { "total": 42 } }`

Exit codes: 0=success, 1=API error, 2=usage error

## Common Workflows

**Triage new tickets:**
```bash
zammad-cli tickets list --json | jq '.data[] | select(.state_id == 1)'
```

**Create and assign a ticket:**
```bash
zammad-cli tickets create --group-id 1 --title "Issue" --customer-id 4 --body "Description"
zammad-cli tickets update <id> --state open --owner agent@example.com
```

**Reply to a ticket:**
```bash
zammad-cli tickets reply <id> --body "Response text" --type email --to customer@example.com
```

**Internal note:**
```bash
zammad-cli tickets reply <id> --body "Internal note" --internal
```
