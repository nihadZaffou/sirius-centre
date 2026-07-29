import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Badge from '@/Components/UI/Badge'
import Flash from '@/Components/UI/Flash'
import Empty from '@/Components/UI/Empty'

const IconGroupes   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const IconEtudiants = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
const IconClock     = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconCalEmpty  = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>

function StatCard({ icon, label, value }) {
    return (
        <div className="card-p">
            <div className="w-11 h-11 rounded-xl bg-sirius-gold-light border border-sirius-gold-border text-sirius-gold flex items-center justify-center mb-4">
                {icon}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
        </div>
    )
}

export default function Dashboard({ groupes = [], seancesAujourdhui = [], stats = {} }) {
    const { props } = usePage()
    const flash     = props.flash ?? {}

    const date = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

    return (
        <SiriusLayout title="Dashboard Prof">
            <Flash success={flash.success} error={flash.error} />

            {/* Header */}
            <div className="mb-8">
                <h1 className="page-title">Mon tableau de bord</h1>
                <p className="page-subtitle capitalize">{date}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard icon={<IconGroupes />}   label="Mes groupes"        value={stats.groupes   ?? 0} />
                <StatCard icon={<IconEtudiants />} label="Total étudiants"    value={stats.etudiants ?? 0} />
                <StatCard icon={<IconClock />}     label="Séances aujourd'hui" value={stats.seances   ?? 0} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Séances aujourd'hui */}
                <div className="card overflow-hidden">
                    <div className="section-header">
                        <div className="flex items-center gap-2.5">
                            <div className="w-1 h-5 rounded-full bg-sirius-gold" />
                            <span className="text-[15px] font-semibold text-gray-900">Séances aujourd'hui</span>
                        </div>
                    </div>
                    <div className="section-body">
                        {seancesAujourdhui.length === 0 ? (
                            <Empty title="Aucune séance aujourd'hui" icon={<IconCalEmpty />} />
                        ) : (
                            <div className="space-y-3">
                                {seancesAujourdhui.map(g => (
                                    <div key={g.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">{g.nom}</div>
                                                <Badge color="gold">{g.langue} · {g.niveau}</Badge>
                                            </div>
                                            <span className="text-xs text-gray-500">{g.inscrits} étudiants</span>
                                        </div>
                                        {g.emplois.filter(e => e.jour === new Date().toLocaleDateString('fr-FR', {weekday: 'long'})).map((e, i) => (
                                            <div key={i} className="text-xs text-sirius-gold font-medium">
                                                {e.debut?.slice(0,5)} – {e.fin?.slice(0,5)} {e.salle && `· Salle ${e.salle}`}
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => router.get(`/prof/presences/${g.id}`)}
                                            className="mt-3 w-full py-2 rounded-xl bg-sirius-gold text-white text-sm font-medium hover:opacity-90 transition-opacity"
                                        >
                                            Marquer les présences →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tous mes groupes */}
                <div className="card overflow-hidden">
                    <div className="section-header">
                        <div className="flex items-center gap-2.5">
                            <div className="w-1 h-5 rounded-full bg-sirius-gold" />
                            <span className="text-[15px] font-semibold text-gray-900">Tous mes groupes</span>
                        </div>
                    </div>
                    <div className="section-body">
                        {groupes.length === 0 ? (
                            <Empty title="Aucun groupe assigné" icon={<IconGroupes />} />
                        ) : (
                            <div className="space-y-3">
                                {groupes.map(g => (
                                    <div key={g.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-gray-900 truncate">{g.nom}</div>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <Badge color="gold">{g.langue} · {g.niveau}</Badge>
                                                <span className="text-xs text-gray-400">{g.inscrits} étudiants</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => router.get(`/prof/presences/${g.id}`)}
                                            className="flex-shrink-0 ml-3 text-xs text-sirius-gold font-medium hover:opacity-75"
                                        >
                                            Présences →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </SiriusLayout>
    )
}