import { getSupabaseServerClient } from '@nirogitanman/supabase/server'
import { redirect } from 'next/navigation'
import { FileText, Upload, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Medical Records' }

const typeColors: Record<string, string> = {
  prescription: 'bg-blue-100 text-blue-700',
  lab_report: 'bg-purple-100 text-purple-700',
  imaging: 'bg-orange-100 text-orange-700',
  discharge_summary: 'bg-red-100 text-red-700',
  vaccination: 'bg-emerald-100 text-emerald-700',
  other: 'bg-gray-100 text-gray-600',
}

export default async function RecordsPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()
  if (!profile) redirect('/login')

  const { data: records } = await supabase
    .from('medical_records')
    .select('id, title, record_type, record_date, description, file_url')
    .eq('client_id', profile.id)
    .order('record_date', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground mt-1">All your health documents in one place.</p>
        </div>
        <Link
          href="/records/upload"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Upload Record
        </Link>
      </div>

      {records && records.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => (
            <div key={record.id} className="rounded-xl bg-card border p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${typeColors[record.record_type] ?? typeColors.other}`}>
                  {record.record_type.replace('_', ' ')}
                </span>
              </div>
              <div>
                <div className="font-medium text-sm">{record.title}</div>
                {record.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{record.description}</p>
                )}
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  {new Date(record.record_date).toLocaleDateString('en-IN')}
                </span>
                {record.file_url && (
                  <a
                    href={record.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    View <ArrowRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-12 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
          <h2 className="font-semibold mb-2">No records yet</h2>
          <p className="text-sm text-muted-foreground mb-4">Upload prescriptions, lab reports, and other documents.</p>
          <Link
            href="/records/upload"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Upload className="h-4 w-4" />
            Upload First Record
          </Link>
        </div>
      )}
    </div>
  )
}
