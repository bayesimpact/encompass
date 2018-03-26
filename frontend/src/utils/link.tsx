import * as React from 'react'

export function SecureLink(href: string, children: React.ReactNode, target?: string) {
  target = target !== undefined ? target : '_blank'
  return <a href={href} target={target} rel='noopener noreferrer'>
    {children}
  </a>
}
