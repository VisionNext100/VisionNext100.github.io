const IP_LOG_KEY = 'homepage_contact_ip_log'
const DAY_MS = 24 * 60 * 60 * 1000
const MAX_PER_IP_PER_DAY = 5

type IpLog = Record<string, number[]>

function readLog(): IpLog {
  try {
    const raw = localStorage.getItem(IP_LOG_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as IpLog
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeLog(log: IpLog) {
  localStorage.setItem(IP_LOG_KEY, JSON.stringify(log))
}

function prune(timestamps: number[], now = Date.now()) {
  return timestamps.filter((t) => now - t < DAY_MS)
}

export async function resolveClientIp(): Promise<string> {
  try {
    const res = await fetch('https://api.ipify.org?format=json', {
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) throw new Error('ip lookup failed')
    const data = (await res.json()) as { ip?: string }
    if (data.ip && typeof data.ip === 'string') return data.ip
  } catch {
    // fall through
  }
  // Fallback bucket if IP cannot be resolved (still limits this browser)
  return 'unknown-device'
}

export function getIpSubmitCount(ip: string, now = Date.now()) {
  const log = readLog()
  const recent = prune(log[ip] ?? [], now)
  if ((log[ip]?.length ?? 0) !== recent.length) {
    log[ip] = recent
    writeLog(log)
  }
  return recent.length
}

export function canSubmitFromIp(ip: string, now = Date.now()) {
  return getIpSubmitCount(ip, now) < MAX_PER_IP_PER_DAY
}

export function recordIpSubmit(ip: string, now = Date.now()) {
  const log = readLog()
  const recent = prune(log[ip] ?? [], now)
  recent.push(now)
  log[ip] = recent
  writeLog(log)
}

export const IP_LIMIT = {
  max: MAX_PER_IP_PER_DAY,
  windowHours: 24,
}
