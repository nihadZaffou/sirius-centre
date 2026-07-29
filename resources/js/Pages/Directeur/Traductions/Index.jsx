import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Button from '@/Components/UI/Button'
import Badge from '@/Components/UI/Badge'
import Modal, { ModalBody, ModalFooter } from '@/Components/UI/Modal'
import Input from '@/Components/UI/Input'
import Flash from '@/Components/UI/Flash'
import Empty from '@/Components/UI/Empty'

const IconPlus  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
const IconDoc   = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>

const STATUTS = {
    demande:    { label: 'Déposé',       color: 'blue',   next: 'en_attente', nextLabel: 'Mettre en attente' },
    en_attente: { label: 'En attente',   color: 'orange', next: 'approuve',   nextLabel: 'Marquer approuvé' },
    approuve:   { label: 'Approuvé',     color: 'green',  next: 'retour',     nextLabel: 'Prêt à récupérer' },
    retour:     { label: 'À récupérer',  color: 'gold',   next: 'recupere',   nextLabel: 'Marquer récupéré' },
    recupere:   { label: 'Récupéré',     color: 'gray',   next: null,         nextLabel: null },
}
function ModalCreer({ etudiants, onClose }) {
    const [externe, setExterne]           = useState(false)
    const [search, setSearch]             = useState('')
    const [resultats, setResultats]       = useState([])
    const [etudiant, setEtudiant]         = useState(null)
    const [formExterne, setFormExterne]   = useState({ nomExterne: '', prenomExterne: '', telephoneExterne: '' })
    const [montant, setMontant]           = useState('')
    const [errors, setErrors]             = useState({})
    const [loading, setLoading]           = useState(false)

    const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
    const IconX      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

    const handleSearch = async (val) => {
        setSearch(val)
        if (val.length < 2) { setResultats([]); return }
        try {
            const res  = await fetch(`/directeur/inscription/rechercher?q=${encodeURIComponent(val)}`, {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
            })
            const data = await res.json()
            setResultats(Array.isArray(data) ? data : [])
        } catch { setResultats([]) }
    }

    const submit = (e) => {
        e.preventDefault()
        const errs = {}
        if (!externe && !etudiant)          errs.etudiant      = 'Choisissez un étudiant'
        if (externe && !formExterne.nomExterne)    errs.nomExterne    = 'Obligatoire'
        if (externe && !formExterne.prenomExterne) errs.prenomExterne = 'Obligatoire'
        if (!montant)                       errs.montant       = 'Obligatoire'
        if (Object.keys(errs).length) { setErrors(errs); return }

        setLoading(true)
        router.post('/directeur/traductions', {
            externe,
            idEtudiant:       externe ? null : etudiant?.id,
            ...( externe ? formExterne : {} ),
            montant,
        }, {
            onSuccess: () => { setLoading(false); onClose() },
            onError:   (e) => { setLoading(false); setErrors(e) },
        })
    }

    return (
        <Modal title="Nouvelle demande de traduction" onClose={onClose}>
            <form onSubmit={submit}>
                <ModalBody>
                    <div className="space-y-4">

                        {/* Toggle étudiant / externe */}
                        <div className="flex gap-2">
                            <button type="button"
                                onClick={() => { setExterne(false); setEtudiant(null); setSearch(''); setErrors({}) }}
                                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${!externe ? 'bg-sirius-gold text-white border-sirius-gold' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                                Étudiant du centre
                            </button>
                            <button type="button"
                                onClick={() => { setExterne(true); setEtudiant(null); setSearch(''); setErrors({}) }}
                                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${externe ? 'bg-sirius-gold text-white border-sirius-gold' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                                Personne externe
                            </button>
                        </div>

                        {/* Étudiant du centre */}
                        {!externe && (
                            <div>
                                <label className="label">Étudiant <span className="text-sirius-danger">*</span></label>
                                {etudiant ? (
                                    <div className="flex items-center justify-between p-3 bg-sirius-gold-light border border-sirius-gold-border rounded-xl">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{etudiant.prenom} {etudiant.nom}</div>
                                            <div className="text-xs text-gray-400">{etudiant.cin} · {etudiant.telephone}</div>
                                        </div>
                                        <button type="button" onClick={() => { setEtudiant(null); setSearch('') }}
                                            className="text-gray-400 hover:text-sirius-danger">
                                            <IconX />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-2">
                                            <IconSearch />
                                            <input value={search} onChange={e => handleSearch(e.target.value)}
                                                placeholder="Nom, CIN, téléphone..."
                                                className="flex-1 text-sm outline-none" />
                                        </div>
                                        {errors.etudiant && <p className="text-xs text-sirius-danger mb-2">{errors.etudiant}</p>}
                                        {resultats.length > 0 && (
                                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                                {resultats.map(r => (
                                                    <button key={r.id} type="button"
                                                        onClick={() => { setEtudiant(r); setResultats([]) }}
                                                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                                        <div className="text-sm font-medium text-gray-900">{r.prenom} {r.nom}</div>
                                                        <div className="text-xs text-gray-400">{r.cin} · {r.telephone}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Personne externe */}
                        {externe && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Nom" value={formExterne.nomExterne}
                                        onChange={e => setFormExterne(f => ({ ...f, nomExterne: e.target.value }))}
                                        error={errors.nomExterne} placeholder="BENALI" required
                                    />
                                    <Input
                                        label="Prénom" value={formExterne.prenomExterne}
                                        onChange={e => setFormExterne(f => ({ ...f, prenomExterne: e.target.value }))}
                                        error={errors.prenomExterne} placeholder="Mohammed" required
                                    />
                                </div>
                                <Input
                                    label="Téléphone" value={formExterne.telephoneExterne}
                                    onChange={e => setFormExterne(f => ({ ...f, telephoneExterne: e.target.value }))}
                                    placeholder="0612345678"
                                />
                                <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                                    <p className="text-xs text-blue-600">
                                        Personne externe — aucun compte ne sera créé dans le système.
                                    </p>
                                </div>
                            </div>
                        )}

                        <Input
                            label="Montant (DH)"
                            type="number"
                            value={montant}
                            onChange={e => setMontant(e.target.value)}
                            error={errors.montant}
                            placeholder="150"
                            required
                        />

                        <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2">
                            Statut initial : <strong>Déposé</strong> — le document vient d'être remis au centre.
                        </p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={onClose} type="button" className="flex-1">Annuler</Button>
                    <Button variant="gold" type="submit" loading={loading} className="flex-1">Créer</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export default function Index({ traductions = [], etudiants = [] }) {
    const { props }                   = usePage()
    const flash                       = props.flash ?? {}
    const [modalCreer, setModalCreer] = useState(false)
    const [toDelete, setToDelete]     = useState(null)
    const [filtre, setFiltre]         = useState('tous')

    const traductionsFiltrees = filtre === 'tous'
        ? traductions
        : traductions.filter(t => t.statut === filtre)

    const avancer = (id, statut) => {
        router.patch(`/directeur/traductions/${id}/statut`, { statut }, { preserveScroll: true })
    }

    const handleDelete = () => {
        router.delete(`/directeur/traductions/${toDelete.id}`, {
            onSuccess: () => setToDelete(null),
        })
    }

    // Stats par statut
    const stats = Object.keys(STATUTS).reduce((acc, k) => {
        acc[k] = traductions.filter(t => t.statut === k).length
        return acc
    }, {})

    return (
        <SiriusLayout title="Traductions">
            <Flash success={flash.success} error={flash.error} />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Traductions</h1>
                    <p className="page-subtitle">{traductions.length} demande{traductions.length > 1 ? 's' : ''}</p>
                </div>
                <Button variant="gold" onClick={() => setModalCreer(true)}>
                    <IconPlus /> Nouvelle demande
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {Object.entries(STATUTS).map(([k, v]) => (
                    <div key={k} className="card-p text-center cursor-pointer hover:border-sirius-gold transition-all"
                        onClick={() => setFiltre(filtre === k ? 'tous' : k)}>
                        <div className={`text-2xl font-bold mb-1 ${filtre === k ? 'text-sirius-gold' : 'text-gray-900'}`}>
                            {stats[k] ?? 0}
                        </div>
                        <Badge color={v.color}>{v.label}</Badge>
                    </div>
                ))}
            </div>

            {/* Filtres */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button onClick={() => setFiltre('tous')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        filtre === 'tous' ? 'bg-sirius-dark text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    Tous ({traductions.length})
                </button>
                {Object.entries(STATUTS).map(([k, v]) => (
                    <button key={k} onClick={() => setFiltre(k)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            filtre === k ? 'bg-sirius-dark text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}>
                        {v.label} ({stats[k] ?? 0})
                    </button>
                ))}
            </div>

            {/* Liste */}
            {traductionsFiltrees.length === 0 ? (
                <Empty title="Aucune demande" subtitle="Créez la première demande de traduction" icon={<IconDoc />} />
            ) : (
                <div className="table-wrapper">
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th">Étudiant</th>
                                    <th className="table-th">Montant</th>
                                    <th className="table-th">Date demande</th>
                                    <th className="table-th">Statut</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {traductionsFiltrees.map(t => {
                                    const s = STATUTS[t.statut] ?? STATUTS.demande
                                    return (
                                        <tr key={t.id} className="table-tr">
                                            <td className="table-td">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-sirius-gold-light border border-sirius-gold-border flex items-center justify-center text-sirius-gold text-xs font-semibold">
                                                        {t.etudiant.prenom?.[0]}{t.etudiant.nom?.[0]}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{t.etudiant.prenom} {t.etudiant.nom}</div>
                                                        <div className="text-xs text-gray-400">{t.etudiant.telephone}{t.externe && <Badge color="blue">Externe</Badge>}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="table-td">
                                                <span className="text-sm font-semibold text-sirius-gold">{t.montant} DH</span>
                                            </td>
                                            <td className="table-td">
                                                <span className="text-sm text-gray-600">
                                                    {new Date(t.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                            </td>
                                            <td className="table-td">
                                                <Badge color={s.color}>{s.label}</Badge>
                                            </td>
                                            <td className="table-td">
                                                <div className="flex items-center justify-end gap-2">
                                                    {s.next && (
                                                        <Button variant="gold" size="sm" onClick={() => avancer(t.id, s.next)}>
                                                            {s.nextLabel} →
                                                        </Button>
                                                    )}
                                                    <button
                                                        onClick={() => setToDelete(t)}
                                                        className="w-8 h-8 rounded-lg bg-sirius-danger-light flex items-center justify-center text-sirius-danger hover:bg-sirius-danger hover:text-white transition-all"
                                                    >
                                                        <IconTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {traductionsFiltrees.map(t => {
                            const s = STATUTS[t.statut] ?? STATUTS.demande
                            return (
                                <div key={t.id} className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">{t.etudiant.prenom} {t.etudiant.nom}</div>
                                            <div className="text-xs text-gray-400">{t.etudiant.telephone}</div>
                                        </div>
                                        <Badge color={s.color}>{s.label}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-sirius-gold">{t.montant} DH</span>
                                        <div className="flex gap-2">
                                            {s.next && (
                                                <Button variant="gold" size="sm" onClick={() => avancer(t.id, s.next)}>
                                                    {s.nextLabel} →
                                                </Button>
                                            )}
                                            <button onClick={() => setToDelete(t)}
                                                className="w-8 h-8 rounded-lg bg-sirius-danger-light flex items-center justify-center text-sirius-danger hover:bg-sirius-danger hover:text-white transition-all">
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {modalCreer && <ModalCreer etudiants={etudiants} onClose={() => setModalCreer(false)} />}

            {toDelete && (
                <Modal title="Supprimer la demande" onClose={() => setToDelete(null)}>
                    <ModalBody>
                        <p className="text-sm text-gray-500 text-center">
                            Voulez-vous supprimer la demande de <strong>{toDelete.etudiant.prenom} {toDelete.etudiant.nom}</strong> ?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setToDelete(null)} className="flex-1">Annuler</Button>
                        <Button variant="danger" onClick={handleDelete} className="flex-1">Supprimer</Button>
                    </ModalFooter>
                </Modal>
            )}
        </SiriusLayout>
    )
}