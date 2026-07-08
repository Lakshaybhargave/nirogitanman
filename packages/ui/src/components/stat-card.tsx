import * as React from 'react'
import { cn } from '../lib/utils'
import { Card, CardContent } from './card'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label?: string
    positive?: boolean
  }
  className?: string
}

function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                <span
                  className={cn(
                    'font-medium',
                    trend.positive !== false ? 'text-emerald-600' : 'text-red-500'
                  )}
                >
                  {trend.positive !== false ? '+' : ''}{trend.value}%
                </span>
                {trend.label && (
                  <span className="text-muted-foreground">{trend.label}</span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { StatCard }
