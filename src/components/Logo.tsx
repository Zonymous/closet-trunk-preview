import Link from 'next/link'
import { SITE } from '@/content/site'

function Mark() {
  if (SITE.mark === 'closet-trunk') {
    return (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.5 39H35.5A2.5 2.5 0 0 0 38 36.5V19A7 7 0 0 0 31 12H17A7 7 0 0 0 10 19V36.5A2.5 2.5 0 0 0 12.5 39Z" />
        <path d="M6 22H42" />
        <circle className="accent" cx="24" cy="22" r="3.25" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="32" height="32" rx="8" />
      <path d="M16 20H32M16 28H26" />
      <circle className="accent" cx="32" cy="29" r="3.25" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function Logo() {
  return (
    <Link className="logo" href="/#top">
      <Mark />
      {SITE.name}
    </Link>
  )
}
