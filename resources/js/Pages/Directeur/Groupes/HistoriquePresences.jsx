import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'

const IconPrint = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
const IconArrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>

export default function HistoriquePresences({ groupe, dates = [], etudiants = [] }) {
    const { props } = usePage()

    return (
        <>
            {/* CSS Print */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { padding: 0 !important; }
                    @page { size: A4 landscape; margin: 10mm; }
                }
            `}</style>

            <SiriusLayout title={`Historique — ${groupe.nom}`}>

                {/* Header */}
                <div className="no-print flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.visit(`/directeur/niveaux/${groupe.id}/groupes`)}>
                            <div className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                                <IconArrow />
                            </div>
                        </button>
                        <div>
                            <h1 className="page-title">Historique des présences</h1>
                            <p className="page-subtitle">{groupe.nom} · {groupe.langue} · {groupe.niveau}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-sirius-gold text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90"
                    >
                        <IconPrint /> Imprimer
                    </button>
                </div>

                {/* Infos groupe — visible à l'impression */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-lg font-bold text-gray-900 mb-1">{groupe.nom}</div>
                    <div className="text-sm text-gray-500">
                        {groupe.langue} · {groupe.niveau} · Prof : {groupe.prof ?? '—'}
                    </div>
                </div>

                {/* Tableau */}
                {dates.length === 0 ? (
                    <div className="card-p text-center text-gray-400">
                        Aucune présence enregistrée pour ce groupe.
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-sirius-dark text-white">
                                    <th className="text-left px-4 py-3 font-semibold sticky left-0 bg-sirius-dark z-10 min-w-[160px]">
                                        Étudiant
                                    </th>
                                    {dates.map(date => (
                                        <th key={date} className="px-3 py-3 font-semibold text-center whitespace-nowrap min-w-[80px]">
                                            {new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 font-semibold text-center">Total absences</th>
                                </tr>
                            </thead>
                            <tbody>
                                {etudiants.map((e, i) => {
                                    const totalAbsences = dates.filter(date =>
                                        e.presences[date] && e.presences[date].present === 0
                                    ).length

                                    return (
                                        <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className={`px-4 py-3 font-medium text-gray-900 sticky left-0 z-10 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                {e.prenom} {e.nom}
                                            </td>
                                            {dates.map(date => {
                                                const p = e.presences[date]
                                                return (
                                                    <td key={date} className="px-3 py-3 text-center">
                                                        {p === null || p === undefined ? (
                                                            <span className="text-gray-300 text-lg">—</span>
                                                        ) : p.present ? (
                                                            <span className="text-green-500 text-lg font-bold">✓</span>
                                                        ) : p.justifie ? (
                                                            <span className="text-amber-500 text-lg font-bold" title={p.motif}>J</span>
                                                        ) : (
                                                            <span className="text-sirius-danger text-lg font-bold">✗</span>
                                                        )}
                                                    </td>
                                                )
                                            })}
                                            <td className="px-4 py-3 text-center">
                                                <span className={`font-bold ${totalAbsences >= 3 ? 'text-sirius-danger' : 'text-gray-700'}`}>
                                                    {totalAbsences}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Légende */}
                <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
                    <span><span className="text-green-500 font-bold">✓</span> Présent</span>
                    <span><span className="text-sirius-danger font-bold">✗</span> Absent</span>
                    <span><span className="text-amber-500 font-bold">J</span> Justifié</span>
                    <span><span className="text-gray-300">—</span> Non marqué</span>
                </div>

            </SiriusLayout>
        </>
    )
}