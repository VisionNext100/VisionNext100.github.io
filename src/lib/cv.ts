import { SITE } from '../data/site'

function looksLikePdf(res: Response): boolean {
  const type = res.headers.get('content-type') ?? ''
  // Vite/SPA hosts often return 200 text/html for missing paths — status alone is not enough.
  return (res.ok || res.status === 206) && /application\/pdf/i.test(type)
}

export async function cvExists(): Promise<boolean> {
  try {
    const head = await fetch(SITE.cvPath, { method: 'HEAD', cache: 'no-store' })
    if (looksLikePdf(head)) return true
    const get = await fetch(SITE.cvPath, {
      method: 'GET',
      cache: 'no-store',
      headers: { Range: 'bytes=0-0' },
    })
    return looksLikePdf(get)
  } catch {
    return false
  }
}
