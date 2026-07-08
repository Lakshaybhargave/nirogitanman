import { getSupabaseServerClient } from '@nirogitanman/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, ShieldAlert, Search } from 'lucide-react'

export const metadata = { title: 'Partner Management' }

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  under_review: 'bg-blue-100 text-blue-700',
  verified: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  suspended: 'bg-gray-100 text-gray-600',
}

export default async function PartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams
  const status = params.status ?? 'all'
  const page = parseInt(params.page ?? '1', 10)
  const limit = 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('partners')
    .select(`
      id, business_name, verification_status, created_at, city, country,
      partner_types ( name ),
      profiles!partners_profile_id_fkey ( full_name, email )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status !== 'all') {
    query = query.eq('verification_status', status)
  }

  const { data: partners, count } = await query

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'verified', label: 'Verified' },
    { key: 'rejected', label: 'Rejected' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Partner Management</h1>
          <p className="text-muted-foreground mt-1">Review and verify healthcare partners.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {count ?? 0} total partners
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/partners?status=${tab.key}`}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              status === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Partner</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {partners && partners.length > 0 ? (
                partners.map((p) => {
                  const pf = p.profiles as { full_name: string; email: string } | null
                  const pt = p.partner_types as { name: string } | null
                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium">{p.business_name}</div>
                        <div className="text-xs text-muted-foreground">{pf?.email}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{pt?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.city ?? '—'}, {p.country}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[p.verification_status] ?? ''}`}>
                          {p.verification_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(p.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/partners/${p.id}`}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          {p.verification_status === 'pending' ? 'Review' : 'View'}
                        </Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <ShieldAlert className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    No partners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
