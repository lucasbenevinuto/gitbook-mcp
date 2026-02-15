# gitbook-mcp

MCP Server for full GitBook API automation. Exposes **39 tools** that allow AI agents (Claude Code, Cursor, etc.) to manage documentation, change requests, reviews, and Git Sync programmatically.

## Quickstart

```bash
# 1. Clone
git clone <your-repo-url>
cd gitbook-mcp

# 2. Install and build
npm install
npm run build

# 3. Configure
cp .env.example .env
# Edit .env with your token (see "Configuration" below)

# 4. Run
npm start
```

## Configuration

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `GITBOOK_API_TOKEN` | Yes | GitBook API token |
| `GITBOOK_DEFAULT_ORG_ID` | No | Default organization ID |
| `GITBOOK_DEFAULT_SPACE_ID` | No | Default space ID |
| `GITBOOK_API_BASE_URL` | No | API base URL (default: `https://api.gitbook.com/v1`) |

### Get your token

1. Go to [GitBook Developer Settings](https://app.gitbook.com/account/developer)
2. Create a new API Token
3. Copy the token to your `.env`

### `.env` example

```env
GITBOOK_API_TOKEN=gb_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITBOOK_DEFAULT_SPACE_ID=
GITBOOK_DEFAULT_ORG_ID=
```

## AI Agent Integration

### Claude Code

Add to `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "gitbook": {
      "command": "node",
      "args": ["/path/to/gitbook-mcp/dist/index.js"],
      "env": {
        "GITBOOK_API_TOKEN": "${GITBOOK_API_TOKEN}",
        "GITBOOK_DEFAULT_ORG_ID": ""
      }
    }
  }
}
```

Claude Code resolves `${GITBOOK_API_TOKEN}` from shell environment variables. Add to your `~/.bashrc` or `~/.zshrc`:

```bash
export GITBOOK_API_TOKEN="your-token-here"
```

### Cursor

Add to `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project):

```json
{
  "mcpServers": {
    "gitbook": {
      "command": "node",
      "args": ["/path/to/gitbook-mcp/dist/index.js"],
      "env": {
        "GITBOOK_API_TOKEN": "your-token-here",
        "GITBOOK_DEFAULT_ORG_ID": ""
      }
    }
  }
}
```

> In Cursor, `${VAR}` interpolation is not supported. Place the token directly in the JSON.

### Other MCP clients

Any client compatible with MCP via **stdio transport** will work. The server reads stdin/stdout following the MCP protocol.

## Tools

### Spaces (6)

| Tool | Description |
|---|---|
| `get_space` | Get space details |
| `update_space` | Update title, visibility |
| `create_space` | Create new space in an org |
| `duplicate_space` | Duplicate an existing space |
| `list_spaces` | List spaces in an org |
| `search_space_content` | Search content within a space |

### Pages (8)

| Tool | Description |
|---|---|
| `get_space_revision` | Full page tree of a space |
| `list_pages` | List pages (with pagination) |
| `get_page_by_id` | Read page by ID |
| `get_page_by_path` | Read page by URL path (e.g., `getting-started/install`) |
| `get_page_links` | Outgoing links from a page |
| `get_page_backlinks` | Pages linking to a page (backlinks) |
| `list_files` | List files (images, attachments) |
| `get_file` | File details and download URL |

### Change Requests (6)

| Tool | Description |
|---|---|
| `create_change_request` | Create new CR (similar to PR/draft) |
| `list_change_requests` | List CRs of a space |
| `get_change_request` | CR details |
| `update_change_request` | Update CR title/status |
| `merge_change_request` | Merge CR into main content |
| `sync_change_request` | Sync CR with latest content |

### Reviews (5)

| Tool | Description |
|---|---|
| `list_reviews` | List reviews of a CR |
| `submit_review` | Approve, request changes, or comment |
| `list_requested_reviewers` | List requested reviewers |
| `request_reviewers` | Request review from specific users |
| `remove_reviewer` | Remove reviewer from a CR |

### Comments (6)

| Tool | Description |
|---|---|
| `list_comments` | List comments (space or CR) |
| `post_comment` | Post comment (supports markdown) |
| `update_comment` | Edit existing comment |
| `delete_comment` | Delete comment |
| `list_comment_replies` | List replies to a comment |
| `post_comment_reply` | Reply to a comment |

### Git Sync (3)

| Tool | Description |
|---|---|
| `git_import` | Import content from a Git repo to a space |
| `git_export` | Export content from a space to a Git repo |
| `get_git_info` | Git Sync status and configuration |

### Organizations (4)

| Tool | Description |
|---|---|
| `get_organization` | Organization details |
| `list_collections` | List collections in an org |
| `get_collection` | Collection details |
| `ask_ai` | Ask GitBook AI about the documentation |

### Content Import (1)

| Tool | Description |
|---|---|
| `import_content` | Import content from a URL into the org |

## Architecture

```
src/
├── index.ts                 # Entrypoint — stdio transport
├── server.ts                # McpServer creation
├── config.ts                # Environment variable loading
├── client/
│   ├── gitbook-client.ts    # HTTP client for GitBook API v1
│   └── types.ts             # API response types
├── tools/
│   ├── index.ts             # Registration of all 39 tools
│   ├── spaces.ts            # 6 tools
│   ├── pages.ts             # 8 tools
│   ├── change-requests.ts   # 6 tools
│   ├── reviews.ts           # 5 tools
│   ├── comments.ts          # 6 tools
│   ├── git-sync.ts          # 3 tools
│   ├── organizations.ts     # 4 tools
│   └── content-import.ts    # 1 tool
├── schemas/
│   └── index.ts             # Reusable Zod schemas
└── utils/
    ├── errors.ts            # API error handling
    └── pagination.ts        # Pagination helpers
```

## Scripts

| Command | Description |
|---|---|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Start MCP server via stdio |
| `npm run dev` | Compile in watch mode (development) |
| `npm run inspect` | Open MCP Inspector for debugging |

## Requirements

- Node.js >= 18.0.0
- npm

## Dependencies

| Package | Version | Usage |
|---|---|---|
| `@modelcontextprotocol/sdk` | ^1.12.0 | Official MCP SDK |
| `zod` | ^3.24.0 | Schema validation |
| `typescript` | ^5.7.0 | (dev) Compilation |

## Debug

### MCP Inspector

```bash
npm run inspect
```

Opens a web interface to test tools interactively.

### Error logs

The server sends formatted errors back to the MCP client. GitBook API errors include:
- HTTP status code
- Failed endpoint
- GitBook error message

### Common issues

| Problem | Solution |
|---|---|
| `GITBOOK_API_TOKEN is required` | Set the environment variable or create the `.env` file |
| `GitBook API error 401` | Invalid or expired token — generate a new one |
| `GitBook API error 403` | Token lacks permission for the resource |
| `GitBook API error 404` | Incorrect space/page/org ID |
| `Cannot find module dist/index.js` | Run `npm run build` first |

## Update

```bash
cd ~/gitbook-mcp
git pull
npm install
npm run build
```

## License

MIT
