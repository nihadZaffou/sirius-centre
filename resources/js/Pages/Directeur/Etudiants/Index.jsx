import { useState } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Button from '@/Components/UI/Button'
import Badge from '@/Components/UI/Badge'
import Flash from '@/Components/UI/Flash'
import Modal, { ModalBody, ModalFooter } from '@/Components/UI/Modal'

const IconPlus  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconSearch= () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const IconEye   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IconEdit  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IconTrash = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const IconEmpty = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
const IconX     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

export default function Index({
    etudiants = { data: [], total: 0, last_page: 1, current_page: 1, links: [] },
    filters = {},
    groupeNom = null,
}) {
    const { props }               = usePage()
    const flash                   = props.flash ?? {}
    const [search, setSearch]     = useState(filters?.search ?? '')
    const [statut, setStatut]     = useState(filters?.statut ?? 'actif')
    const [toDelete, setToDelete] = useState(null)

    const doSearch = (s, st) => {
        router.get('/directeur/etudiants', {
            search: s,
            statut: st,
            ...(filters?.idGroupe ? { idGroupe: filters.idGroupe } : {}),
        }, { preserveState: true, replace: true })
    }

    const handleSearch = (v) => { setSearch(v);  doSearch(v, statut) }
    const handleStatut = (v) => { setStatut(v);  doSearch(search, v) }

    const handleDelete = () => {
        router.delete(`/directeur/etudiants/${toDelete.id}`, {
            onSuccess: () => setToDelete(null),
        })
    }

    return (
        <SiriusLayout title="Étudiants">
            <Flash success={flash.success} error={flash.error} />

            {/* Filtre groupe actif */}
            {filters?.idGroupe && (
                <div className="flex items-center gap-3 bg-sirius-gold-light border border-sirius-gold-border rounded-xl px-4 py-2.5 mb-4">
                    <span className="text-sm text-yellow-700 font-medium">
                        Groupe : <strong>{groupeNom ?? '—'}</strong>
                    </span>
                    <button
                        onClick={() => router.get('/directeur/etudiants')}
                        className="ml-auto flex items-center gap-1 text-xs text-sirius-danger font-medium hover:opacity-75"
                    >
                        <IconX /> Effacer le filtre
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Étudiants</h1>
                    <p className="page-subtitle">
                        {etudiants.total} étudiant{etudiants.total > 1 ? 's' : ''} trouvé{etudiants.total > 1 ? 's' : ''}
                    </p>
                </div>
                <Link href="/directeur/etudiants/creer">
                    <Button variant="gold">
                        <IconPlus /> Ajouter un étudiant
                    </Button>
                </Link>
            </div>

            {/* Filtres */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-full sm:w-auto sm:flex-1 sm:max-w-sm">
                    <span className="text-gray-400 flex-shrink-0"><IconSearch /></span>
                    <input
                        type="text"
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                        placeholder="Nom, prénom, CIN, email..."
                        className="flex-1 text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-300 min-w-0"
                    />
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    {[
                        { label: 'Actifs',   value: 'actif' },
                        { label: 'Inactifs', value: 'inactif' },
                        { label: 'Tous',     value: '' },
                    ].map(f => (
                        <button
                            key={f.value}
                            onClick={() => handleStatut(f.value)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                statut === f.value
                                    ? 'bg-sirius-dark text-white'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tableau desktop / Cards mobile */}
            <div className="table-wrapper">
                {etudiants.data.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="flex justify-center mb-3 text-gray-300"><IconEmpty /></div>
                        <p className="text-sm text-gray-400 mb-1">Aucun étudiant trouvé</p>
                        <p className="text-xs text-gray-300">Essayez de modifier votre recherche</p>
                    </div>
                ) : (
                    <>
                        {/* Tableau — visible md+ */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="table-header">
                                    <tr>
                                        <th className="table-th">Étudiant</th>
                                        <th className="table-th">CIN</th>
                                        <th className="table-th">Contact</th>
                                        <th className="table-th">Groupe</th>
                                        <th className="table-th">Paiement</th>
                                        <th className="table-th">Absences</th>
                                        <th className="table-th">Statut</th>
                                        <th className="table-th text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {etudiants.data.map(e => (
                                        <tr key={e.id} className="table-tr">
                                            <td className="table-td">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-sirius-gold-light border border-sirius-gold-border flex items-center justify-center text-sirius-gold text-xs font-semibold flex-shrink-0">
                                                        {e.prenom?.[0]}{e.nom?.[0]}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-medium text-gray-900 truncate">{e.prenom} {e.nom}</div>
                                                        <div className="text-xs text-gray-400 truncate">{e.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="table-td">{e.cin ?? '—'}</td>
                                            <td className="table-td">{e.telephone ?? '—'}</td>
                                            <td className="table-td">
                                                <div className="flex flex-wrap gap-1">
                                                    {e.groupes?.length === 0
                                                        ? <span className="text-xs text-gray-300">Aucun</span>
                                                        : e.groupes?.map(g => (
                                                            <Badge key={g.id} color="gold">{g.langue} {g.niveau}</Badge>
                                                        ))
                                                    }
                                                </div>
                                            </td>
                                            <td className="table-td">
                                                {e.paiement?.statut === 'solde'
                                                    ? <Badge color="green">Soldé ✓</Badge>
                                                    : e.paiement?.reste > 0
                                                        ? <Badge color="red">Reste {e.paiement.reste} DH</Badge>
                                                        : <span className="text-xs text-gray-300">—</span>
                                                }
                                            </td>
                                            <td className="table-td">
                                                {e.absences === 0
                                                    ? <Badge color="green">0 ✓</Badge>
                                                    : e.absences >= 3
                                                        ? <Badge color="red">{e.absences} ⚠️</Badge>
                                                        : <Badge color="orange">{e.absences}</Badge>
                                                }
                                            </td>
                                            <td className="table-td">
                                                <Badge color={e.actif ? 'green' : 'red'}>
                                                    {e.actif ? 'Actif' : 'Inactif'}
                                                </Badge>
                                            </td>
                                            <td className="table-td">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/directeur/etudiants/${e.id}`}>
                                                        <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-sirius-dark hover:text-white transition-all" title="Voir fiche">
                                                            <IconEye />
                                                        </button>
                                                    </Link>
                                                    <Link href={`/directeur/etudiants/${e.id}/modifier`}>
                                                        <button className="w-8 h-8 rounded-lg bg-sirius-gold-light flex items-center justify-center text-sirius-gold hover:bg-sirius-gold hover:text-white transition-all" title="Modifier">
                                                            <IconEdit />
                                                        </button>
                                                    </Link>
                                                    {e.actif === 1 && (
                                                        <button
                                                            onClick={() => setToDelete(e)}
                                                            className="w-8 h-8 rounded-lg bg-sirius-danger-light flex items-center justify-center text-sirius-danger hover:bg-sirius-danger hover:text-white transition-all"
                                                            title="Désactiver"
                                                        >
                                                            <IconTrash />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Cards — visible mobile */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {etudiants.data.map(e => (
                                <div key={e.id} className="p-4">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-sirius-gold-light border border-sirius-gold-border flex items-center justify-center text-sirius-gold text-sm font-semibold flex-shrink-0">
                                                {e.prenom?.[0]}{e.nom?.[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-gray-900 truncate">{e.prenom} {e.nom}</div>
                                                <div className="text-xs text-gray-400 truncate">{e.email}</div>
                                            </div>
                                        </div>
                                        <Badge color={e.actif ? 'green' : 'red'}>
                                            {e.actif ? 'Actif' : 'Inactif'}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {e.groupes?.map(g => <Badge key={g.id} color="gold">{g.langue} {g.niveau}</Badge>)}
                                        {e.paiement?.reste > 0 && <Badge color="red">Reste {e.paiement.reste} DH</Badge>}
                                        {e.absences >= 3 && <Badge color="red">{e.absences} absences ⚠️</Badge>}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/directeur/etudiants/${e.id}`} className="flex-1">
                                            <Button variant="outline" className="w-full text-xs" size="sm"><IconEye /> Fiche</Button>
                                        </Link>
                                        <Link href={`/directeur/etudiants/${e.id}/modifier`} className="flex-1">
                                            <Button variant="gold" className="w-full text-xs" size="sm"><IconEdit /> Modifier</Button>
                                        </Link>
                                        {e.actif === 1 && (
                                            <Button variant="danger" size="sm" onClick={() => setToDelete(e)}>
                                                <IconTrash />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Pagination */}
                {etudiants.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 gap-3">
                        <p className="text-sm text-gray-500">
                            Page {etudiants.current_page} sur {etudiants.last_page}
                        </p>
                        <div className="flex gap-2 flex-wrap justify-center">
                            {etudiants.links.map((link, i) => (
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

            {/* Modal confirmation */}
            {toDelete && (
                <Modal title="Désactiver l'étudiant" onClose={() => setToDelete(null)}>
                    <ModalBody>
                        <p className="text-sm text-gray-500 text-center">
                            Voulez-vous désactiver <strong>{toDelete.prenom} {toDelete.nom}</strong> ?
                            Cette action peut être annulée.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setToDelete(null)} className="flex-1">Annuler</Button>
                        <Button variant="danger" onClick={handleDelete} className="flex-1">Désactiver</Button>
                    </ModalFooter>
                </Modal>
            )}
        </SiriusLayout>
    )
}