// src/lib/fetcher.ts
const API_BASE = 'http://localhost:5000'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

export async function fetcher<T>(
  path: string,
  method: Method = 'GET',
  body?: unknown
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }

  // 空レスポンスのケース対策（204 No Content対策）
  return res.status === 204 ? (null as T) : res.json()
}
