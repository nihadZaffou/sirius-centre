import { useState } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Button from '@/Components/UI/Button'
import Badge from '@/Components/UI/Badge'
import Flash from '@/Components/UI/Flash'
import Modal, { ModalBody, ModalFooter } from '@/Components/UI/Modal'
import Input from '@/Components/UI/Input'
import Empty from '@/Components/UI/Empty'

const IconArrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
const IconEdit  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IconTrash = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const IconPlus  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconCheck = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
const IconX     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconClock = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>

function SectionCard({ title, color = 'gold', count, action, children }) {
    return (
        <div className="section-card">
            <div className="section-header">
                <div className="flex items-center gap-2.5">
                    <div className={`w-1 h-5 rounded-full ${color === 'gold' ? 'bg-sirius-gold' : 'bg-sirius-danger'}`} />
                    <span className="text-[15px] font-semibold text-gray-900">{title}</span>
                    {count > 0 && (
                        <span className={`badge text-[10px] text-white ${color === 'gold' ? 'bg-sirius-gold' : 'bg-sirius-danger'}`}>
                            {count}
                        </span>
                    )}
                </div>
                {action}
            </div>
            <div className="section-body">{children}</div>
        </div>
    )
}

function ModalAvance({ paiement, onClose, onSubmit }) {
    const [montant, setMontant] = useState('')
    const [date, setDate]       = useState(new Date().toISOString().split('T')[0])
    const [error, setError]     = useState('')
    const [loading, setLoading] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        if (!montant || isNaN(montant) || Number(montant) <= 0) { setError('Montant invalide.'); return }
        if (Number(montant) > paiement.reste) { setError(`Max ${paiement.reste} DH.`); return }
        setLoading(true)
        onSubmit({ idPaiement: paiement.id, montant: Number(montant), datePaiement: date })
    }

    return (
        <Modal title="Ajouter une avance" onClose={onClose}>
            <form onSubmit={submit}>
                <ModalBody>
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
                        <div className="flex justify-between mb-1 text-gray-600">
                            <span>Total</span><span className="font-medium">{paiement.montantTotal} DH</span>
                        </div>
                        <div className="flex justify-between mb-1 text-gray-600">
                            <span>Payé</span><span className="font-medium text-green-600">{paiement.montantPaye} DH</span>
                        </div>
                        <div className="flex justify-between font-semibold text-sirius-danger">
                            <span>Reste</span><span>{paiement.reste} DH</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Input label="Montant (DH)" type="number" value={montant}
                            onChange={e => { setMontant(e.target.value); setError('') }}
                            placeholder={`Max ${paiement.reste} DH`} error={error} required />
                        <Input label="Date du paiement" type="date" value={date}
                            onChange={e => setDate(e.target.value)} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={onClose} className="flex-1" type="button">Annuler</Button>
                    <Button variant="gold" type="submit" loading={loading} className="flex-1">Enregistrer</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

function ModalJustifier({ presence, onClose }) {
    const [motif, setMotif]     = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState('')

    const submit = (e) => {
        e.preventDefault()
        if (!motif.trim()) { setError('Le motif est obligatoire.'); return }
        setLoading(true)
        router.patch(`/directeur/presences/${presence.idPresence}/justifier`, { motif }, {
            onSuccess: () => { setLoading(false); onClose() },
            onError:   () => { setLoading(false); setError('Erreur.') },
        })
    }

    return (
        <Modal title="Justifier l'absence" onClose={onClose}>
            <form onSubmit={submit}>
                <ModalBody>
                    <p className="text-sm text-gray-500 mb-4">
                        Séance du <strong>
                            {new Date(presence.dateSeance).toLocaleDateString('fr-FR')}
                        </strong>
                        {presence.groupe && ` — ${presence.groupe}`}
                    </p>
                    <Input
                        label="Motif de justification"
                        value={motif}
                        onChange={e => { setMotif(e.target.value); setError('') }}
                        placeholder="Ex: Maladie, Voyage..."
                        error={error}
                        required
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={onClose} type="button" className="flex-1">Annuler</Button>
                    <Button variant="gold" type="submit" loading={loading} className="flex-1">Justifier</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export default function Fiche({ etudiant }) {
    const { props }                             = usePage()
    const flash                                 = props.flash ?? {}
    const [modalPaiement, setModalPaiement]     = useState(null)
    const [modalJustifier, setModalJustifier]   = useState(null)
    const [confirmDesactiver, setConfirmDesact] = useState(false)

    if (!etudiant) return null

    const initiales = `${etudiant.prenom?.[0] ?? ''}${etudiant.nom?.[0] ?? ''}`

    const handleAvance = (data) => {
        router.post('/directeur/paiements/avance', data, {
            onSuccess: () => setModalPaiement(null),
        })
    }

    const handleDesactiver = () => {
        router.delete(`/directeur/etudiants/${etudiant.id}`, {
            onSuccess: () => setConfirmDesact(false),
        })
    }

    const statutAttest = (s) => ({
        validee:    { label: 'Validée',    color: 'green' },
        refusee:    { label: 'Refusée',    color: 'red' },
        en_attente: { label: 'En attente', color: 'orange' },
    }[s] ?? { label: s, color: 'gray' })

    const statutTrad = (s) => ({
        demande:    { label: 'Déposée',     color: 'blue' },
        en_attente: { label: 'En attente',  color: 'orange' },
        approuve:   { label: 'Approuvée',   color: 'green' },
        retour:     { label: 'À récupérer', color: 'gold' },
        recupere:   { label: 'Récupérée',   color: 'gray' },
    }[s] ?? { label: s, color: 'gray' })

    const absencesNonJustifiees = etudiant.presences?.filter(p => !p.estPresent && !p.estJustifie).length ?? 0

    return (
        <SiriusLayout title="Fiche étudiant">
            <Flash success={flash.success} error={flash.error} />

            {/* Retour */}
            <div className="flex items-center gap-3 mb-6">
                <Link href="/directeur/etudiants">
                    <Button variant="outline" size="icon"><IconArrow /></Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Fiche étudiant</h1>
                    <p className="page-subtitle">Toutes les informations de l'étudiant</p>
                </div>
            </div>

            <div className="space-y-4 max-w-4xl">

                {/* EN-TÊTE */}
                <div className="card-p">
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-sirius-gold-light border-2 border-sirius-gold-border flex items-center justify-center text-sirius-gold text-xl font-bold flex-shrink-0">
                            {initiales}
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h2 className="text-xl font-bold text-gray-900">{etudiant.prenom} {etudiant.nom}</h2>
                                <Badge color={etudiant.actif ? 'green' : 'red'}>
                                    {etudiant.actif ? 'Actif' : 'Inactif'}
                                </Badge>
                                {etudiant.alertes?.length > 0 && (
                                    <Badge color="red">{etudiant.alertes.length} alerte{etudiant.alertes.length > 1 ? 's' : ''}</Badge>
                                )}
                                {absencesNonJustifiees >= 3 && (
                                    <Badge color="orange">{absencesNonJustifiees} absences ⚠️</Badge>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-500 mb-4">
                                <span>📧 {etudiant.email}</span>
                                <span>📞 {etudiant.telephone ?? '—'}</span>
                                <span>🪪 CIN : {etudiant.cin ?? '—'}</span>
                                <span>🏙️ Ville : {etudiant.ville ?? '—'}</span>
                                <span className="sm:col-span-2">📍 Adresse : {etudiant.adresse ?? '—'}</span>
                                {etudiant.dateNaissance && (
                                    <span>🎂 Né(e) le : {new Date(etudiant.dateNaissance).toLocaleDateString('fr-FR')}</span>
                                )}
                                {etudiant.nomParent && <span>👤 Parent : {etudiant.nomParent}</span>}
                                {etudiant.telParent && <span>📞 Parent : {etudiant.telParent}</span>}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link href={`/directeur/etudiants/${etudiant.id}/modifier`}>
                                    <Button variant="gold" size="sm"><IconEdit /> Modifier</Button>
                                </Link>
                                {etudiant.actif === 1 && (
                                    <Button variant="danger" size="sm" onClick={() => setConfirmDesact(true)}>
                                        <IconTrash /> Désactiver
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* GROUPES + ALERTES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SectionCard title="Groupes actifs" count={etudiant.groupes?.length ?? 0}>
                        {!etudiant.groupes?.length
                            ? <Empty title="Aucun groupe actif" />
                            : <div className="space-y-3">
                                {etudiant.groupes.map(g => (
                                    <div key={g.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge color="gold">{g.langue} · {g.niveau}</Badge>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900 mb-1">{g.nom}</div>
                                        <div className="text-xs text-gray-500 mb-2">👨‍🏫 {g.prof ?? '—'}</div>
                                        {g.emplois?.map((e, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                                                <IconClock />
                                                <span>{e.jour} {e.debut?.slice(0,5)}–{e.fin?.slice(0,5)}</span>
                                                {e.salle && <span>· Salle {e.salle}</span>}
                                            </div>
                                        ))}
                                        <div className="text-xs text-gray-400 mt-1">
                                            Inscrit le {new Date(g.dateInscription).toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </SectionCard>

                    <SectionCard title="Alertes actives" color="danger" count={etudiant.alertes?.length ?? 0}>
                        {!etudiant.alertes?.length
                            ? <Empty title="Aucune alerte active" />
                            : <div className="space-y-2">
                                {etudiant.alertes.map(a => (
                                    <div key={a.id} className="p-3 bg-sirius-danger-light border border-sirius-danger-border rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge color={a.type === 'absence' ? 'orange' : 'red'}>
                                                {a.type === 'absence' ? 'Absence' : 'Paiement'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-700">{a.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(a.date).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        }
                    </SectionCard>
                </div>

                {/* PAIEMENTS */}
                <SectionCard title="Paiements" count={etudiant.paiements?.length ?? 0}>
                    {!etudiant.paiements?.length
                        ? <Empty title="Aucun paiement enregistré" />
                        : <div className="space-y-4">
                            {etudiant.paiements.map(p => {
                                const pct = p.montantTotal > 0 ? Math.round((p.montantPaye / p.montantTotal) * 100) : 0
                                return (
                                    <div key={p.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">{p.groupe} · {p.niveau}</div>
                                                <div className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString('fr-FR')}</div>
                                            </div>
                                            <Badge color={p.statut === 'solde' ? 'green' : 'orange'}>
                                                {p.statut === 'solde' ? 'Soldé' : 'En cours'}
                                            </Badge>
                                        </div>
                                        <div className="mb-3">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                                <span className="text-green-600 font-medium">{p.montantPaye} DH payés</span>
                                                <span className="text-sirius-danger font-medium">Reste {p.reste} DH</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-sirius-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1 text-right">{pct}% · Total {p.montantTotal} DH</div>
                                        </div>
                                        {p.avances?.length > 0 && (
                                            <div className="space-y-1 mb-3">
                                                {p.avances.map(a => (
                                                    <div key={a.id} className="flex items-center justify-between text-xs text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                                                        <span>Avance du {new Date(a.date).toLocaleDateString('fr-FR')}</span>
                                                        <span className="font-semibold text-green-600">+{a.montant} DH</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {p.statut !== 'solde' && (
                                            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                                                <button onClick={() => setModalPaiement(p)}
                                                    className="flex items-center gap-1.5 text-xs text-sirius-gold font-medium hover:opacity-75">
                                                    <IconPlus /> Ajouter une avance
                                                </button>
                                                <button
                                                    onClick={() => { if(confirm('Marquer ce paiement comme soldé ?')) router.patch(`/directeur/paiements/${p.id}/solde`) }}
                                                    className="flex items-center gap-1.5 text-xs text-green-600 font-medium hover:opacity-75 ml-auto">
                                                    <IconCheck /> Marquer comme soldé
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    }
                </SectionCard>

                {/* HISTORIQUE ABSENCES */}
                <SectionCard
                    title="Historique des absences"
                    count={absencesNonJustifiees}
                    color={absencesNonJustifiees >= 3 ? 'danger' : 'gold'}
                >
                    {!etudiant.presences?.length
                        ? <Empty title="Aucune absence enregistrée" />
                        : <div className="overflow-x-auto rounded-xl border border-gray-100">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="table-th">Date</th>
                                        <th className="table-th">Groupe</th>
                                        <th className="table-th text-center">Présent</th>
                                        <th className="table-th text-center">Justifié</th>
                                        <th className="table-th">Motif / Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {etudiant.presences.map(p => (
                                        <tr key={p.id} className={`table-tr ${!p.estPresent && !p.estJustifie ? 'bg-red-50/50' : ''}`}>
                                            <td className="table-td">{new Date(p.dateSeance).toLocaleDateString('fr-FR')}</td>
                                            <td className="table-td text-gray-500">{p.groupe ?? '—'}</td>
                                            <td className="table-td text-center">
                                                {p.estPresent
                                                    ? <span className="text-green-500"><IconCheck /></span>
                                                    : <span className="text-sirius-danger"><IconX /></span>
                                                }
                                            </td>
                                            <td className="table-td text-center">
                                                {p.estJustifie
                                                    ? <span className="text-green-500"><IconCheck /></span>
                                                    : <span className="text-gray-300"><IconX /></span>
                                                }
                                            </td>
                                            <td className="table-td">
                                                {p.estJustifie ? (
                                                    <span className="text-xs text-green-600">{p.motifJustif}</span>
                                                ) : !p.estPresent ? (
                                                    <button
                                                        onClick={() => setModalJustifier(p)}
                                                        className="text-xs text-sirius-gold font-medium hover:opacity-75"
                                                    >
                                                        Justifier →
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-300">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </SectionCard>

                {/* ATTESTATIONS + TRADUCTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SectionCard title="Attestations" count={etudiant.attestations?.length ?? 0}>
                        {!etudiant.attestations?.length
                            ? <Empty title="Aucune attestation" />
                            : <div className="space-y-2">
                                {etudiant.attestations.map(a => {
                                    const s = statutAttest(a.statut)
                                    return (
                                        <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{a.niveau}</div>
                                                <div className="text-xs text-gray-400">{new Date(a.date).toLocaleDateString('fr-FR')}</div>
                                            </div>
                                            <Badge color={s.color}>{s.label}</Badge>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </SectionCard>

                    <SectionCard title="Traductions" count={etudiant.traductions?.length ?? 0}>
                        {!etudiant.traductions?.length
                            ? <Empty title="Aucune traduction" />
                            : <div className="space-y-2">
                                {etudiant.traductions.map(t => {
                                    const s = statutTrad(t.statut)
                                    return (
                                        <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">Demande de traduction</div>
                                                <div className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString('fr-FR')}</div>
                                                {t.montant && <div className="text-xs text-sirius-gold font-medium mt-0.5">{t.montant} DH</div>}
                                            </div>
                                            <Badge color={s.color}>{s.label}</Badge>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </SectionCard>
                </div>
            </div>

            {/* Modals */}
            {modalPaiement && (
                <ModalAvance paiement={modalPaiement} onClose={() => setModalPaiement(null)} onSubmit={handleAvance} />
            )}

            {modalJustifier && (
                <ModalJustifier presence={modalJustifier} onClose={() => setModalJustifier(null)} />
            )}

            {confirmDesactiver && (
                <Modal title="Désactiver l'étudiant" onClose={() => setConfirmDesact(false)}>
                    <ModalBody>
                        <p className="text-sm text-gray-500 text-center">
                            Voulez-vous désactiver <strong>{etudiant.prenom} {etudiant.nom}</strong> ?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setConfirmDesact(false)} className="flex-1">Annuler</Button>
                        <Button variant="danger" onClick={handleDesactiver} className="flex-1">Désactiver</Button>
                    </ModalFooter>
                </Modal>
            )}
        </SiriusLayout>
    )
}