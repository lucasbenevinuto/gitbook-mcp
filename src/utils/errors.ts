export class GitBookAPIError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly statusText: string,
    public readonly body: string,
    public readonly endpoint: string
  ) {
    super(`GitBook API error ${statusCode} (${statusText}) on ${endpoint}: ${body}`);
    this.name = "GitBookAPIError";
  }
}

export function formatToolError(error: unknown): string {
  if (error instanceof GitBookAPIError) {
    return [
      `GitBook API Error (${error.statusCode}):`,
      `Endpoint: ${error.endpoint}`,
      `Message: ${error.body}`,
    ].join("\n");
  }

  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }

  return `Unknown error: ${String(error)}`;
}
