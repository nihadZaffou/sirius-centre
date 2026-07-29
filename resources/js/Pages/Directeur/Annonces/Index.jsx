import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Button from '@/Components/UI/Button'
import Badge from '@/Components/UI/Badge'
import Modal, { ModalBody, ModalFooter } from '@/Components/UI/Modal'
import Input from '@/Components/UI/Input'
import Flash from '@/Components/UI/Flash'
import Empty from '@/Components/UI/Empty'

const IconPlus     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconSend     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/></svg>
const IconWhatsapp = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.93 7.93 0 0 0 3.8 1h0a7.94 7.94 0 0 0 7.94-7.94 7.88 7.88 0 0 0-2.34-5.62Zm-5.55 12.2h0a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.65.67-2.43-.16-.25a6.6 6.6 0 1 1 5.6 3.1Zm3.6-4.94c-.2-.1-1.17-.58-1.35-.64s-.32-.1-.45.1-.5.64-.62.77-.23.15-.43.05a5.43 5.43 0 0 1-1.6-1 6 6 0 0 1-1.1-1.37c-.12-.2 0-.3.1-.4s.2-.23.3-.35a1.4 1.4 0 0 0 .2-.34.4.4 0 0 0 0-.37c0-.1-.45-1.08-.62-1.48s-.33-.33-.45-.34h-.38a.74.74 0 0 0-.53.25 2.24 2.24 0 0 0-.7 1.67 3.9 3.9 0 0 0 .82 2.06 8.93 8.93 0 0 0 3.42 3 11.5 11.5 0 0 0 1.14.42 2.75 2.75 0 0 0 1.26.08 2.06 2.06 0 0 0 1.36-.96 1.7 1.7 0 0 0 .12-.96c-.05-.1-.18-.15-.38-.25Z"/></svg>
const IconMail     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const IconTrash    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
const IconCheck    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
const IconX        = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

const TYPES = {
    absence_prof:  { label: 'Absence prof',   color: 'orange' },
    horaire:       { label: 'Horaire',        color: 'blue' },
    examen:        { label: 'Examen',         color: 'gold' },
    fermeture:     { label: 'Fermeture',      color: 'red' },
    nouveau_groupe:{ label: 'Nouveau groupe', color: 'green' },
    autre:         { label: 'Autre',          color: 'gray' },
}

