import * as z from 'zod';

const Body = z.object({
  id: z.string(),
  value: z.string(),
});

type Body = z.infer<typeof Body>;

const _url =
  'http://' +
  process.env.GOLANG_ADDR +
  ':' +
  process.env.GOLANG_PORT +
  '/field';

const url = new URL(_url).toString();

export async function postFieldValue(id: string, value: string): Promise<Body> {
  const response = await fetch(`${url}/${id}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ value }),
  });

  const resJson = await response.json();

  return Body.parseAsync(resJson);
}
export async function updateFieldValue(
  id: string,
  value: string,
): Promise<Body> {
  const response = await fetch(`${url}/${id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ value }),
  });

  const resJson = await response.json();

  return Body.parseAsync(resJson);
}
export async function getFieldValue(id: string[]): Promise<Body[]> {
  const response = await fetch(`${url}/get`, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ id }),
  });

  const resJson = await response.json();

  return z.array(Body).parseAsync(resJson);
}

export async function deleteFieldValue(id: string): Promise<boolean> {
  const response = await fetch(`${url}/${id}`, {
    method: 'DELETE',
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });

  if (response) return true;
  return false;
}
