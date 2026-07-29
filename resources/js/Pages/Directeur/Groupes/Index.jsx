import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'

// Icons
const IconPlus   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconUsers  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const IconClock  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconTrash  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
const IconX      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const STATUTS = {
    en_cours:  { label: 'En cours',  color: 'green' },
    termine:   { label: 'Terminé',   color: 'gray' },
    suspendu:  { label: 'Suspendu',  color: 'orange' },
}

function Badge({ children, color = 'gray' }) {
    const colors = {
        green:  'bg-green-50 text-green-700 border-green-200',
        orange: 'bg-orange-50 text-orange-600 border-orange-200',
        red:    'bg-red-50 text-red-500 border-red-200',
        gold:   'bg-sirius-gold-light text-yellow-700 border-sirius-gold-border',
        gray:   'bg-gray-100 text-gray-500 border-gray-200',
        blue:   'bg-blue-50 text-blue-600 border-blue-200',
    }
    return (
        <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${colors[color]}`}>
            {children}
        </span>
    )
}

function ModalGroupe({ langues, profs, onClose }) {
    const [form, setForm] = useState({
        nomGroupe: '', idNiveau: '', idProf: '',
        capacite: 15, dateDebut: '', dateFin: '',
    })
    const [emplois, setEmplois] = useState([])
    const [niveaux, setNiveaux] = useState([])
    const [errors, setErrors]   = useState({})

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleLangueChange = (idLangue) => {
        const langue = langues.find(l => l.id == idLangue)
        setNiveaux(langue?.niveaux ?? [])
        set('idNiveau', '')
    }

    const addEmploi = () => setEmplois(e => [...e, { jour: 'Lundi', debut: '09:00', fin: '11:00', salle: '' }])
    const removeEmploi = (i) => setEmplois(e => e.filter((_, idx) => idx !== i))
    const updateEmploi = (i, k, v) => setEmplois(e => e.map((emp, idx) => idx === i ? { ...emp, [k]: v } : emp))

    const handleSubmit = (e) => {
        e.preventDefault()
        const errs = {}
        if (!form.nomGroupe) errs.nomGroupe = 'Obligatoire'
        if (!form.idNiveau)  errs.idNiveau  = 'Obligatoire'
        if (!form.idProf)    errs.idProf    = 'Obligatoire'
        if (!form.dateDebut) errs.dateDebut = 'Obligatoire'
        if (Object.keys(errs).length) { setErrors(errs); return }

        router.post('/directeur/groupes', { ...form, emplois }, {
            onSuccess: () => onClose(),
            onError: (e) => setErrors(e),
        })
    }

    const inputCls = (field) => `w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
        errors[field]
            ? 'border-sirius-danger ring-2 ring-sirius-danger/15'
            : 'border-gray-200 focus:border-sirius-gold focus:ring-2 focus:ring-sirius-gold/20'
    }`

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900">Créer un groupe</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><IconX /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Infos de base */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du groupe <span className="text-sirius-danger">*</span></label>
                            <input value={form.nomGroupe} onChange={e => set('nomGroupe', e.target.value)} placeholder="Ex: Allemand A1 - Groupe 1" className={inputCls('nomGroupe')} />
                            {errors.nomGroupe && <p className="text-xs text-sirius-danger mt-1">{errors.nomGroupe}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Langue <span className="text-sirius-danger">*</span></label>
                            <select onChange={e => handleLangueChange(e.target.value)} className={inputCls('idLangue')}>
                                <option value="">Choisir une langue</option>
                                {langues.map(l => <option key={l.id} value={l.id}>{l.nom}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Niveau <span className="text-sirius-danger">*</span></label>
                            <select value={form.idNiveau} onChange={e => set('idNiveau', e.target.value)} className={inputCls('idNiveau')} disabled={niveaux.length === 0}>
                                <option value="">Choisir un niveau</option>
                                {niveaux.map(n => <option key={n.id} value={n.id}>{n.nom}</option>)}
                            </select>
                            {errors.idNiveau && <p className="text-xs text-sirius-danger mt-1">{errors.idNiveau}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Professeur <span className="text-sirius-danger">*</span></label>
                            <select value={form.idProf} onChange={e => set('idProf', e.target.value)} className={inputCls('idProf')}>
                                <option value="">Choisir un prof</option>
                                {profs.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
                            </select>
                            {errors.idProf && <p className="text-xs text-sirius-danger mt-1">{errors.idProf}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Capacité max</label>
                            <input type="number" min="1" max="50" value={form.capacite} onChange={e => set('capacite', e.target.value)} className={inputCls('capacite')} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date début <span className="text-sirius-danger">*</span></label>
                            <input type="date" value={form.dateDebut} onChange={e => set('dateDebut', e.target.value)} className={inputCls('dateDebut')} />
                            {errors.dateDebut && <p className="text-xs text-sirius-danger mt-1">{errors.dateDebut}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date fin</label>
                            <input type="date" value={form.dateFin} onChange={e => set('dateFin', e.target.value)} className={inputCls('dateFin')} />
                        </div>
                    </div>

                    {/* Emploi du temps */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-sirius-gold rounded-full" />
                                <label className="text-sm font-semibold text-gray-900">Emploi du temps</label>
                            </div>
                            <button type="button" onClick={addEmploi} className="flex items-center gap-1 text-xs text-sirius-gold font-medium hover:opacity-75">
                                <IconPlus /> Ajouter séance
                            </button>
                        </div>

                        {emplois.length === 0 ? (
                            <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 text-center text-xs text-gray-400">
                                Aucune séance — cliquez sur "Ajouter séance"
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {emplois.map((emp, i) => (
                                    <div key={i} className="grid grid-cols-5 gap-2 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <select value={emp.jour} onChange={e => updateEmploi(i, 'jour', e.target.value)} className="col-span-1 px-2 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-sirius-gold">
                                            {JOURS.map(j => <option key={j}>{j}</option>)}
                                        </select>
                                        <input type="time" value={emp.debut} onChange={e => updateEmploi(i, 'debut', e.target.value)} className="px-2 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-sirius-gold" />
                                        <input type="time" value={emp.fin} onChange={e => updateEmploi(i, 'fin', e.target.value)} className="px-2 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-sirius-gold" />
                                        <input value={emp.salle} onChange={e => updateEmploi(i, 'salle', e.target.value)} placeholder="Salle" className="px-2 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-sirius-gold" />
                                        <button type="button" onClick={() => removeEmploi(i)} className="flex items-center justify-center text-sirius-danger hover:opacity-75">
                                            <IconTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">Annuler</button>
                        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-sirius-gold text-white text-sm font-semibold hover:opacity-90">Créer le groupe</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function GroupeCard({ groupe, onDelete }) {
    const [changing, setChanging] = useState(false)
    const statut = STATUTS[groupe.statut] ?? STATUTS.en_cours
    const pct    = groupe.capacite > 0 ? Math.round((groupe.etudiants_count / groupe.capacite) * 100) : 0

    const handleStatut = (s) => {
        setChanging(false)
        router.patch(`/directeur/groupes/${groupe.id}/statut`, { statut: s }, { preserveScroll: true })
    }

    return (
        <div className={`bg-white rounded-2xl border p-5 transition-all ${groupe.actif ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-base font-semibold text-gray-900">{groupe.nom}</span>
                        <Badge color="gold">{groupe.langue} · {groupe.niveau}</Badge>
                    </div>
                    <div className="text-xs text-gray-400">
                        👨‍🏫 {groupe.prof ?? 'Aucun prof'}
                    </div>
                </div>
                <div className="relative flex-shrink-0 ml-2">
                    <button
                        onClick={() => setChanging(!changing)}
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border cursor-pointer ${
                            groupe.statut === 'en_cours' ? 'bg-green-50 text-green-700 border-green-200' :
                            groupe.statut === 'suspendu' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                            'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                    >
                        {statut.label} ▾
                    </button>
                    {changing && (
                        <div className="absolute right-0 top-7 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden w-36">
                            {Object.entries(STATUTS).map(([k, v]) => (
                                <button key={k} onClick={() => handleStatut(k)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 text-gray-700">
                                    {v.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Capacité */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span className="flex items-center gap-1"><IconUsers /> {groupe.etudiants_count} étudiants</span>
                    <span>Max {groupe.capacite}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-sirius-danger' : pct >= 70 ? 'bg-orange-400' : 'bg-sirius-gold'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                </div>
            </div>

            {/* Emplois */}
            {groupe.emplois.length > 0 && (
                <div className="space-y-1 mb-4">
                    {groupe.emplois.map((e, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                            <IconClock />
                            <span>{e.jour} {e.debut?.slice(0,5)}–{e.fin?.slice(0,5)}</span>
                            {e.salle && <span className="text-gray-300">· Salle {e.salle}</span>}
                        </div>
                    ))}
                </div>
            )}

            {/* Dates */}
            {groupe.dateDebut && (
                <div className="text-xs text-gray-400 mb-4">
                    Du {new Date(groupe.dateDebut).toLocaleDateString('fr-FR')}
                    {groupe.dateFin && ` au ${new Date(groupe.dateFin).toLocaleDateString('fr-FR')}`}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                    onClick={() => onDelete(groupe)}
                    className="flex items-center gap-1.5 text-xs text-sirius-danger hover:opacity-75 transition-opacity"
                >
                    <IconTrash /> Désactiver
                </button>
            </div>
        </div>
    )
}

export default function Index({ groupes = [], langues = [], profs = [] }) {
    const { props }  = usePage()
    const flash      = props.flash ?? {}
    const [modal, setModal]       = useState(false)
    const [toDelete, setToDelete] = useState(null)
    const [filtre, setFiltre]     = useState('en_cours')

    const groupesFiltres = filtre === 'tous'
        ? groupes
        : groupes.filter(g => g.statut === filtre)

    const handleDelete = () => {
        router.delete(`/directeur/groupes/${toDelete.id}`, {
            onSuccess: () => setToDelete(null),
            preserveScroll: true,
        })
    }

    return (
        <SiriusLayout title="Groupes">

            {/* Flash */}
            {flash.success && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <p className="text-sm text-green-700">{flash.success}</p>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Groupes</h1>
                    <p className="text-sm text-gray-500">{groupes.filter(g => g.statut === 'en_cours').length} groupe{groupes.filter(g => g.statut === 'en_cours').length > 1 ? 's' : ''} en cours</p>
                </div>
                <button
                    onClick={() => setModal(true)}
                    className="flex items-center gap-2 bg-sirius-gold text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                    <IconPlus /> Créer un groupe
                </button>
            </div>

            {/* Filtres statut */}
            <div className="flex gap-2 mb-6">
                {[
                    { label: 'En cours',  value: 'en_cours' },
                    { label: 'Suspendu',  value: 'suspendu' },
                    { label: 'Terminé',   value: 'termine' },
                    { label: 'Tous',      value: 'tous' },
                ].map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFiltre(f.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            filtre === f.value
                                ? 'bg-sirius-dark text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {f.label}
                        <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                            filtre === f.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                            {f.value === 'tous' ? groupes.length : groupes.filter(g => g.statut === f.value).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Grid groupes */}
            {groupesFiltres.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <IconUsers />
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Aucun groupe</p>
                    <p className="text-xs text-gray-300">Créez votre premier groupe pour commencer</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {groupesFiltres.map(g => (
                        <GroupeCard key={g.id} groupe={g} onDelete={setToDelete} />
                    ))}
                </div>
            )}

            {/* Modal création */}
            {modal && <ModalGroupe langues={langues} profs={profs} onClose={() => setModal(false)} />}

            {/* Modal confirmation */}
            {toDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-gray-200 mx-4">
                        <h3 className="text-base font-semibold text-gray-900 text-center mb-2">Désactiver le groupe</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            Voulez-vous désactiver <strong>{toDelete.nom}</strong> ?
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setToDelete(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">Annuler</button>
                            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-sirius-danger text-white text-sm font-medium hover:opacity-90">Désactiver</button>
                        </div>
                    </div>
                </div>
            )}

        </SiriusLayout>
    )
    
}
