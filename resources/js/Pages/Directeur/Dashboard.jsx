import { useState, useRef } from 'react'
import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Badge from '@/Components/UI/Badge'
import Button from '@/Components/UI/Button'
import Modal, { ModalBody, ModalFooter } from '@/Components/UI/Modal'
import Input from '@/Components/UI/Input'
import Flash from '@/Components/UI/Flash'

const IconPlus      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconEtudiants = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
const IconGroupes   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const IconProfs     = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
const IconImpayes   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const IconBellOff   = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
const IconCalOff    = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="9" y1="16" x2="15" y2="16"/></svg>
const IconSearch    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const IconX         = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconTrash     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>

function StatCard({ icon, label, value, danger = false }) {
    return (
        <div className="card-p">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                danger ? 'bg-sirius-danger-light border border-sirius-danger-border text-sirius-danger'
                       : 'bg-sirius-gold-light border border-sirius-gold-border text-sirius-gold'
            }`}>{icon}</div>
            <div className={`text-3xl font-bold leading-none mb-1.5 ${danger ? 'text-sirius-danger' : 'text-gray-900'}`}>{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
        </div>
    )
}

function SectionCard({ title, color = 'gold', action, children }) {
    return (
        <div className="card overflow-hidden">
            <div className="section-header">
                <div className="flex items-center gap-2.5">
                    <div className={`w-1 h-5 rounded-full ${color === 'gold' ? 'bg-sirius-gold' : 'bg-sirius-danger'}`} />
                    <span className="text-[15px] font-semibold text-gray-900">{title}</span>
                </div>
                {action}
            </div>
            <div className="section-body">{children}</div>
        </div>
    )
}

function EmptyBox({ icon, text }) {
    return (
        <div className="empty-state">
            <div className="flex justify-center mb-2 text-gray-300">{icon}</div>
            <p className="text-sm text-gray-400">{text}</p>
        </div>
    )
}

function ModalInscription({ onClose }) {
    const [etape, setEtape]     = useState(1)
    const [mode, setMode]       = useState('chercher')
    const [search, setSearch]   = useState('')
    const [resultats, setResultats] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors]   = useState({})

    const etudiantRef = useRef(null)
    const [etudiantDisplay, setEtudiantDisplay] = useState(null)

    const [formEtudiant, setFormEtudiant] = useState({
        nom: '', prenom: '', email: '', telephone: '',
        cin: '', ville: '', adresse: '', nomParent: '', telParent: '',
    })

    const [langues, setLangues]               = useState([])
    const [niveauxDispos, setNiveauxDispos]   = useState([])
    const [groupesDispos, setGroupesDispos]   = useState([])
    const [idLangue, setIdLangue]             = useState('')
    const [idNiveau, setIdNiveau]             = useState('')
    const [idGroupe, setIdGroupe]             = useState('')
    const [groupesChoisis, setGroupesChoisis] = useState([])
    const [paiements, setPaiements]           = useState({})

    const setForm = (k) => (e) => setFormEtudiant(f => ({ ...f, [k]: e.target.value }))

    const selectEtudiant = (r) => {
        etudiantRef.current = r
        setEtudiantDisplay(r)
        setResultats([])
        setSearch('')
    }

    const clearEtudiant = () => {
        etudiantRef.current = null
        setEtudiantDisplay(null)
    }

    const switchMode = (newMode) => {
        setMode(newMode)
        clearEtudiant()
        setErrors({})
    }

    const chargerLangues = async () => {
        try {
            const res  = await fetch('/directeur/inscription/data', {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
            })
            const data = await res.json()
            setLangues(data.langues ?? [])
        } catch(e) { console.error('Erreur chargement langues:', e) }
    }

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

    const handleLangue = (id) => {
        setIdLangue(id); setIdNiveau(''); setIdGroupe('')
        const langue = langues.find(l => l.id == id)
        setNiveauxDispos(langue?.niveaux ?? [])
        setGroupesDispos([])
    }

    const handleNiveau = (id) => {
        setIdNiveau(id); setIdGroupe('')
        const niveau = niveauxDispos.find(n => n.id == id)
        setGroupesDispos(niveau?.groupes ?? [])
    }

    const ajouterGroupe = () => {
        if (!idGroupe) return
        const groupe = groupesDispos.find(g => g.id == idGroupe)
        if (!groupe || groupesChoisis.find(g => g.id == idGroupe)) return
        const langue = langues.find(l => l.id == idLangue)
        const niveau = niveauxDispos.find(n => n.id == idNiveau)
        setGroupesChoisis(prev => [...prev, { id: groupe.id, nom: groupe.nom, langue: langue?.nom, niveau: niveau?.nom }])
        setPaiements(prev => ({ ...prev, [groupe.id]: { montantTotal: '', avance: '', dateAvance: new Date().toISOString().split('T')[0] } }))
        setIdGroupe('')
    }

    const retirerGroupe = (id) => {
        setGroupesChoisis(prev => prev.filter(g => g.id !== id))
        setPaiements(prev => { const p = { ...prev }; delete p[id]; return p })
    }

    const setPaiement = (idG, k, v) => setPaiements(prev => ({ ...prev, [idG]: { ...prev[idG], [k]: v } }))

    const etapeSuivante = async () => {
        if (etape === 1) {
            const errs = {}
            if (mode === 'chercher' && !etudiantRef.current) errs.etudiant = 'Choisissez un étudiant.'
            if (mode === 'nouveau') {
                if (!formEtudiant.nom)    errs.nom    = 'Obligatoire'
                if (!formEtudiant.prenom) errs.prenom = 'Obligatoire'
                if (!formEtudiant.email)  errs.email  = 'Obligatoire'
            }
            if (Object.keys(errs).length) { setErrors(errs); return }
            setErrors({})
            await chargerLangues()
            setEtape(2)
        } else if (etape === 2) {
            if (groupesChoisis.length === 0) { setErrors({ groupes: 'Ajoutez au moins un groupe.' }); return }
            setErrors({})
            setEtape(3)
        }
    }

    const submit = () => {
        const errs = {}
        groupesChoisis.forEach(g => {
            if (!paiements[g.id]?.montantTotal) errs[`montant_${g.id}`] = 'Obligatoire'
        })
        if (Object.keys(errs).length) { setErrors(errs); return }

        setLoading(true)
        const inscriptions = groupesChoisis.map(g => ({
            idGroupe:     g.id,
            montantTotal: paiements[g.id].montantTotal,
            avance:       paiements[g.id].avance || null,
            dateAvance:   paiements[g.id].dateAvance,
        }))

        // CRITIQUE : forcer idEtudiant à null si mode nouveau
        const payload = mode === 'nouveau'
            ? {
                nouveau: true,
                idEtudiant: null,
                ...formEtudiant,
                inscriptions,
            }
            : {
                nouveau: false,
                idEtudiant: etudiantRef.current?.id ?? null,
                inscriptions,
            }

        router.post('/directeur/inscription', payload, {
            onSuccess: () => { setLoading(false); onClose() },
            onError:   (e) => { setLoading(false); setErrors(e) },
            onFinish:  () => setLoading(false),
        })
    }

    return (
        <Modal
            title={`Nouvelle inscription — Étape ${etape}/3`}
            subtitle={etape === 1 ? 'Étudiant' : etape === 2 ? 'Groupes' : 'Paiements'}
            onClose={onClose}
            maxWidth="max-w-xl"
        >
            <ModalBody>

                {etape === 1 && (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <button type="button"
                                onClick={() => switchMode('chercher')}
                                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${mode === 'chercher' ? 'bg-sirius-gold text-white border-sirius-gold' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                                Étudiant existant
                            </button>
                            <button type="button"
                                onClick={() => switchMode('nouveau')}
                                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${mode === 'nouveau' ? 'bg-sirius-gold text-white border-sirius-gold' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                                Nouvel étudiant
                            </button>
                        </div>

                        {mode === 'chercher' && (
                            <div>
                                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-2">
                                    <IconSearch />
                                    <input value={search} onChange={e => handleSearch(e.target.value)}
                                        placeholder="Nom, CIN, téléphone..."
                                        className="flex-1 text-sm outline-none" />
                                </div>
                                {errors.etudiant && <p className="text-xs text-sirius-danger mb-2">{errors.etudiant}</p>}

                                {etudiantDisplay ? (
                                    <div className="flex items-center justify-between p-3 bg-sirius-gold-light border border-sirius-gold-border rounded-xl">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{etudiantDisplay.prenom} {etudiantDisplay.nom}</div>
                                            <div className="text-xs text-gray-400">{etudiantDisplay.cin} · {etudiantDisplay.telephone}</div>
                                        </div>
                                        <button type="button" onClick={clearEtudiant} className="text-gray-400 hover:text-sirius-danger">
                                            <IconX />
                                        </button>
                                    </div>
                                ) : resultats.length > 0 && (
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        {resultats.map(r => (
                                            <button key={r.id} type="button"
                                                onClick={() => selectEtudiant(r)}
                                                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                                <div className="text-sm font-medium text-gray-900">{r.prenom} {r.nom}</div>
                                                <div className="text-xs text-gray-400">{r.cin} · {r.telephone}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {mode === 'nouveau' && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Nom" value={formEtudiant.nom} onChange={setForm('nom')} error={errors.nom} placeholder="BENALI" required />
                                    <Input label="Prénom" value={formEtudiant.prenom} onChange={setForm('prenom')} error={errors.prenom} placeholder="Mohammed" required />
                                </div>
                                <Input label="Email" type="email" value={formEtudiant.email} onChange={setForm('email')} error={errors.email} placeholder="email@exemple.com" required />
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Téléphone" value={formEtudiant.telephone} onChange={setForm('telephone')} placeholder="0612345678" />
                                    <Input label="CIN" value={formEtudiant.cin} onChange={setForm('cin')} placeholder="AB123456" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Ville" value={formEtudiant.ville} onChange={setForm('ville')} placeholder="Fès" />
                                    <Input label="Adresse" value={formEtudiant.adresse} onChange={setForm('adresse')} placeholder="Rue..." />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Nom parent" value={formEtudiant.nomParent} onChange={setForm('nomParent')} placeholder="Nom du parent" />
                                    <Input label="Tél parent" value={formEtudiant.telParent} onChange={setForm('telParent')} placeholder="0612345678" />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {etape === 2 && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            Groupes pour <strong>{etudiantDisplay ? `${etudiantDisplay.prenom} ${etudiantDisplay.nom}` : `${formEtudiant.prenom} ${formEtudiant.nom}`}</strong>
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="label">Langue</label>
                                <select value={idLangue} onChange={e => handleLangue(e.target.value)} className="select text-sm">
                                    <option value="">Langue</option>
                                    {langues.map(l => <option key={l.id} value={l.id}>{l.nom}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Niveau</label>
                                <select value={idNiveau} onChange={e => handleNiveau(e.target.value)} className="select text-sm" disabled={!idLangue}>
                                    <option value="">Niveau</option>
                                    {niveauxDispos.map(n => <option key={n.id} value={n.id}>{n.nom}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Groupe</label>
                                <select value={idGroupe} onChange={e => setIdGroupe(e.target.value)} className="select text-sm" disabled={!idNiveau}>
                                    <option value="">Groupe</option>
                                    {groupesDispos.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
                                </select>
                            </div>
                        </div>
                        <Button variant="gold" size="sm" onClick={ajouterGroupe} disabled={!idGroupe}>
                            <IconPlus /> Ajouter ce groupe
                        </Button>
                        {errors.groupes && <p className="text-xs text-sirius-danger">{errors.groupes}</p>}
                        {groupesChoisis.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Groupes sélectionnés :</p>
                                {groupesChoisis.map(g => (
                                    <div key={g.id} className="flex items-center justify-between p-3 bg-sirius-gold-light border border-sirius-gold-border rounded-xl">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{g.nom}</div>
                                            <div className="text-xs text-gray-500">{g.langue} · {g.niveau}</div>
                                        </div>
                                        <button onClick={() => retirerGroupe(g.id)} className="text-sirius-danger hover:opacity-75"><IconTrash /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {etape === 3 && (
                    <div className="space-y-4">
                        {groupesChoisis.map(g => (
                            <div key={g.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-4 bg-sirius-gold rounded-full" />
                                    <span className="text-sm font-semibold text-gray-900">{g.nom}</span>
                                    <span className="text-xs text-gray-400">{g.langue} · {g.niveau}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <Input label="Montant total (DH)" type="number"
                                        value={paiements[g.id]?.montantTotal ?? ''}
                                        onChange={e => setPaiement(g.id, 'montantTotal', e.target.value)}
                                        error={errors[`montant_${g.id}`]} placeholder="1200" required />
                                    <Input label="Avance (DH)" type="number"
                                        value={paiements[g.id]?.avance ?? ''}
                                        onChange={e => setPaiement(g.id, 'avance', e.target.value)}
                                        placeholder="400" />
                                    <Input label="Date avance" type="date"
                                        value={paiements[g.id]?.dateAvance ?? ''}
                                        onChange={e => setPaiement(g.id, 'dateAvance', e.target.value)} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </ModalBody>
            <ModalFooter>
                {etape > 1 && (
                    <Button variant="outline" onClick={() => setEtape(e => e - 1)} className="flex-1">← Retour</Button>
                )}
                <Button variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
                {etape < 3
                    ? <Button variant="gold" onClick={etapeSuivante} className="flex-1">Suivant →</Button>
                    : <Button variant="gold" onClick={submit} loading={loading} className="flex-1">Inscrire</Button>
                }
            </ModalFooter>
        </Modal>
    )
}

export default function Dashboard({ stats = {}, alertes = [], seances = [] }) {
    const { props }                    = usePage()
    const flash                        = props.flash ?? {}
    const [modalInscription, setModal] = useState(false)

    const dateAujourdhui = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

    return (
        <SiriusLayout title="Dashboard">
            <Flash success={flash.success} error={flash.error} />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle capitalize">{dateAujourdhui}</p>
                </div>
                <Button variant="gold" onClick={() => setModal(true)}>
                    <IconPlus /> Nouvelle inscription
                </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={<IconEtudiants />} label="Étudiants actifs"  value={stats.etudiants ?? 0} />
                <StatCard icon={<IconGroupes />}   label="Groupes en cours"  value={stats.groupes   ?? 0} />
                <StatCard icon={<IconProfs />}     label="Professeurs"       value={stats.profs     ?? 0} />
                <StatCard icon={<IconImpayes />}   label="Paiements impayés" value={stats.impayes   ?? 0} danger />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SectionCard title="Alertes récentes" color="danger"
                    action={<a href="/directeur/alertes" className="text-xs text-sirius-danger font-medium no-underline hover:opacity-75">Voir tout →</a>}>
                    {alertes.length === 0
                        ? <EmptyBox icon={<IconBellOff />} text="Aucune alerte active" />
                        : <div className="space-y-3">
                            {alertes.map(a => (
                                <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge color={a.type === 'absence' ? 'orange' : 'red'}>
                                                {a.type === 'absence' ? 'Absence' : 'Paiement'}
                                            </Badge>
                                            <span className="text-xs text-gray-400 truncate">{a.groupe}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 truncate">{a.etudiant}</p>
                                        <p className="text-xs text-gray-400">{a.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </SectionCard>

                <SectionCard title="Séances aujourd'hui" color="gold"
                    action={<span className="text-xs text-gray-400 capitalize">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>}>
                    {seances.length === 0
                        ? <EmptyBox icon={<IconCalOff />} text="Aucune séance prévue" />
                        : <div className="space-y-3">
                            {seances.map(s => (
                                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="text-center flex-shrink-0 w-12">
                                        <div className="text-[11px] font-bold text-sirius-gold">{s.debut?.slice(0,5)}</div>
                                        <div className="text-[10px] text-gray-400">{s.fin?.slice(0,5)}</div>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">{s.groupe}</div>
                                        <div className="text-xs text-gray-400 truncate">{s.langue} · {s.niveau} · {s.salle ?? '—'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </SectionCard>
            </div>

            {modalInscription && <ModalInscription onClose={() => setModal(false)} />}
        </SiriusLayout>
    )
}