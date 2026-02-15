export interface Config {
  apiToken: string;
  baseUrl: string;
  defaultSpaceId?: string;
  defaultOrgId?: string;
}

export function loadConfig(): Config {
  const apiToken = process.env.GITBOOK_API_TOKEN;
  if (!apiToken) {
    throw new Error(
      "GITBOOK_API_TOKEN environment variable is required. " +
        "Get your token at https://app.gitbook.com/account/developer"
    );
  }

  return {
    apiToken,
    baseUrl: process.env.GITBOOK_API_BASE_URL || "https://api.gitbook.com/v1",
    defaultSpaceId: process.env.GITBOOK_DEFAULT_SPACE_ID || undefined,
    defaultOrgId: process.env.GITBOOK_DEFAULT_ORG_ID || undefined,
  };
}
