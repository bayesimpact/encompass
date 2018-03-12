import * as React from 'react'

export function SecureLink(href: string, children: React.ReactNode) {
  return <a href={href} target='_blank' rel='noopener noreferrer'>
    {children}
  </a>
}
