import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Badge from '@/Components/UI/Badge'
import Flash from '@/Components/UI/Flash'
import Empty from '@/Components/UI/Empty'
import Input from '@/Components/UI/Input'

const IconArchive = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
const IconSearch  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>

export default function Index({ groupes = [], etudiants = [], annees = [], filters = {} }) {
    const { props }         = usePage()
    const flash             = props.flash ?? {}
    const [onglet, setOnglet] = useState('groupes')
    const [search, setSearch] = useState(filters.search ?? '')
    const [annee, setAnnee]   = useState(filters.annee ?? '')

    const filtrer = (newSearch = search, newAnnee = annee) => {
        router.get('/directeur/archives', {
            search: newSearch,
            annee:  newAnnee,
        }, { preserveState: true })
    }

    return (
        <SiriusLayout title="Archives">
            <Flash success={flash.success} error={flash.error} />

            <div className="page-header mb-6">
                <div>
                    <h1 className="page-title">Archives</h1>
                    <p className="page-subtitle">Historique des groupes et étudiants archivés</p>
                </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex-1 max-w-sm">
                    <IconSearch />
                    <input
                        type="text"
                        value={search}
                        onChange={e => { setSearch(e.target.value); filtrer(e.target.value, annee) }}
                        placeholder="Rechercher..."
                        className="flex-1 text-sm outline-none"
                    />
                </div>
                <select
                    value={annee}
                    onChange={e => { setAnnee(e.target.value); filtrer(search, e.target.value) }}
                    className="select max-w-xs"
                >
                    <option value="">Toutes les années</option>
                    {annees.map(a => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>
            </div>

            {/* Onglets */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setOnglet('groupes')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        onglet === 'groupes'
                            ? 'bg-sirius-gold text-white border-sirius-gold'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    Groupes archivés ({groupes.length})
                </button>
                <button
                    onClick={() => setOnglet('etudiants')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        onglet === 'etudiants'
                            ? 'bg-sirius-gold text-white border-sirius-gold'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    Étudiants archivés ({etudiants.length})
                </button>
            </div>

            {/* Groupes archivés */}
            {onglet === 'groupes' && (
                groupes.length === 0
                    ? <Empty title="Aucun groupe archivé" icon={<IconArchive />} />
                    : <div className="table-wrapper">
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="table-th">Groupe</th>
                                        <th className="table-th">Langue / Niveau</th>
                                        <th className="table-th">Professeur</th>
                                        <th className="table-th">Période</th>
                                        <th className="table-th">Étudiants</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupes.map(g => (
                                        <tr key={g.id} className="table-tr">
                                            <td className="table-td font-medium text-gray-900">{g.nom}</td>
                                            <td className="table-td">
                                                <Badge color="gray">{g.langue} · {g.niveau}</Badge>
                                            </td>
                                            <td className="table-td text-gray-500">{g.prof ?? '—'}</td>
                                            <td className="table-td text-xs text-gray-500">
                                                {g.dateDebut && new Date(g.dateDebut).toLocaleDateString('fr-FR')}
                                                {' → '}
                                                {g.dateFin && new Date(g.dateFin).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="table-td text-gray-500">{g.inscrits}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {groupes.map(g => (
                                <div key={g.id} className="p-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="text-sm font-medium text-gray-900">{g.nom}</div>
                                        <Badge color="gray">{g.niveau}</Badge>
                                    </div>
                                    <div className="text-xs text-gray-400">{g.langue} · {g.prof}</div>
                                    <div className="text-xs text-gray-400 mt-1">{g.inscrits} étudiants</div>
                                </div>
                            ))}
                        </div>
                    </div>
            )}

            {/* Étudiants archivés */}
            {onglet === 'etudiants' && (
                etudiants.length === 0
                    ? <Empty title="Aucun étudiant archivé" icon={<IconArchive />} />
                    : <div className="table-wrapper">
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="table-th">Étudiant</th>
                                        <th className="table-th">Contact</th>
                                        <th className="table-th">Groupes suivis</th>
                                        <th className="table-th text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {etudiants.map(e => (
                                        <tr key={e.id} className="table-tr">
                                            <td className="table-td">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 text-xs font-semibold">
                                                        {e.prenom?.[0]}{e.nom?.[0]}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{e.prenom} {e.nom}</div>
                                                        <Badge color="gray">Archivé</Badge>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="table-td text-xs text-gray-500">
                                                <div>{e.email}</div>
                                                <div>{e.telephone}</div>
                                            </td>
                                            <td className="table-td">
                                                <div className="flex flex-wrap gap-1">
                                                    {e.groupes?.map((g, i) => (
                                                        <Badge key={i} color="gray">{g.langue} {g.niveau}</Badge>
                                                    ))}
                                                </div>
                                            </td>
                                        <td className="table-td text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => router.visit(`/directeur/etudiants/${e.id}`)}
                                                className="text-xs text-sirius-gold font-medium hover:opacity-75"
                                            >
                                                Voir fiche →
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Réactiver ${e.prenom} ${e.nom} ?`)) {
                                                        router.patch(`/directeur/archives/reactiver/${e.id}`)
                                                    }
                                                }}
                                                className="text-xs text-green-600 font-medium hover:opacity-75"
                                            >
                                                ✓ Réactiver
                                            </button>
                                        </div>
                                    </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {etudiants.map(e => (
                                <div key={e.id} className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm font-semibold text-gray-900">{e.prenom} {e.nom}</div>
                                        <button
                                            onClick={() => router.visit(`/directeur/etudiants/${e.id}`)}
                                            className="text-xs text-sirius-gold font-medium"
                                        >
                                            Voir →
                                        </button>
                                         <button
                                                onClick={() => {
                                                    if (confirm(`Réactiver ${e.prenom} ${e.nom} ?`)) {
                                                        router.patch(`/directeur/archives/reactiver/${e.id}`)
                                                    }
                                                }}
                                                className="text-xs text-green-600 font-medium"
                                            >
                                                ✓ Réactiver
                                            </button>
                                    </div>
                                    <div className="text-xs text-gray-400">{e.email}</div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {e.groupes?.map((g, i) => (
                                            <Badge key={i} color="gray">{g.langue} {g.niveau}</Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
            )}
        </SiriusLayout>
    )
}