function ModalCreer({ groupes, onClose }) {
    const [form, setForm]       = useState({ titre: '', message: '', type: 'autre', groupeIds: [] })
    const [errors, setErrors]   = useState({})
    const [loading, setLoading] = useState(false)

    const toggleGroupe = (id) => {
        setForm(f => ({
            ...f,
            groupeIds: f.groupeIds.includes(id)
                ? f.groupeIds.filter(g => g !== id)
                : [...f.groupeIds, id]
        }))
    }

    const toggleTous = () => {
        setForm(f => ({
            ...f,
            groupeIds: f.groupeIds.length === groupes.length ? [] : groupes.map(g => g.id)
        }))
    }

    const submit = (e) => {
        e.preventDefault()
        const errs = {}
        if (!form.titre)   errs.titre   = 'Obligatoire'
        if (!form.message) errs.message = 'Obligatoire'
        if (form.groupeIds.length === 0) errs.groupeIds = 'Choisissez au moins un groupe'
        if (Object.keys(errs).length) { setErrors(errs); return }

        setLoading(true)
        router.post('/directeur/annonces', form, {
            onSuccess: () => { setLoading(false); onClose() },
            onError:   (e) => { setLoading(false); setErrors(e) },
        })
    }

    return (
        <Modal title="Créer une annonce" onClose={onClose} maxWidth="max-w-lg">
            <form onSubmit={submit}>
                <ModalBody>
                    <div className="space-y-4">
                        <Input
                            label="Titre" value={form.titre}
                            onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
                            error={errors.titre} placeholder="Ex: Fermeture exceptionnelle" required
                        />

                        <div>
                            <label className="label">Type</label>
                            <select
                                value={form.type}
                                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                                className="select"
                            >
                                {Object.entries(TYPES).map(([k, v]) => (
                                    <option key={k} value={k}>{v.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Message <span className="text-sirius-danger">*</span></label>
                            <textarea
                                value={form.message}
                                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                placeholder="Rédigez votre annonce..."
                                rows={4}
                                className={`input resize-none ${errors.message ? 'input-error' : ''}`}
                            />
                            {errors.message && <p className="text-xs text-sirius-danger mt-1">{errors.message}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="label mb-0">Destinataires <span className="text-sirius-danger">*</span></label>
                                <button type="button" onClick={toggleTous} className="text-xs text-sirius-gold font-medium hover:opacity-75">
                                    {form.groupeIds.length === groupes.length ? 'Tout désélectionner' : 'Sélectionner tous'}
                                </button>
                            </div>
                            {errors.groupeIds && <p className="text-xs text-sirius-danger mb-2">{errors.groupeIds}</p>}
                            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100">
                                {groupes.map(g => (
                                    <label key={g.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                                        <div
                                            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                                form.groupeIds.includes(g.id) ? 'bg-sirius-gold border-sirius-gold' : 'border-gray-300'
                                            }`}
                                        >
                                            {form.groupeIds.includes(g.id) && (
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                            )}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={form.groupeIds.includes(g.id)} onChange={() => toggleGroupe(g.id)} />
                                        <span className="text-sm text-gray-700">{g.nom}</span>
                                        <Badge color="gold">{g.langue} {g.niveau}</Badge>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={onClose} type="button" className="flex-1">Annuler</Button>
                    <Button variant="gold" type="submit" loading={loading} className="flex-1">Publier</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

function ModalEnvoi({ annonce, onClose }) {
    const [destinataires, setDestinataires] = useState([])
    const [titre, setTitre]                 = useState('')
    const [message, setMessage]             = useState('')
    const [loading, setLoading]             = useState(true)
    const [envoyes, setEnvoyes]             = useState(new Set())

    useState(() => {
        fetch(`/directeur/annonces/${annonce.id}/destinataires`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
        })
            .then(res => res.json())
            .then(data => {
                setTitre(data.annonce.titre)
                setMessage(data.annonce.message)
                setDestinataires(data.destinataires)
                setLoading(false)
            })
    }, [])

    const buildMessage = (prenom) => {
        return `Bonjour ${prenom},\n\n${titre}\n\n${message}\n\n— Sirius Center`
    }

    const sendWhatsapp = (d) => {
        const tel = d.telephone?.replace(/\D/g, '')
        const phoneIntl = tel?.startsWith('0') ? '212' + tel.slice(1) : tel
        const text = encodeURIComponent(buildMessage(d.prenom))
        window.open(`https://wa.me/${phoneIntl}?text=${text}`, '_blank')
        setEnvoyes(prev => new Set(prev).add(d.id))
    }

   const sendEmail = (d) => {
    const subject = encodeURIComponent(titre)
    const body    = encodeURIComponent(buildMessage(d.prenom))
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${d.email}&su=${subject}&body=${body}`, '_blank')
    setEnvoyes(prev => new Set(prev).add(d.id))
}

    return (
        <Modal title="Envoyer l'annonce" subtitle={annonce.titre} onClose={onClose} maxWidth="max-w-lg">
            <ModalBody>
                {loading ? (
                    <div className="text-center py-8 text-sm text-gray-400">Chargement...</div>
                ) : (
                    <div>
                        <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs text-gray-500">
                            {destinataires.length} destinataire{destinataires.length > 1 ? 's' : ''} · {envoyes.size} envoyé{envoyes.size > 1 ? 's' : ''}
                        </div>
                        <div className="max-h-96 overflow-y-auto space-y-2">
                            {destinataires.map(d => (
                                <div key={d.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                    envoyes.has(d.id) ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                                }`}>
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">{d.prenom} {d.nom}</div>
                                        <div className="text-xs text-gray-400">{d.groupe}</div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {envoyes.has(d.id) && <span className="text-green-500"><IconCheck /></span>}
                                        <button
                                            onClick={() => sendWhatsapp(d)}
                                            disabled={!d.telephone}
                                            className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all disabled:opacity-30"
                                            title="Envoyer par WhatsApp"
                                        >
                                            <IconWhatsapp />
                                        </button>
                                        <button
                                            onClick={() => sendEmail(d)}
                                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                                            title="Envoyer par Email"
                                        >
                                            <IconMail />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </ModalBody>
            <ModalFooter>
                <Button variant="outline" onClick={onClose} className="flex-1">Fermer</Button>
            </ModalFooter>
        </Modal>
    )
}

export default function Index({ annonces = [], groupes = [] }) {
    const { props }                 = usePage()
    const flash                     = props.flash ?? {}
    const [modalCreer, setModalCreer] = useState(false)
    const [modalEnvoi, setModalEnvoi] = useState(null)
    const [toDelete, setToDelete]     = useState(null)

    const handleDelete = () => {
        router.delete(`/directeur/annonces/${toDelete.id}`, {
            onSuccess: () => setToDelete(null),
        })
    }

    return (
        <SiriusLayout title="Annonces">
            <Flash success={flash.success} error={flash.error} />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Annonces</h1>
                    <p className="page-subtitle">{annonces.length} annonce{annonces.length > 1 ? 's' : ''} publiée{annonces.length > 1 ? 's' : ''}</p>
                </div>
                <Button variant="gold" onClick={() => setModalCreer(true)}>
                    <IconPlus /> Créer une annonce
                </Button>
            </div>

            {annonces.length === 0 ? (
                <Empty title="Aucune annonce" subtitle="Créez votre première annonce" icon={<IconSend />} />
            ) : (
                <div className="space-y-3">
                    {annonces.map(a => {
                        const t = TYPES[a.type] ?? TYPES.autre
                        return (
                            <div key={a.id} className="card p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <h3 className="text-base font-semibold text-gray-900">{a.titre}</h3>
                                            <Badge color={t.color}>{t.label}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3 whitespace-pre-line">{a.message}</p>
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            {a.groupes.map(g => <Badge key={g.id} color="gray">{g.nom}</Badge>)}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {a.auteur} · {new Date(a.datePublication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            · {a.destinatairesCount} destinataire{a.destinatairesCount > 1 ? 's' : ''}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                        <Button variant="gold" size="sm" onClick={() => setModalEnvoi(a)}>
                                            <IconSend /> Envoyer
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => setToDelete(a)}>
                                            <IconTrash />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {modalCreer && <ModalCreer groupes={groupes} onClose={() => setModalCreer(false)} />}
            {modalEnvoi && <ModalEnvoi annonce={modalEnvoi} onClose={() => setModalEnvoi(null)} />}

            {toDelete && (
                <Modal title="Supprimer l'annonce" onClose={() => setToDelete(null)}>
                    <ModalBody>
                        <p className="text-sm text-gray-500 text-center">
                            Voulez-vous supprimer <strong>{toDelete.titre}</strong> ?
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