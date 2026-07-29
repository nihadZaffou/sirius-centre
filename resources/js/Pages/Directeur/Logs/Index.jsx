import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Badge from '@/Components/UI/Badge'
import Flash from '@/Components/UI/Flash'
import Empty from '@/Components/UI/Empty'

const IconLog = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>

const ACTIONS = {
    inscription_etudiant:  { label: 'Inscription',       color: 'green' },
    creation_etudiant:     { label: 'Création étudiant', color: 'green' },
    modification_etudiant: { label: 'Modification',      color: 'blue' },
    desactivation_etudiant:{ label: 'Désactivation',     color: 'red' },
    ajout_avance:          { label: 'Avance',            color: 'gold' },
    marquer_solde:         { label: 'Soldé',             color: 'green' },
    changement_groupe:     { label: 'Changement groupe', color: 'blue' },
    passage_niveau:        { label: 'Niveau suivant',    color: 'gold' },
    marquer_presences:     { label: 'Présences',         color: 'blue' },
    creation_annonce:      { label: 'Annonce',           color: 'blue' },
    creation_traduction:   { label: 'Traduction',        color: 'orange' },
    statut_traduction:     { label: 'Statut traduction', color: 'orange' },
    resolution_alerte:     { label: 'Alerte résolue',    color: 'green' },
}

export default function Index({ logs = {} }) {
    const { props }       = usePage()
    const flash           = props.flash ?? {}
    const [search, setSearch] = useState('')
    const [filtre, setFiltre] = useState('tous')

    const data = logs.data ?? []

    const logsFiltres = data.filter(l => {
        const matchSearch = search === '' ||
            l.details?.toLowerCase().includes(search.toLowerCase()) ||
            l.user?.toLowerCase().includes(search.toLowerCase()) ||
            l.action?.toLowerCase().includes(search.toLowerCase())
        const matchFiltre = filtre === 'tous' || l.action === filtre
        return matchSearch && matchFiltre
    })

    const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })

    return (
        <SiriusLayout title="Logs">
            <Flash success={flash.success} error={flash.error} />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Logs d'activité</h1>
                    <p className="page-subtitle">Historique complet des actions — directeur principal uniquement</p>
                </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex-1 max-w-sm">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Rechercher dans les logs..."
                        className="flex-1 text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-300"
                    />
                </div>
                <select
                    value={filtre}
                    onChange={e => setFiltre(e.target.value)}
                    className="select max-w-xs"
                >
                    <option value="tous">Toutes les actions</option>
                    {Object.entries(ACTIONS).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            {logsFiltres.length === 0 ? (
                <Empty title="Aucun log trouvé" subtitle="Aucune action enregistrée" icon={<IconLog />} />
            ) : (
                <div className="table-wrapper">
                    {/* Desktop */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th">Date</th>
                                    <th className="table-th">Utilisateur</th>
                                    <th className="table-th">Action</th>
                                    <th className="table-th">Détails</th>
                                    <th className="table-th">IP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logsFiltres.map(l => {
                                    const a = ACTIONS[l.action] ?? { label: l.action, color: 'gray' }
                                    return (
                                        <tr key={l.id} className="table-tr">
                                            <td className="table-td whitespace-nowrap">
                                                <span className="text-xs text-gray-500">{formatDate(l.date)}</span>
                                            </td>
                                            <td className="table-td">
                                                <div className="text-sm font-medium text-gray-900">{l.user}</div>
                                                <div className="text-xs text-gray-400 capitalize">{l.role}</div>
                                            </td>
                                            <td className="table-td">
                                                <Badge color={a.color}>{a.label}</Badge>
                                            </td>
                                            <td className="table-td">
                                                <span className="text-sm text-gray-600">{l.details}</span>
                                            </td>
                                            <td className="table-td">
                                                <span className="text-xs text-gray-400 font-mono">{l.ip}</span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {logsFiltres.map(l => {
                            const a = ACTIONS[l.action] ?? { label: l.action, color: 'gray' }
                            return (
                                <div key={l.id} className="p-4">
                                    <div className="flex items-start justify-between mb-1">
                                        <div className="text-sm font-medium text-gray-900">{l.user}</div>
                                        <Badge color={a.color}>{a.label}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{l.details}</p>
                                    <div className="text-xs text-gray-400">{formatDate(l.date)} · {l.ip}</div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Pagination */}
                    {logs.last_page > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 gap-3">
                            <p className="text-sm text-gray-500">
                                Page {logs.current_page} sur {logs.last_page} · {logs.total} logs
                            </p>
                            <div className="flex gap-2 flex-wrap justify-center">
                                {logs.links?.map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                            link.active
                                                ? 'bg-sirius-gold text-white font-medium'
                                                : link.url
                                                    ? 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    : 'bg-white border border-gray-100 text-gray-300 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </SiriusLayout>
    )
}