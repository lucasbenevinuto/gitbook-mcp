// GitBook API response types

export interface Space {
  id: string;
  title: string;
  visibility: string;
  createdAt: string;
  updatedAt: string;
  urls: {
    app: string;
    published?: string;
  };
  [key: string]: unknown;
}

export interface Page {
  id: string;
  title: string;
  kind: string;
  type: string;
  path: string;
  slug: string;
  description?: string;
  pages?: Page[];
  [key: string]: unknown;
}

export interface SpaceContent {
  id: string;
  pages: Page[];
  [key: string]: unknown;
}

export interface PageLink {
  url: string;
  title?: string;
  [key: string]: unknown;
}

export interface ContentFile {
  id: string;
  name: string;
  contentType: string;
  downloadURL: string;
  [key: string]: unknown;
}

export interface ChangeRequest {
  id: string;
  number: number;
  status: string;
  subject?: string;
  createdAt: string;
  updatedAt: string;
  urls: {
    app: string;
  };
  [key: string]: unknown;
}

export interface Review {
  id: string;
  status: string;
  comment?: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface Reviewer {
  id: string;
  [key: string]: unknown;
}

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    displayName?: string;
  };
  [key: string]: unknown;
}

export interface CommentReply {
  id: string;
  body: string;
  createdAt: string;
  author?: {
    id: string;
    displayName?: string;
  };
  [key: string]: unknown;
}

export interface GitInfo {
  url?: string;
  branch?: string;
  provider?: string;
  [key: string]: unknown;
}

export interface Organization {
  id: string;
  title: string;
  [key: string]: unknown;
}

export interface Collection {
  id: string;
  title: string;
  description?: string;
  [key: string]: unknown;
}

export interface AskAIResponse {
  answer?: string;
  [key: string]: unknown;
}

export interface SearchResult {
  id: string;
  title: string;
  path: string;
  [key: string]: unknown;
}

export interface ImportResult {
  id?: string;
  status?: string;
  [key: string]: unknown;
}

export interface PaginatedList<T> {
  items: T[];
  next?: {
    page: string;
  };
}
