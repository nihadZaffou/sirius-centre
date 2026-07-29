import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Button from '@/Components/UI/Button'
import Badge from '@/Components/UI/Badge'
import Input from '@/Components/UI/Input'
import Modal, { ModalBody, ModalFooter } from '@/Components/UI/Modal'
import Flash from '@/Components/UI/Flash'
import Empty from '@/Components/UI/Empty'

const IconPlus  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconArrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
const IconUsers = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const IconClock = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>

const JOURS   = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
const STATUTS = {
    en_cours: { label: 'En cours',  cls: 'badge-green' },
    suspendu: { label: 'Suspendu',  cls: 'badge-orange' },
    termine:  { label: 'Terminé',   cls: 'badge-gray' },
}

function ModalGroupe({ niveau, profs, onClose }) {
    const [form, setForm]       = useState({ nomGroupe: '', idProf: '', capacite: 15, dateDebut: '', dateFin: '' })
    const [emplois, setEmplois] = useState([])
    const [errors, setErrors]   = useState({})
    const [loading, setLoading] = useState(false)

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
    const addEmploi    = () => setEmplois(e => [...e, { jour: 'Lundi', debut: '09:00', fin: '11:00', salle: '' }])
    const removeEmploi = (i) => setEmplois(e => e.filter((_, idx) => idx !== i))
    const setEmploi    = (i, k, v) => setEmplois(e => e.map((x, idx) => idx === i ? { ...x, [k]: v } : x))

    const submit = (e) => {
        e.preventDefault()
        const errs = {}
        if (!form.nomGroupe) errs.nomGroupe = 'Obligatoire'
        if (!form.idProf)    errs.idProf    = 'Obligatoire'
        if (!form.dateDebut) errs.dateDebut = 'Obligatoire'
        if (Object.keys(errs).length) { setErrors(errs); return }

        setLoading(true)
        router.post('/directeur/groupes', { ...form, idNiveau: niveau.id, emplois }, {
            onSuccess: () => { setLoading(false); onClose() },
            onError:   (e) => { setLoading(false); setErrors(e) },
        })
    }

    return (
        <Modal title="Créer un groupe" subtitle={`${niveau.langue} · ${niveau.nom}`} onClose={onClose} maxWidth="max-w-lg">
            <form onSubmit={submit}>
                <ModalBody>
                    <div className="space-y-4">
                        <Input
                            label="Nom du groupe" value={form.nomGroupe}
                            onChange={e => set('nomGroupe', e.target.value)}
                            placeholder={`${niveau.langue} ${niveau.nom} — Groupe 1`}
                            error={errors.nomGroupe} required
                        />

                        <div>
                            <label className="label">Professeur <span className="text-sirius-danger">*</span></label>
                            <select
                                value={form.idProf}
                                onChange={e => set('idProf', e.target.value)}
                                className={`select ${errors.idProf ? 'input-error' : ''}`}
                            >
                                <option value="">Choisir un professeur</option>
                                {profs.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
                            </select>
                            {errors.idProf && <p className="text-xs text-sirius-danger mt-1">{errors.idProf}</p>}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <Input
                                label="Capacité" type="number"
                                value={form.capacite}
                                onChange={e => set('capacite', e.target.value)}
                            />
                            <Input
                                label="Début" type="date"
                                value={form.dateDebut}
                                onChange={e => set('dateDebut', e.target.value)}
                                error={errors.dateDebut} required
                            />
                            <Input
                                label="Fin" type="date"
                                value={form.dateFin}
                                onChange={e => set('dateFin', e.target.value)}
                            />
                        </div>

                        {/* Emploi du temps */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-4 bg-sirius-gold rounded-full" />
                                    <span className="text-sm font-semibold text-gray-900">Emploi du temps</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={addEmploi} type="button">
                                    <IconPlus /> Ajouter
                                </Button>
                            </div>
                            {emplois.length === 0 ? (
                                <div className="empty-state text-xs">Aucune séance — cliquez sur "Ajouter"</div>
                            ) : (
                                <div className="space-y-2">
                                    {emplois.map((emp, i) => (
                                        <div key={i} className="grid grid-cols-5 gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                            <select value={emp.jour} onChange={e => setEmploi(i, 'jour', e.target.value)} className="select text-xs py-1.5">
                                                {JOURS.map(j => <option key={j}>{j}</option>)}
                                            </select>
                                            <input type="time" value={emp.debut} onChange={e => setEmploi(i, 'debut', e.target.value)} className="input text-xs py-1.5" />
                                            <input type="time" value={emp.fin} onChange={e => setEmploi(i, 'fin', e.target.value)} className="input text-xs py-1.5" />
                                            <input value={emp.salle} onChange={e => setEmploi(i, 'salle', e.target.value)} placeholder="Salle" className="input text-xs py-1.5" />
                                            <button type="button" onClick={() => removeEmploi(i)} className="flex items-center justify-center text-sirius-danger hover:opacity-75">
                                                <IconTrash />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={onClose} className="flex-1" type="button">Annuler</Button>
                    <Button variant="gold" type="submit" loading={loading} className="flex-1">Créer le groupe</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

function GroupeCard({ groupe, onDelete }) {
    const [menu, setMenu] = useState(false)
    const statut = STATUTS[groupe.statut] ?? STATUTS.en_cours
    const pct    = groupe.capacite > 0 ? Math.round((groupe.etudiants_count / groupe.capacite) * 100) : 0

    const changeStatut = (s) => {
        setMenu(false)
        router.patch(`/directeur/groupes/${groupe.id}/statut`, { statut: s }, { preserveScroll: true })
    }

    return (
        <div className="card p-5">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-semibold text-gray-900 mb-1 truncate">{groupe.nom}</div>
                    <div className="text-xs text-gray-400">👨‍🏫 {groupe.prof ?? '—'}</div>
                </div>
                <div className="relative ml-2 flex-shrink-0">
                    <button onClick={() => setMenu(!menu)} className={`badge cursor-pointer ${statut.cls}`}>
                        {statut.label} ▾
                    </button>
                    {menu && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg z-10 w-32 overflow-hidden">
                            {Object.entries(STATUTS).map(([k, v]) => (
                                <button key={k} onClick={() => changeStatut(k)} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-gray-700">
                                    {v.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Capacité */}
            <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span className="flex items-center gap-1"><IconUsers /> {groupe.etudiants_count} / {groupe.capacite}</span>
                    <span>{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-sirius-danger' : pct >= 70 ? 'bg-orange-400' : 'bg-sirius-gold'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                </div>
            </div>

            {/* Emplois */}
            {groupe.emplois?.length > 0 && (
                <div className="space-y-1 mb-3">
                    {groupe.emplois.map((e, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                            <IconClock />
                            <span>{e.jour} {e.debut?.slice(0,5)}–{e.fin?.slice(0,5)}</span>
                            {e.salle && <span className="text-gray-300">· {e.salle}</span>}
                        </div>
                    ))}
                </div>
            )}

            {groupe.dateDebut && (
                <div className="text-xs text-gray-400 mb-3">
                    Du {new Date(groupe.dateDebut).toLocaleDateString('fr-FR')}
                    {groupe.dateFin && ` au ${new Date(groupe.dateFin).toLocaleDateString('fr-FR')}`}
                </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
    onClick={() => router.get(`/directeur/groupes/${groupe.id}/etudiants`)}
    className="text-xs text-sirius-gold font-medium hover:opacity-75 transition-opacity"
>
    Voir les étudiants →
</button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(groupe)} className="text-sirius-danger hover:text-sirius-danger">
                    <IconTrash /> Désactiver
                </Button>
            </div>
        </div>
    )
}

export default function Groupes({ niveau, groupes = [], profs = [] }) {
    const { props }               = usePage()
    const flash                   = props.flash ?? {}
    const [modal, setModal]       = useState(false)
    const [toDelete, setToDelete] = useState(null)

    const handleDelete = () => {
        router.delete(`/directeur/groupes/${toDelete.id}`, {
            onSuccess: () => setToDelete(null),
            preserveScroll: true,
        })
    }

    return (
        <SiriusLayout title={`${niveau?.langue} · ${niveau?.nom}`}>
            <Flash success={flash.success} error={flash.error} />

            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" onClick={() => router.get('/directeur/langues')}>
                    <IconArrow />
                </Button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <h1 className="text-2xl font-bold text-gray-900">{niveau?.langue}</h1>
                        <span className="text-gray-300">·</span>
                        <span className="text-xl font-semibold text-sirius-gold">{niveau?.nom}</span>
                    </div>
                    <p className="page-subtitle">
                        {groupes.length} groupe{groupes.length > 1 ? 's' : ''} · {groupes.reduce((a, g) => a + g.etudiants_count, 0)} étudiants
                    </p>
                </div>
                <Button variant="gold" onClick={() => setModal(true)}>
                    <IconPlus /> Créer un groupe
                </Button>
            </div>

            {groupes.length === 0 ? (
                <Empty
                    title={`Aucun groupe pour ${niveau?.langue} ${niveau?.nom}`}
                    subtitle="Créez le premier groupe"
                    icon={<IconUsers />}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupes.map(g => <GroupeCard key={g.id} groupe={g} onDelete={setToDelete} />)}
                </div>
            )}

            {modal && <ModalGroupe niveau={niveau} profs={profs} onClose={() => setModal(false)} />}

            {toDelete && (
                <Modal title="Désactiver le groupe" onClose={() => setToDelete(null)}>
                    <ModalBody>
                        <p className="text-sm text-gray-500 text-center">
                            Voulez-vous désactiver <strong>{toDelete.nom}</strong> ?
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