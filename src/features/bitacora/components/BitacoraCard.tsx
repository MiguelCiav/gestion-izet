import * as React from 'react'
import { AlertBitacora } from '@/components/ui/AlertBitacora'
import { cn } from '@/lib/utils'
import type { BitacoraEntry } from '../types'

export interface BitacoraCardProps {
  entry: BitacoraEntry
  onClick?: (entry: BitacoraEntry) => void
  className?: string
  indicatorColor?: string
}

export function BitacoraCard({
  entry,
  onClick,
  className,
  indicatorColor = '#6A572B',
}: BitacoraCardProps) {
  const handleClick = React.useCallback(() => {
    onClick?.(entry)
  }, [onClick, entry])

  return (
    <AlertBitacora
      variant="warning"
      indicatorColor={indicatorColor}
      title={entry.title}
      description={entry.observations}
      user={entry.user}
      timestamp={entry.timestamp}
      isInteractive={Boolean(onClick)}
      onClick={onClick ? handleClick : undefined}
      className={cn('bg-white cursor-pointer select-none', className)}
    />
  )
}
