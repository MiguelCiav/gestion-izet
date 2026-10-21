import { Alert } from '@/components/ui/Alert'
import { SectionHeader } from '@/components/ui/SectionCard'
import { cn } from '@/lib/utils'
import { DEFAULT_REACTIVO_ALERTS } from '../data/mockData'
import type { DashboardAlert } from '../types'

export interface DashboardAlertsProps {
  reactivoAlerts?: DashboardAlert[]
  equipoAlerts?: DashboardAlert[]
  className?: string
}

/**
 * Componente modular DashboardAlerts
 * - Sección "Alertas de reactivos" con SectionHeader (fuente Serif) y alertas warning/danger
 */
export function DashboardAlerts({
  reactivoAlerts = DEFAULT_REACTIVO_ALERTS,
  className,
}: DashboardAlertsProps) {
  return (
    <div className={cn('flex flex-col space-y-8 w-full max-w-[342px] mx-auto', className)}>
      {/* Alertas de reactivos */}
      <section className="flex flex-col space-y-4" aria-labelledby="section-reactivos-heading">
        <SectionHeader
          id="section-reactivos-heading"
          title="Alertas de reactivos"
        />

        <div className="flex flex-col space-y-4 pt-1">
          {reactivoAlerts.map((alert) => (
            <Alert
              key={alert.id}
              variant={alert.variant}
              title={alert.title}
              description={alert.description}
              iconPosition="right"
              className="border border-border-subtle/40"
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default DashboardAlerts
