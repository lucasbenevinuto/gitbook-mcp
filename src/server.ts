import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GitBookClient } from "./client/gitbook-client.js";
import { Config } from "./config.js";
import { registerAllTools } from "./tools/index.js";

export function createServer(config: Config): McpServer {
  const server = new McpServer({
    name: "gitbook-mcp",
    version: "1.0.0",
  });

  const client = new GitBookClient(config);

  registerAllTools(server, client);

  return server;
}
