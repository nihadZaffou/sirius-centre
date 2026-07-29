import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Badge from '@/Components/UI/Badge'
import Flash from '@/Components/UI/Flash'
import Empty from '@/Components/UI/Empty'

const IconClock   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconUsers   = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>

export default function Groupes({ groupes = [] }) {
    const { props } = usePage()
    const flash     = props.flash ?? {}

    return (
        <SiriusLayout title="Mes groupes">
            <Flash success={flash.success} error={flash.error} />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Mes groupes</h1>
                    <p className="page-subtitle">{groupes.length} groupe{groupes.length > 1 ? 's' : ''} assigné{groupes.length > 1 ? 's' : ''}</p>
                </div>
            </div>

            {groupes.length === 0 ? (
                <Empty title="Aucun groupe assigné" subtitle="Contactez le directeur" icon={<IconUsers />} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupes.map(g => (
                        <div key={g.id} className="card p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="min-w-0">
                                    <div className="text-[15px] font-semibold text-gray-900 mb-1 truncate">{g.nom}</div>
                                    <Badge color="gold">{g.langue} · {g.niveau}</Badge>
                                </div>
                                <Badge color={g.statut === 'en_cours' ? 'green' : 'gray'}>
                                    {g.statut === 'en_cours' ? 'En cours' : g.statut}
                                </Badge>
                            </div>

                            <div className="text-sm text-gray-500 mb-3">
                                {g.inscrits} / {g.capacite} étudiants
                            </div>

                            {g.emplois?.length > 0 && (
                                <div className="space-y-1 mb-4">
                                    {g.emplois.map((e, i) => (
                                        <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <IconClock />
                                            <span>{e.jour} {e.debut?.slice(0,5)}–{e.fin?.slice(0,5)}</span>
                                            {e.salle && <span className="text-gray-400">· {e.salle}</span>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => router.get(`/prof/presences/${g.id}`)}
                                className="w-full py-2.5 rounded-xl bg-sirius-gold text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                Marquer les présences →
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </SiriusLayout>
    )
}