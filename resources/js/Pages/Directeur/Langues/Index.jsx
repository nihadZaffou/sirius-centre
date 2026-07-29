import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Button from '@/Components/UI/Button'
import Badge from '@/Components/UI/Badge'
import Input from '@/Components/UI/Input'
import Modal, { ModalBody, ModalFooter } from '@/Components/UI/Modal'
import Flash from '@/Components/UI/Flash'

const IconGlobe = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
const IconChev  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
const IconPlus  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>

const SUGGESTIONS = ['Allemand','Anglais','Espagnol','Français','Hollandais','Arabe','Turc','Chinois','Italien','Portugais']

function ModalAjout({ onClose, existantes }) {
    const [nom, setNom]     = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const dejaDans    = existantes.map(l => l.nom.toLowerCase())
    const suggestions = SUGGESTIONS.filter(s => !dejaDans.includes(s.toLowerCase()))

    const submit = (e) => {
        e.preventDefault()
        if (!nom.trim())                                  { setError('Le nom est obligatoire.');    return }
        if (dejaDans.includes(nom.trim().toLowerCase()))  { setError('Cette langue existe déjà.'); return }

        setLoading(true)
        router.post('/directeur/langues', { nomLangue: nom }, {
            onSuccess: () => { setLoading(false); onClose() },
            onError:   (e) => { setLoading(false); setError(e.nomLangue ?? 'Erreur.') },
        })
    }

    return (
        <Modal title="Ajouter une langue" onClose={onClose}>
            <ModalBody>
                {suggestions.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-2">Suggestions rapides :</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => { setNom(s); setError('') }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                                        nom === s
                                            ? 'bg-sirius-gold text-white border-sirius-gold'
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-sirius-gold hover:text-sirius-gold'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={submit} id="form-langue">
                    <Input
                        label="Nom de la langue"
                        value={nom}
                        onChange={e => { setNom(e.target.value); setError('') }}
                        placeholder="Ex: Allemand"
                        error={error}
                        required
                    />
                    <p className="text-xs text-gray-400 mt-2">
                        Les 9 niveaux (A1 → C1) seront créés automatiquement.
                    </p>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
                <Button variant="gold" onClick={submit} loading={loading} className="flex-1">Ajouter</Button>
            </ModalFooter>
        </Modal>
    )
}

function LangueCard({ langue }) {
    const [open, setOpen] = useState(false)

    const toggle = () => router.patch(`/directeur/langues/${langue.id}/toggle`, {}, { preserveScroll: true })

    return (
        <div className={`card transition-all ${!langue.actif ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-4 p-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    langue.actif
                        ? 'bg-sirius-gold-light border border-sirius-gold-border text-sirius-gold'
                        : 'bg-gray-100 text-gray-400'
                }`}>
                    <IconGlobe />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-base font-semibold text-gray-900">{langue.nom}</span>
                        <Badge color={langue.actif ? 'green' : 'red'}>
                            {langue.actif ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                    <p className="text-xs text-gray-400">
                        {langue.niveaux.length} niveaux · cliquez sur un niveau pour voir ses groupes
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                        variant={langue.actif ? 'outline' : 'ghost'}
                        size="sm"
                        onClick={toggle}
                    >
                        {langue.actif ? 'Désactiver' : 'Activer'}
                    </Button>
                    <button
                        onClick={() => setOpen(!open)}
                        className={`w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all ${open ? 'rotate-180' : ''}`}
                    >
                        <IconChev />
                    </button>
                </div>
            </div>

            {open && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                        Niveaux — cliquez pour voir les groupes
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {langue.niveaux.sort((a, b) => a.ordre - b.ordre).map(n => (
                            <button
                                key={n.id}
                                onClick={() => langue.actif && n.actif && router.get(`/directeur/niveaux/${n.id}/groupes`)}
                                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                                    n.actif && langue.actif
                                        ? 'badge-gold hover:bg-sirius-gold hover:text-white hover:border-sirius-gold cursor-pointer'
                                        : 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
                                }`}
                            >
                                {n.nom}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function Index({ langues = [] }) {
    const { props }         = usePage()
    const flash             = props.flash ?? {}
    const [modal, setModal] = useState(false)
    const actives           = langues.filter(l => l.actif)

    return (
        <SiriusLayout title="Langues">
            <Flash success={flash.success} error={flash.error} />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Langues</h1>
                    <p className="page-subtitle">
                        {actives.length} langue{actives.length > 1 ? 's' : ''} active{actives.length > 1 ? 's' : ''}
                        {langues.length - actives.length > 0 && ` · ${langues.length - actives.length} inactive${langues.length - actives.length > 1 ? 's' : ''}`}
                    </p>
                </div>
                <Button variant="gold" onClick={() => setModal(true)}>
                    <IconPlus /> Ajouter une langue
                </Button>
            </div>

            {langues.length === 0 ? (
                <div className="card-p text-center py-16">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <IconGlobe />
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Aucune langue configurée</p>
                    <p className="text-xs text-gray-300">Ajoutez votre première langue pour commencer</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {langues.map(l => <LangueCard key={l.id} langue={l} />)}
                </div>
            )}

            {modal && <ModalAjout onClose={() => setModal(false)} existantes={langues} />}
        </SiriusLayout>
    )
}