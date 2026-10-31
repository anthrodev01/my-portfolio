import { useEffect, useState } from 'react'

const format = () =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
    .format(new Date())
    .replace(/\s?(am|pm)/i, (m) => m.trim().toUpperCase().replace(/^/, ' '))

/** "It's 9:08 AM in Nigeria": a small, human touch for the footer. Rendered on the client only. */
export default function LocalTime() {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    setTime(format())
    const id = window.setInterval(() => setTime(format()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  if (!time) return null
  return (
    <p className="local-time">
      <span className="local-time__dot" aria-hidden="true" />
      It’s <time>{time}</time> in Nigeria
    </p>
  )
}
