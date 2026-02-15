import { Config } from "../config.js";
import { GitBookAPIError } from "../utils/errors.js";
import type {
  Space,
  Page,
  SpaceContent,
  PageLink,
  ContentFile,
  ChangeRequest,
  Review,
  Reviewer,
  Comment,
  CommentReply,
  GitInfo,
  Organization,
  Collection,
  AskAIResponse,
  SearchResult,
  ImportResult,
  PaginatedList,
} from "./types.js";

export class GitBookClient {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(config: Config) {
    this.baseUrl = config.baseUrl;
    this.token = config.apiToken;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    query?: URLSearchParams
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;
    if (query && query.toString()) {
      url += `?${query.toString()}`;
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = { method, headers };
    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const text = await response.text();
      throw new GitBookAPIError(response.status, response.statusText, text, `${method} ${path}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    return (await response.text()) as unknown as T;
  }

  // ── Spaces ──

  async getSpace(spaceId: string): Promise<Space> {
    return this.request<Space>("GET", `/spaces/${spaceId}`);
  }

  async updateSpace(spaceId: string, data: Record<string, unknown>): Promise<Space> {
    return this.request<Space>("PATCH", `/spaces/${spaceId}`, data);
  }

  async createSpace(orgId: string, data: Record<string, unknown>): Promise<Space> {
    return this.request<Space>("POST", `/orgs/${orgId}/spaces`, data);
  }

  async duplicateSpace(spaceId: string): Promise<Space> {
    return this.request<Space>("POST", `/spaces/${spaceId}/duplicate`);
  }

  async listSpaces(orgId: string, query?: URLSearchParams): Promise<PaginatedList<Space>> {
    return this.request<PaginatedList<Space>>("GET", `/orgs/${orgId}/spaces`, undefined, query);
  }

  async searchSpaceContent(
    spaceId: string,
    searchQuery: string,
    query?: URLSearchParams
  ): Promise<PaginatedList<SearchResult>> {
    const params = query || new URLSearchParams();
    params.set("query", searchQuery);
    return this.request<PaginatedList<SearchResult>>(
      "GET",
      `/spaces/${spaceId}/search`,
      undefined,
      params
    );
  }

  // ── Pages ──

  private contentBasePath(spaceId: string, changeRequestId?: string): string {
    if (changeRequestId) {
      return `/spaces/${spaceId}/change-requests/${changeRequestId}/content`;
    }
    return `/spaces/${spaceId}/content`;
  }

  async getSpaceRevision(spaceId: string, changeRequestId?: string): Promise<SpaceContent> {
    const base = this.contentBasePath(spaceId, changeRequestId);
    return this.request<SpaceContent>("GET", base);
  }

  async listPages(
    spaceId: string,
    changeRequestId?: string,
    query?: URLSearchParams
  ): Promise<PaginatedList<Page>> {
    const base = this.contentBasePath(spaceId, changeRequestId);
    return this.request<PaginatedList<Page>>("GET", `${base}/pages`, undefined, query);
  }

  async getPageById(spaceId: string, pageId: string, changeRequestId?: string): Promise<Page> {
    const base = this.contentBasePath(spaceId, changeRequestId);
    return this.request<Page>("GET", `${base}/page/${pageId}`);
  }

  async getPageByPath(spaceId: string, pagePath: string, changeRequestId?: string): Promise<Page> {
    const base = this.contentBasePath(spaceId, changeRequestId);
    return this.request<Page>("GET", `${base}/path/${pagePath}`);
  }

  async getPageLinks(
    spaceId: string,
    pageId: string,
    changeRequestId?: string
  ): Promise<PageLink[]> {
    const base = this.contentBasePath(spaceId, changeRequestId);
    const result = await this.request<{ links: PageLink[] }>(
      "GET",
      `${base}/page/${pageId}/links`
    );
    return result.links || [];
  }

  async getPageBacklinks(
    spaceId: string,
    pageId: string,
    changeRequestId?: string
  ): Promise<PageLink[]> {
    const base = this.contentBasePath(spaceId, changeRequestId);
    const result = await this.request<{ backlinks: PageLink[] }>(
      "GET",
      `${base}/page/${pageId}/backlinks`
    );
    return result.backlinks || [];
  }

  async listFiles(
    spaceId: string,
    changeRequestId?: string,
    query?: URLSearchParams
  ): Promise<PaginatedList<ContentFile>> {
    const base = this.contentBasePath(spaceId, changeRequestId);
    return this.request<PaginatedList<ContentFile>>("GET", `${base}/files`, undefined, query);
  }

  async getFile(spaceId: string, fileId: string, changeRequestId?: string): Promise<ContentFile> {
    const base = this.contentBasePath(spaceId, changeRequestId);
    return this.request<ContentFile>("GET", `${base}/files/${fileId}`);
  }

  // ── Change Requests ──

  async createChangeRequest(
    spaceId: string,
    data: { subject?: string }
  ): Promise<ChangeRequest> {
    return this.request<ChangeRequest>("POST", `/spaces/${spaceId}/change-requests`, data);
  }

  async listChangeRequests(
    spaceId: string,
    query?: URLSearchParams
  ): Promise<PaginatedList<ChangeRequest>> {
    return this.request<PaginatedList<ChangeRequest>>(
      "GET",
      `/spaces/${spaceId}/change-requests`,
      undefined,
      query
    );
  }

  async getChangeRequest(spaceId: string, changeRequestId: string): Promise<ChangeRequest> {
    return this.request<ChangeRequest>(
      "GET",
      `/spaces/${spaceId}/change-requests/${changeRequestId}`
    );
  }

  async updateChangeRequest(
    spaceId: string,
    changeRequestId: string,
    data: Record<string, unknown>
  ): Promise<ChangeRequest> {
    return this.request<ChangeRequest>(
      "PATCH",
      `/spaces/${spaceId}/change-requests/${changeRequestId}`,
      data
    );
  }

  async mergeChangeRequest(
    spaceId: string,
    changeRequestId: string
  ): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>(
      "POST",
      `/spaces/${spaceId}/change-requests/${changeRequestId}/merge`
    );
  }

  async syncChangeRequest(
    spaceId: string,
    changeRequestId: string
  ): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>(
      "POST",
      `/spaces/${spaceId}/change-requests/${changeRequestId}/update`
    );
  }

  // ── Reviews ──

  async listReviews(
    spaceId: string,
    changeRequestId: string,
    query?: URLSearchParams
  ): Promise<PaginatedList<Review>> {
    return this.request<PaginatedList<Review>>(
      "GET",
      `/spaces/${spaceId}/change-requests/${changeRequestId}/reviews`,
      undefined,
      query
    );
  }

  async submitReview(
    spaceId: string,
    changeRequestId: string,
    data: { status: string; comment?: string }
  ): Promise<Review> {
    return this.request<Review>(
      "POST",
      `/spaces/${spaceId}/change-requests/${changeRequestId}/reviews`,
      data
    );
  }

  async listRequestedReviewers(
    spaceId: string,
    changeRequestId: string
  ): Promise<Reviewer[]> {
    const result = await this.request<{ items?: Reviewer[] }>(
      "GET",
      `/spaces/${spaceId}/change-requests/${changeRequestId}/requested-reviewers`
    );
    return result.items || [];
  }

  async requestReviewers(
    spaceId: string,
    changeRequestId: string,
    userIds: string[]
  ): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>(
      "POST",
      `/spaces/${spaceId}/change-requests/${changeRequestId}/requested-reviewers`,
      { users: userIds }
    );
  }

  async removeReviewer(
    spaceId: string,
    changeRequestId: string,
    userId: string
  ): Promise<void> {
    await this.request<void>(
      "DELETE",
      `/spaces/${spaceId}/change-requests/${changeRequestId}/requested-reviewers/${userId}`
    );
  }

  // ── Comments (dual-scope: space or change request) ──

  private commentsBasePath(spaceId: string, changeRequestId?: string): string {
    if (changeRequestId) {
      return `/spaces/${spaceId}/change-requests/${changeRequestId}/comments`;
    }
    return `/spaces/${spaceId}/comments`;
  }

  async listComments(
    spaceId: string,
    changeRequestId?: string,
    query?: URLSearchParams
  ): Promise<PaginatedList<Comment>> {
    const path = this.commentsBasePath(spaceId, changeRequestId);
    return this.request<PaginatedList<Comment>>("GET", path, undefined, query);
  }

  async postComment(
    spaceId: string,
    data: { body: string; [key: string]: unknown },
    changeRequestId?: string
  ): Promise<Comment> {
    const path = this.commentsBasePath(spaceId, changeRequestId);
    return this.request<Comment>("POST", path, data);
  }

  async updateComment(
    spaceId: string,
    commentId: string,
    data: { body: string },
    changeRequestId?: string
  ): Promise<Comment> {
    const path = this.commentsBasePath(spaceId, changeRequestId);
    return this.request<Comment>("PUT", `${path}/${commentId}`, data);
  }

  async deleteComment(
    spaceId: string,
    commentId: string,
    changeRequestId?: string
  ): Promise<void> {
    const path = this.commentsBasePath(spaceId, changeRequestId);
    await this.request<void>("DELETE", `${path}/${commentId}`);
  }

  async listCommentReplies(
    spaceId: string,
    commentId: string,
    changeRequestId?: string,
    query?: URLSearchParams
  ): Promise<PaginatedList<CommentReply>> {
    const path = this.commentsBasePath(spaceId, changeRequestId);
    return this.request<PaginatedList<CommentReply>>(
      "GET",
      `${path}/${commentId}/replies`,
      undefined,
      query
    );
  }

  async postCommentReply(
    spaceId: string,
    commentId: string,
    data: { body: string },
    changeRequestId?: string
  ): Promise<CommentReply> {
    const path = this.commentsBasePath(spaceId, changeRequestId);
    return this.request<CommentReply>("POST", `${path}/${commentId}/replies`, data);
  }

  // ── Git Sync ──

  async gitImport(
    spaceId: string,
    data: { url: string; [key: string]: unknown }
  ): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>("POST", `/spaces/${spaceId}/git/import`, data);
  }

  async gitExport(
    spaceId: string,
    data: { url: string; [key: string]: unknown }
  ): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>("POST", `/spaces/${spaceId}/git/export`, data);
  }

  async getGitInfo(spaceId: string): Promise<GitInfo> {
    return this.request<GitInfo>("GET", `/spaces/${spaceId}/git/info`);
  }

  // ── Organizations ──

  async getOrganization(orgId: string): Promise<Organization> {
    return this.request<Organization>("GET", `/orgs/${orgId}`);
  }

  async listCollections(
    orgId: string,
    query?: URLSearchParams
  ): Promise<PaginatedList<Collection>> {
    return this.request<PaginatedList<Collection>>(
      "GET",
      `/orgs/${orgId}/collections`,
      undefined,
      query
    );
  }

  async getCollection(orgId: string, collectionId: string): Promise<Collection> {
    return this.request<Collection>("GET", `/orgs/${orgId}/collections/${collectionId}`);
  }

  async askAI(
    orgId: string,
    data: { query: string; [key: string]: unknown }
  ): Promise<AskAIResponse> {
    return this.request<AskAIResponse>("POST", `/orgs/${orgId}/ask`, data);
  }

  // ── Content Import ──

  async importContent(
    orgId: string,
    data: { url?: string; [key: string]: unknown }
  ): Promise<ImportResult> {
    return this.request<ImportResult>("POST", `/orgs/${orgId}/imports`, data);
  }
}
