import { defaultFetchHandler } from "../fetch";
import { AuthNamespace } from "../client/auth";
import { FilesNamespace } from "../client/files";
import { PostsNamespace } from "../client/posts";
import { TagsNamespace } from "../client/tags";
import { UsersNamespace } from "../client/users";
import type { AgentFetchHandler } from "../types";
import { NotificationsNamespace } from "./notifications";

export class BaseClient {
  fetch: AgentFetchHandler = defaultFetchHandler;

  service(serviceUri: string | URL, prefix?: string): ServiceClient {
    return new ServiceClient(this, serviceUri, prefix);
  }
}

export class ServiceClient {
  _baseClient: BaseClient;

  uri: URL;
  prefix?: string;
  app: AppNamespace;

  constructor(
    baseClient: BaseClient,
    serviceUri: string | URL,
    prefix?: string
  ) {
    this._baseClient = baseClient;
    this.uri =
      typeof serviceUri === "string" ? new URL(serviceUri) : serviceUri;
    this.prefix = prefix;
    this.app = new AppNamespace(this);
  }

  makePathname(pathname: string) {
    const prefix = this.prefix
      ? this.prefix.startsWith("/")
        ? this.prefix
        : `/${this.prefix}`
      : "";
    const pathnamePrefix = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return `${prefix}${pathnamePrefix}`;
  }
}

export class AppNamespace {
  _service: ServiceClient;
  auth: AuthNamespace;
  files: FilesNamespace;
  posts: PostsNamespace;
  tags: TagsNamespace;
  users: UsersNamespace;
  notifications: NotificationsNamespace;

  constructor(service: ServiceClient) {
    this._service = service;
    this.auth = new AuthNamespace(service);
    this.files = new FilesNamespace(service);
    this.posts = new PostsNamespace(service);
    this.tags = new TagsNamespace(service);
    this.users = new UsersNamespace(service);
    this.notifications = new NotificationsNamespace(service);
  }
}
