# trollspace-mcp

MCP server for the [Trollspace API](https://api.trollefsen.com) — exposes 47 type-safe tools for managing snippets, nuggets, todos, ideas, tools, repos, travel, subscriptions, and more.

Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk), [openapi-fetch](https://openapi-ts.dev/openapi-fetch/), and TypeScript types auto-generated from the OpenAPI spec.

## Setup

### Prerequisites

- Node.js >= 18
- A Trollspace API key

### Install & Build

```bash
npm install
npm run build
```

### Configuration

Set your API key as an environment variable:

```bash
export TROLLSPACE_API_KEY="troll_usr_your_key_here"
```

### Usage with Claude Desktop

Add this to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "trollspace": {
      "command": "node",
      "args": ["/path/to/troll-mcp/dist/index.js"],
      "env": {
        "TROLLSPACE_API_KEY": "troll_usr_your_key_here"
      }
    }
  }
}
```

### Usage with Claude Code

Add to your Claude Code MCP settings:

```bash
claude mcp add trollspace -- node /path/to/troll-mcp/dist/index.js
```

Set the API key in your environment or pass it via the `env` config.

## Tools

### Snippets

Code snippets and quick references.

| Tool | Description |
|------|-------------|
| `list_snippets` | List all code snippets |
| `get_snippet` | Get a snippet by ID |
| `create_snippet` | Create a new snippet (name, description, code, language, tags) |
| `update_snippet` | Update an existing snippet |
| `delete_snippet` | Delete a snippet |

### Nuggets

Knowledge notes and insights.

| Tool | Description |
|------|-------------|
| `list_nuggets` | List all nuggets |
| `get_nugget` | Get a nugget by ID |
| `create_nugget` | Create a new nugget (name, description, content) |
| `update_nugget` | Update an existing nugget |
| `delete_nugget` | Delete a nugget |

### Todos

Task management lists.

| Tool | Description |
|------|-------------|
| `list_todos` | List all todo lists |
| `get_todo` | Get a todo list by ID |
| `create_todo` | Create a new todo list (name, description, content) |
| `update_todo` | Update an existing todo list |
| `delete_todo` | Delete a todo list |

### Ideas

Project and content ideas.

| Tool | Description |
|------|-------------|
| `list_ideas` | List all ideas |
| `get_idea` | Get an idea by ID |
| `create_idea` | Create a new idea (name, content) |
| `update_idea` | Update an existing idea |
| `delete_idea` | Delete an idea |

### Tools

Software tools and resources catalog.

| Tool | Description |
|------|-------------|
| `list_tools` | List all software tools |
| `get_tool` | Get a tool by ID |
| `create_tool` | Create a new tool entry (name, url, category, description, rating) |
| `update_tool` | Update an existing tool entry |
| `delete_tool` | Delete a tool entry |

### Repos

Git repositories and projects.

| Tool | Description |
|------|-------------|
| `list_repos` | List all repositories |
| `get_repo` | Get a repo by ID |
| `create_repo` | Create a new repo entry (title, summary, description_md, repo_url, source_type) |
| `update_repo` | Update an existing repo entry |
| `delete_repo` | Delete a repo entry |

### Travel

Travel locations and experiences.

| Tool | Description |
|------|-------------|
| `list_travel` | List travel locations (filter by status, location_type) |
| `get_travel` | Get a travel location by ID |
| `create_travel` | Add a travel location (location_id, location_type, status, dates, notes) |
| `update_travel` | Update a travel location |
| `delete_travel` | Remove a travel location |

### Countries & Cities

Read-only reference data for use with travel tools.

| Tool | Description |
|------|-------------|
| `list_countries` | List countries (search by name, filter by continent) |
| `get_country` | Get a country by ID |
| `list_cities` | List cities (search by name, filter by country_id) |
| `get_city` | Get a city by ID |

### Subscriptions

Recurring subscription management.

| Tool | Description |
|------|-------------|
| `list_subscriptions` | List subscriptions (filter by status, category, usage_type, billing_cycle) |
| `get_subscription` | Get a subscription by ID |
| `create_subscription` | Create a subscription (name, amount, currency, billing_cycle, usage_type) |
| `update_subscription` | Update a subscription |
| `delete_subscription` | Delete a subscription (payment history preserved) |
| `mark_subscription_paid` | Record a payment and advance the next billing date |
| `backfill_subscription` | Generate historical payment records for past periods |
| `list_subscription_payments` | List payments for a specific subscription |

### Subscription Payments

Payment records across all subscriptions.

| Tool | Description |
|------|-------------|
| `list_all_payments` | List all payments (filter by subscription, status, usage_type, source, date range) |
| `get_payment` | Get a payment by ID |
| `create_payment` | Create a payment record |
| `update_payment` | Update a payment record |
| `delete_payment` | Delete a payment record |

### Agent

| Tool | Description |
|------|-------------|
| `agent_query` | Send a natural language request to the Trollspace agent |

## Development

### Regenerate API types

If the OpenAPI spec changes, regenerate the TypeScript types:

```bash
npm run generate-types
```

### Project structure

```
src/
  client.ts          # Type-safe API client (openapi-fetch + generated types)
  index.ts           # MCP server entry point with all tool definitions
  types/api.d.ts     # Auto-generated OpenAPI types (do not edit)
```

## License

ISC
