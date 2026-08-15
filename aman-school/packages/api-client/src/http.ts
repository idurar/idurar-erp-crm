export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken: () => string | null | undefined;
  onUnauthorized?: () => void;
}

export class HttpError extends Error {
  constructor(public status: number, public body: unknown) {
    super(`HTTP ${status}`);
  }
}

export function createHttp(config: ApiClientConfig) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = config.getAccessToken();
    const res = await fetch(`${config.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers ?? {}),
      },
    });

    if (res.status === 401) {
      config.onUnauthorized?.();
    }

    if (!res.ok) {
      let body: unknown = undefined;
      try {
        body = await res.json();
      } catch {
        /* no JSON body */
      }
      throw new HttpError(res.status, body);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  /** Multipart upload — omits the JSON Content-Type so fetch/RN sets the
   * correct multipart boundary header itself (BC-2 Excel import). */
  async function upload<T>(path: string, form: FormData): Promise<T> {
    const token = config.getAccessToken();
    const res = await fetch(`${config.baseUrl}${path}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (res.status === 401) config.onUnauthorized?.();
    if (!res.ok) {
      let body: unknown = undefined;
      try {
        body = await res.json();
      } catch {
        /* no JSON body */
      }
      throw new HttpError(res.status, body);
    }
    return (await res.json()) as T;
  }

  return {
    get: <T>(path: string) => request<T>(path, { method: "GET" }),
    post: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
    put: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
    upload,
  };
}

export type Http = ReturnType<typeof createHttp>;
