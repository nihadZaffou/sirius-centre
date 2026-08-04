import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Button from '@/Components/UI/Button'
import Badge from '@/Components/UI/Badge'
import Flash from '@/Components/UI/Flash'
import Modal, { ModalBody, ModalFooter } from '@/Components/UI/Modal'
import Input from '@/Components/UI/Input'
import Empty from '@/Components/UI/Empty'

const IconArrow  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
const IconPlus   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconEye    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IconSwap   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
const IconUp     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>
const IconStop   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
const IconX      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const IconClock  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>

// Modal ajouter étudiant au groupe
function ModalAjouter({ groupe, onClose }) {
    const [mode, setMode]         = useState('chercher') // chercher | nouveau
    const [search, setSearch]     = useState('')
    const [resultats, setResultats] = useState([])
    const [etudiant, setEtudiant] = useState(null)
    const [loading, setLoading]   = useState(false)
    const [form, setForm]         = useState({
        nom: '', prenom: '', email: '', telephone: '',
        cin: '', ville: '', adresse: '', nomParent: '', telParent: '',
    })
    const [paiement, setPaiement] = useState({ montantTotal: '', avance: '', dateAvance: new Date().toISOString().split('T')[0] })
    const [errors, setErrors]     = useState({})

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
    const setPay = (k) => (e) => setPaiement(p => ({ ...p, [k]: e.target.value }))

   const handleSearch = async (val) => {
    setSearch(val)
    if (val.length < 2) { setResultats([]); return }
    try {
        const res = await fetch(`/directeur/inscription/rechercher?q=${encodeURIComponent(val)}`, {
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            }
        })
        const data = await res.json()
        setResultats(Array.isArray(data) ? data : [])
    } catch(e) {
        setResultats([])
    }
}
    const submit = (e) => {
        e.preventDefault()
        const errs = {}
        if (!paiement.montantTotal) errs.montantTotal = 'Obligatoire'
        if (mode === 'nouveau') {
            if (!form.nom)    errs.nom    = 'Obligatoire'
            if (!form.prenom) errs.prenom = 'Obligatoire'
            if (!form.email)  errs.email  = 'Obligatoire'
        } else if (!etudiant) {
            errs.etudiant = 'Choisissez un étudiant'
        }
        if (Object.keys(errs).length) { setErrors(errs); return }

        setLoading(true)
        router.post(`/directeur/groupes/${groupe.id}/ajouter`, {
            nouveau:      mode === 'nouveau',
            idEtudiant:   etudiant?.id ?? null,
            ...( mode === 'nouveau' ? form : {} ),
            montantTotal: paiement.montantTotal,
            avance:       paiement.avance || null,
            dateAvance:   paiement.dateAvance,
        }, {
            onSuccess: () => { setLoading(false); onClose() },
            onError:   (e) => { setLoading(false); setErrors(e) },
        })
    }

    return (
        <Modal title="Ajouter un étudiant" subtitle={groupe.nom} onClose={onClose} maxWidth="max-w-xl">
            <form onSubmit={submit}>
                <ModalBody>
                    <div className="space-y-4">

                        {/* Choix mode */}
                        <div className="flex gap-2">
                            <button type="button" onClick={() => { setMode('chercher'); setEtudiant(null) }}
                                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${mode === 'chercher' ? 'bg-sirius-gold text-white border-sirius-gold' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                                Étudiant existant
                            </button>
                            <button type="button" onClick={() => { setMode('nouveau'); setEtudiant(null) }}
                                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${mode === 'nouveau' ? 'bg-sirius-gold text-white border-sirius-gold' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                                Nouvel étudiant
                            </button>
                        </div>

                        {/* Recherche étudiant existant */}
                        {mode === 'chercher' && (
                            <div>
                                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-2">
                                    <IconSearch />
                                    <input
                                        value={search}
                                        onChange={e => handleSearch(e.target.value)}
                                        placeholder="Rechercher par nom, CIN, téléphone..."
                                        className="flex-1 text-sm outline-none"
                                    />
                                </div>
                                {errors.etudiant && <p className="text-xs text-sirius-danger mb-2">{errors.etudiant}</p>}
                                {etudiant ? (
                                    <div className="flex items-center justify-between p-3 bg-sirius-gold-light border border-sirius-gold-border rounded-xl">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{etudiant.prenom} {etudiant.nom}</div>
                                            <div className="text-xs text-gray-400">{etudiant.cin} · {etudiant.telephone}</div>
                                        </div>
                                        <button type="button" onClick={() => setEtudiant(null)} className="text-gray-400 hover:text-sirius-danger">
                                            <IconX />
                                        </button>
                                    </div>
                                ) : resultats.length > 0 && (
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        {resultats.map(r => (
                                            <button key={r.id} type="button" onClick={() => { setEtudiant(r); setResultats([]) }}
                                                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                                <div className="text-sm font-medium text-gray-900">{r.prenom} {r.nom}</div>
                                                <div className="text-xs text-gray-400">{r.cin} · {r.telephone}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Nouveau étudiant */}
                        {mode === 'nouveau' && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Nom" value={form.nom} onChange={set('nom')} error={errors.nom} placeholder="BENALI" required />
                                    <Input label="Prénom" value={form.prenom} onChange={set('prenom')} error={errors.prenom} placeholder="Mohammed" required />
                                </div>
                                <Input label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="email@exemple.com" required />
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Téléphone" value={form.telephone} onChange={set('telephone')} placeholder="0612345678" />
                                    <Input label="CIN" value={form.cin} onChange={set('cin')} placeholder="AB123456" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Ville" value={form.ville} onChange={set('ville')} placeholder="Oujda" />
                                        <Input label="Adresse" value={form.adresse} onChange={set('adresse')} placeholder="Rue, Quartier..." />
                                </div>
                                <Input label="Nom parent" value={form.nomParent} onChange={set('nomParent')} placeholder="Nom du parent" />
                                <Input label="Téléphone parent" value={form.telParent} onChange={set('telParent')} placeholder="0612345678" />
                            </div>
                        )}

                        {/* Paiement */}
                        <div className="border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1 h-4 bg-sirius-gold rounded-full" />
                                <span className="text-sm font-semibold text-gray-900">Paiement</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <Input
                                    label="Montant total (DH)"
                                    type="number" value={paiement.montantTotal}
                                    onChange={setPay('montantTotal')}
                                    error={errors.montantTotal}
                                    placeholder="1200" required
                                />
                                <Input
                                    label="Avance (DH)"
                                    type="number" value={paiement.avance}
                                    onChange={setPay('avance')}
                                    placeholder="400"
                                />
                                <Input
                                    label="Date avance"
                                    type="date" value={paiement.dateAvance}
                                    onChange={setPay('dateAvance')}
                                />
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={onClose} type="button" className="flex-1">Annuler</Button>
                    <Button variant="gold" type="submit" loading={loading} className="flex-1">Ajouter</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

// Modal changer groupe
function ModalChanger({ etudiant, idGroupeActuel, groupesMemeNiveau, onClose }) {
    const [idNouveauGroupe, setIdNouveauGroupe] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState('')

    const submit = (e) => {
        e.preventDefault()
        if (!idNouveauGroupe) { setError('Choisissez un groupe.'); return }
        setLoading(true)
        router.post(`/directeur/appartient/${etudiant.id}/changer`, {
            idGroupeActuel,
            idNouveauGroupe,
        }, {
            onSuccess: () => { setLoading(false); onClose() },
            onError:   () => { setLoading(false); setError('Erreur.') },
        })
    }

    return (
        <Modal title="Changer de groupe" subtitle={`${etudiant.prenom} ${etudiant.nom}`} onClose={onClose}>
            <form onSubmit={submit}>
                <ModalBody>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-500">
                            Choisissez le nouveau groupe pour cet étudiant (même niveau).
                            Le paiement sera transféré automatiquement.
                        </p>
                        {groupesMemeNiveau.length === 0 ? (
                            <div className="empty-state">
                                <p className="text-sm text-gray-400">Aucun autre groupe disponible pour ce niveau.</p>
                            </div>
                        ) : (
                            <div>
                                <label className="label">Nouveau groupe <span className="text-sirius-danger">*</span></label>
                                <select
                                    value={idNouveauGroupe}
                                    onChange={e => { setIdNouveauGroupe(e.target.value); setError('') }}
                                    className={`select ${error ? 'input-error' : ''}`}
                                >
                                    <option value="">Choisir un groupe</option>
                                    {groupesMemeNiveau.map(g => (
                                        <option key={g.id} value={g.id}>{g.nom}</option>
                                    ))}
                                </select>
                                {error && <p className="text-xs text-sirius-danger mt-1">{error}</p>}
                            </div>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={onClose} type="button" className="flex-1">Annuler</Button>
                    <Button variant="gold" type="submit" loading={loading} className="flex-1" disabled={groupesMemeNiveau.length === 0}>
                        Transférer
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

// Modal niveau suivant
function ModalNiveauSuivant({ etudiant, idGroupeActuel, niveauSuivant, onClose }) {
    const [idNiveauChoisi, setIdNiveauChoisi]   = useState('')
    const [idNouveauGroupe, setIdNouveauGroupe] = useState('')
    const [montantTotal, setMontantTotal]       = useState('')
    const [avance, setAvance]                   = useState('')
    const [dateAvance, setDateAvance]           = useState(new Date().toISOString().split('T')[0])
    const [loading, setLoading]                 = useState(false)
    const [errors, setErrors]                   = useState({})

    const niveaux = Array.isArray(niveauSuivant) ? niveauSuivant : []
    const niveauSelectionne = niveaux.find(n => n.id == idNiveauChoisi)
    const groupesDispos = niveauSelectionne?.groupes ?? []

    const handleNiveau = (id) => {
        setIdNiveauChoisi(id)
        setIdNouveauGroupe('')
    }

    const submit = (e) => {
        e.preventDefault()
        const errs = {}
        if (!idNiveauChoisi)   errs.idNiveauChoisi   = 'Choisissez un niveau.'
        if (!idNouveauGroupe)  errs.idNouveauGroupe  = 'Choisissez un groupe.'
        if (!montantTotal)     errs.montantTotal      = 'Obligatoire.'
        if (Object.keys(errs).length) { setErrors(errs); return }

        setLoading(true)
        router.post(`/directeur/appartient/${etudiant.id}/niveau-suivant`, {
            idGroupeActuel,
            idNouveauGroupe,
            montantTotal,
            avance:     avance || null,
            dateAvance,
        }, {
            onSuccess: () => { setLoading(false); onClose() },
            onError:   (e) => { setLoading(false); setErrors(e) },
        })
    }

    if (niveaux.length === 0) return (
        <Modal title="Changer de niveau" onClose={onClose}>
            <ModalBody>
                <div className="empty-state">
                    <p className="text-sm text-gray-400">Aucun autre niveau disponible avec des groupes actifs.</p>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button variant="outline" onClick={onClose} className="flex-1">Fermer</Button>
            </ModalFooter>
        </Modal>
    )

    return (
        <Modal title="Changer de niveau" subtitle={`${etudiant.prenom} ${etudiant.nom}`} onClose={onClose}>
            <form onSubmit={submit}>
                <ModalBody>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Niveau <span className="text-sirius-danger">*</span></label>
                            <select
                                value={idNiveauChoisi}
                                onChange={e => handleNiveau(e.target.value)}
                                className={`select ${errors.idNiveauChoisi ? 'input-error' : ''}`}
                            >
                                <option value="">Choisir un niveau</option>
                                {niveaux.map(n => (
                                    <option key={n.id} value={n.id}>{n.nom}</option>
                                ))}
                            </select>
                            {errors.idNiveauChoisi && <p className="text-xs text-sirius-danger mt-1">{errors.idNiveauChoisi}</p>}
                        </div>

                        {idNiveauChoisi && (
                            <div>
                                <label className="label">Groupe <span className="text-sirius-danger">*</span></label>
                                <select
                                    value={idNouveauGroupe}
                                    onChange={e => setIdNouveauGroupe(e.target.value)}
                                    className={`select ${errors.idNouveauGroupe ? 'input-error' : ''}`}
                                >
                                    <option value="">Choisir un groupe</option>
                                    {groupesDispos.map(g => (
                                        <option key={g.id} value={g.id}>{g.nom}</option>
                                    ))}
                                </select>
                                {errors.idNouveauGroupe && <p className="text-xs text-sirius-danger mt-1">{errors.idNouveauGroupe}</p>}
                            </div>
                        )}

                        <div className="border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1 h-4 bg-sirius-gold rounded-full" />
                                <span className="text-sm font-semibold text-gray-900">Paiement nouveau niveau</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <Input label="Montant total (DH)" type="number" value={montantTotal}
                                    onChange={e => setMontantTotal(e.target.value)} error={errors.montantTotal}
                                    placeholder="1200" required />
                                <Input label="Avance (DH)" type="number" value={avance}
                                    onChange={e => setAvance(e.target.value)} placeholder="400" />
                                <Input label="Date avance" type="date" value={dateAvance}
                                    onChange={e => setDateAvance(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={onClose} type="button" className="flex-1">Annuler</Button>
                    <Button variant="gold" type="submit" loading={loading} className="flex-1">Confirmer</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

// Modal confirmer action (abandon / terminer)
function ModalStatut({ etudiant, idGroupe, statut, onClose }) {
    const [loading, setLoading] = useState(false)
    const isAbandon = statut === 'abandonne'

    const submit = () => {
        setLoading(true)
        router.patch(`/directeur/appartient/${etudiant.id}/statut`, {
            idGroupe,
            statut,
        }, {
            onSuccess: () => { setLoading(false); onClose() },
            onError:   () => setLoading(false),
        })
    }

    return (
        <Modal
            title={isAbandon ? "Marquer comme abandonné" : "Terminer l'inscription"}
            onClose={onClose}
        >
            <ModalBody>
                <p className="text-sm text-gray-500 text-center">
                    {isAbandon
                        ? `Voulez-vous marquer l'inscription de `
                        : `Voulez-vous terminer l'inscription de `
                    }
                    <strong>{etudiant.prenom} {etudiant.nom}</strong> comme{' '}
                    <strong>{isAbandon ? 'abandonnée' : 'terminée'}</strong> ?
                    <br />
                    <span className="text-xs text-gray-400 mt-1 block">L'historique sera conservé.</span>
                </p>
            </ModalBody>
            <ModalFooter>
                <Button variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
                <Button variant={isAbandon ? 'danger' : 'dark'} onClick={submit} loading={loading} className="flex-1">
                    {isAbandon ? 'Marquer abandonné' : 'Terminer'}
                </Button>
            </ModalFooter>
        </Modal>
    )
}

// Badge statut inscription
function StatutBadge({ statut }) {
    const map = {
        actif:     { label: 'Actif',     color: 'green' },
        termine:   { label: 'Terminé',   color: 'gray' },
        abandonne: { label: 'Abandonné', color: 'red' },
    }
    const s = map[statut] ?? { label: statut, color: 'gray' }
    return <Badge color={s.color}>{s.label}</Badge>
}

export default function Etudiants({ groupe, etudiants = [], groupesMemeNiveau = [], niveauSuivant = null }) {
    const { props }               = usePage()
    const flash                   = props.flash ?? {}
    const [filtre, setFiltre]     = useState('actif')
    const [modalAjouter, setModalAjouter]   = useState(false)
    const [modalChanger, setModalChanger]   = useState(null)
    const [modalNiveau, setModalNiveau]     = useState(null)
    const [modalStatut, setModalStatut]     = useState(null)

    const etudiantsFiltres = filtre === 'tous'
        ? etudiants
        : etudiants.filter(e => e.statutInscription === filtre)

    const actifs   = etudiants.filter(e => e.statutInscription === 'actif').length
    const anciens  = etudiants.filter(e => e.statutInscription !== 'actif').length

    return (
        <SiriusLayout title={`${groupe.langue} · ${groupe.niveau} · ${groupe.nom}`}>
           <Flash success={flash.success} error={flash.error} />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" onClick={() => router.get(`/directeur/niveaux/${groupe.idNiveau}/groupes`)}>
                    <IconArrow />
                </Button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h1 className="text-2xl font-bold text-gray-900">{groupe.nom}</h1>
                        <Badge color="gold">{groupe.langue} · {groupe.niveau}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>👨‍🏫 {groupe.prof ?? '—'}</span>
                        <span>{actifs} actifs · {anciens} anciens</span>
                        {groupe.emplois?.map((e, i) => (
                            <span key={i} className="flex items-center gap-1">
                                <IconClock /> {e.jour} {e.debut?.slice(0,5)}–{e.fin?.slice(0,5)}
                            </span>
                        ))}
                    </div>
                </div>
                <Button variant="gold" onClick={() => setModalAjouter(true)}>
                    <IconPlus /> Ajouter étudiant
                </Button>
            </div>

            {/* Filtres */}
            <div className="flex gap-2 mb-6">
                {[
                    { label: `Actifs (${actifs})`,  value: 'actif' },
                    { label: `Anciens (${anciens})`, value: 'ancien' },
                    { label: `Tous (${etudiants.length})`, value: 'tous' },
                ].map(f => (
                    <button key={f.value} onClick={() => setFiltre(f.value === 'ancien' ? 'termine' : f.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            (filtre === f.value || (f.value === 'ancien' && filtre === 'termine'))
                                ? 'bg-sirius-dark text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Tableau */}
            <div className="table-wrapper">
                {etudiantsFiltres.length === 0 ? (
                    <Empty title="Aucun étudiant" subtitle="Ajoutez le premier étudiant à ce groupe" />
                ) : (
                    <>
                        {/* Desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="table-header">
                                    <tr>
                                        <th className="table-th">Étudiant</th>
                                        <th className="table-th">CIN</th>
                                        <th className="table-th">Paiement</th>
                                        <th className="table-th">Absences</th>
                                        <th className="table-th">Inscription</th>
                                        <th className="table-th">Statut</th>
                                        <th className="table-th text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {etudiantsFiltres.map(e => (
                                        <tr key={e.id} className="table-tr">
                                            <td className="table-td">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-sirius-gold-light border border-sirius-gold-border flex items-center justify-center text-sirius-gold text-xs font-semibold flex-shrink-0">
                                                        {e.prenom?.[0]}{e.nom?.[0]}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-medium text-gray-900 truncate">{e.prenom} {e.nom}</div>
                                                        <div className="text-xs text-gray-400">{e.telephone ?? '—'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="table-td">{e.cin ?? '—'}</td>
                                            <td className="table-td">
                                                {e.paiement ? (
                                                    e.paiement.statut === 'solde'
                                                        ? <Badge color="green">Soldé ✓</Badge>
                                                        : <Badge color="red">Reste {e.paiement.reste} DH</Badge>
                                                ) : <span className="text-xs text-gray-300">—</span>}
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
                                                <div className="text-xs text-gray-500">
                                                    {new Date(e.dateInscription).toLocaleDateString('fr-FR')}
                                                    {e.dateFin && <span className="block text-gray-400">→ {new Date(e.dateFin).toLocaleDateString('fr-FR')}</span>}
                                                </div>
                                            </td>
                                            <td className="table-td">
                                                <StatutBadge statut={e.statutInscription} />
                                            </td>
                                            <td className="table-td">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => router.get(`/directeur/etudiants/${e.id}`)}
                                                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-sirius-dark hover:text-white transition-all" title="Voir fiche">
                                                        <IconEye />
                                                    </button>
                                                    {e.statutInscription === 'actif' && (
                                                        <>
                                                            <button onClick={() => setModalChanger(e)}
                                                                className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all" title="Changer groupe">
                                                                <IconSwap />
                                                            </button>
                                                            <button onClick={() => setModalNiveau(e)}
                                                                className="w-8 h-8 rounded-lg bg-sirius-gold-light flex items-center justify-center text-sirius-gold hover:bg-sirius-gold hover:text-white transition-all" title="Niveau suivant">
                                                                <IconUp />
                                                            </button>
                                                            <button onClick={() => setModalStatut({ etudiant: e, statut: 'termine' })}
                                                                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-600 hover:text-white transition-all" title="Terminer">
                                                                <IconStop />
                                                            </button>
                                                            <button onClick={() => setModalStatut({ etudiant: e, statut: 'abandonne' })}
                                                                className="w-8 h-8 rounded-lg bg-sirius-danger-light flex items-center justify-center text-sirius-danger hover:bg-sirius-danger hover:text-white transition-all" title="Abandon">
                                                                <IconX />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {etudiantsFiltres.map(e => (
                                <div key={e.id} className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">{e.prenom} {e.nom}</div>
                                            <div className="text-xs text-gray-400">{e.cin ?? '—'} · {e.telephone ?? '—'}</div>
                                        </div>
                                        <StatutBadge statut={e.statutInscription} />
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {e.paiement?.reste > 0 && <Badge color="red">Reste {e.paiement.reste} DH</Badge>}
                                        {e.paiement?.statut === 'solde' && <Badge color="green">Soldé ✓</Badge>}
                                        {e.absences >= 3 && <Badge color="red">{e.absences} abs. ⚠️</Badge>}
                                    </div>
                                    {e.statutInscription === 'actif' && (
                                        <div className="flex gap-2 flex-wrap">
                                            <Button variant="ghost" size="sm" onClick={() => router.get(`/directeur/etudiants/${e.id}`)}>
                                                <IconEye /> Fiche
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => setModalChanger(e)}>
                                                <IconSwap /> Changer
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => setModalNiveau(e)}>
                                                <IconUp /> Niveau+
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => setModalStatut({ etudiant: e, statut: 'abandonne' })}>
                                                <IconX />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {modalAjouter && (
                <ModalAjouter groupe={groupe} onClose={() => setModalAjouter(false)} />
            )}
            {modalChanger && (
                <ModalChanger
                    etudiant={modalChanger}
                    idGroupeActuel={groupe.id}
                    groupesMemeNiveau={groupesMemeNiveau}
                    onClose={() => setModalChanger(null)}
                />
            )}
            {modalNiveau && (
                <ModalNiveauSuivant
                    etudiant={modalNiveau}
                    idGroupeActuel={groupe.id}
                    niveauSuivant={niveauSuivant}
                    onClose={() => setModalNiveau(null)}
                />
            )}
            {modalStatut && (
                <ModalStatut
                    etudiant={modalStatut.etudiant}
                    idGroupe={groupe.id}
                    statut={modalStatut.statut}
                    onClose={() => setModalStatut(null)}
                />
            )}
        </SiriusLayout>
    )
}