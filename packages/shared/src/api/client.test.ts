import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApiClient } from './client';
import { ApiError } from './error';

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const client = () =>
  createApiClient({
    baseURL: 'https://api.test/api/v1',
    getAuthHeaders: () => ({ ACCESS_TOKEN: 'tok' }),
    onUnauthorized: onUnauthorized,
  });

const onUnauthorized = vi.fn();

afterEach(() => {
  vi.restoreAllMocks();
  onUnauthorized.mockReset();
});

describe('createApiClient', () => {
  it('sends auth headers and returns parsed JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, { service: { id: 1 } }));
    vi.stubGlobal('fetch', fetchMock);

    const data = await client().get<{ service: { id: number } }>('/service/1');
    expect(data.service.id).toBe(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.test/api/v1/service/1');
    expect((init.headers as Record<string, string>).ACCESS_TOKEN).toBe('tok');
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
  });

  it('serializes the body on POST', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    vi.stubGlobal('fetch', fetchMock);

    await client().post('/service', { org: 'x' });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify({ org: 'x' }));
  });

  it('appends query params', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    vi.stubGlobal('fetch', fetchMock);

    await client().get('/provision/connections', { query: { router: 'r1', since: undefined } });
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://api.test/api/v1/provision/connections?router=r1',
    );
  });

  it('throws ApiError with the server message on non-2xx', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(400, { error: 'bad input' })));
    await expect(client().get('/x')).rejects.toMatchObject({
      status: 400,
      serverMessage: 'bad input',
    });
  });

  it('fires onUnauthorized on 401', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(401, { error: 'unauthorized' })));
    await expect(client().get('/x')).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('represents a network failure as status 0', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(client().get('/x')).rejects.toMatchObject({ status: 0 });
  });
});
