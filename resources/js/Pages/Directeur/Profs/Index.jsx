import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Button from '@/Components/UI/Button'
import Badge from '@/Components/UI/Badge'
import Flash from '@/Components/UI/Flash'
import Modal, { ModalBody, ModalFooter } from '@/Components/UI/Modal'
import Input from '@/Components/UI/Input'
import Empty from '@/Components/UI/Empty'

const IconPlus  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconEdit  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IconTrash = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
const IconProf  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>

function ModalProf({ prof = null, onClose }) {
    const isEdit = !!prof
    const [form, setForm]     = useState({
        nom:        prof?.nom        ?? '',
        prenom:     prof?.prenom     ?? '',
        email:      prof?.email      ?? '',
        telephone:  prof?.telephone  ?? '',
        specialite: prof?.specialite ?? '',
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const set = (name) => (e) => setForm(f => ({ ...f, [name]: e.target.value }))

    const submit = (e) => {
        e.preventDefault()
        setLoading(true)
        if (isEdit) {
            router.put(`/directeur/profs/${prof.id}`, form, {
                onSuccess: () => { setLoading(false); onClose() },
                onError:   (e) => { setLoading(false); setErrors(e) },
            })
        } else {
            router.post('/directeur/profs', form, {
                onSuccess: () => { setLoading(false); onClose() },
                onError:   (e) => { setLoading(false); setErrors(e) },
            })
        }
    }

    return (
        <Modal
            title={isEdit ? 'Modifier le professeur' : 'Ajouter un professeur'}
            onClose={onClose}
        >
            <form onSubmit={submit}>
                <ModalBody>
                    <div className="space-y-4">
                        <div className="form-grid">
                            <Input
                                label="Nom" value={form.nom}
                                onChange={set('nom')} error={errors.nom}
                                placeholder="BENALI" required
                            />
                            <Input
                                label="Prénom" value={form.prenom}
                                onChange={set('prenom')} error={errors.prenom}
                                placeholder="Mohammed" required
                            />
                        </div>
                        <Input
                            label="Email" type="email" value={form.email}
                            onChange={set('email')} error={errors.email}
                            placeholder="prof@sirius.ma" required
                        />
                        <Input
                            label="Téléphone" value={form.telephone}
                            onChange={set('telephone')} error={errors.telephone}
                            placeholder="0612345678"
                        />
                        <Input
                            label="Spécialité" value={form.specialite}
                            onChange={set('specialite')} error={errors.specialite}
                            placeholder="Allemand, Anglais..."
                        />
                        {!isEdit && (
                            <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2">
                                Mot de passe par défaut : <strong>sirius123</strong>
                            </p>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={onClose} className="flex-1" type="button">Annuler</Button>
                    <Button variant="gold" type="submit" loading={loading} className="flex-1">
                        {isEdit ? 'Enregistrer' : 'Ajouter'}
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

function ProfCard({ prof, onEdit, onDelete }) {
    const initiales     = `${prof.prenom?.[0] ?? ''}${prof.nom?.[0] ?? ''}`
    const groupesActifs = prof.groupes?.filter(g => g.statut === 'en_cours') ?? []

    return (
        <div className="card p-5">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-sirius-gold-light border border-sirius-gold-border flex items-center justify-center text-sirius-gold text-base font-bold flex-shrink-0">
                    {initiales}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-semibold text-gray-900 truncate">
                        {prof.prenom} {prof.nom}
                    </div>
                    <div className="text-xs text-gray-400 truncate">{prof.email}</div>
                    {prof.specialite && (
                        <div className="text-xs text-sirius-gold font-medium mt-0.5">{prof.specialite}</div>
                    )}
                </div>
            </div>

            {prof.telephone && (
                <div className="text-xs text-gray-500 mb-3">📞 {prof.telephone}</div>
            )}

            <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Groupes actifs ({groupesActifs.length})
                </p>
                {groupesActifs.length === 0
                    ? <p className="text-xs text-gray-300">Aucun groupe actif</p>
                    : <div className="space-y-1">
                        {groupesActifs.map(g => (
                            <div key={g.id} className="flex items-center gap-2 flex-wrap">
                                <Badge color="gold">{g.langue} {g.niveau}</Badge>
                                <span className="text-xs text-gray-500 truncate">{g.nom}</span>
                            </div>
                        ))}
                    </div>
                }
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-100">
                <Button variant="gold" size="sm" onClick={() => onEdit(prof)} className="flex-1">
                    <IconEdit /> Modifier
                </Button>
                <Button variant="danger" size="sm" onClick={() => onDelete(prof)} className="flex-1">
                    <IconTrash /> Désactiver
                </Button>
            </div>
        </div>
    )
}

export default function Index({ profs = [] }) {
    const { props }               = usePage()
    const flash                   = props.flash ?? {}
    const [modal, setModal]       = useState(false)
    const [editing, setEditing]   = useState(null)
    const [toDelete, setToDelete] = useState(null)

    const openEdit = (prof) => { setEditing(prof); setModal(true) }
    const closeModal = () => { setModal(false); setEditing(null) }

    const handleDelete = () => {
        router.delete(`/directeur/profs/${toDelete.id}`, {
            onSuccess: () => setToDelete(null),
            preserveScroll: true,
        })
    }

    return (
        <SiriusLayout title="Professeurs">
            <Flash success={flash.success} error={flash.error} />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Professeurs</h1>
                    <p className="page-subtitle">{profs.length} professeur{profs.length > 1 ? 's' : ''}</p>
                </div>
                <Button variant="gold" onClick={() => setModal(true)}>
                    <IconPlus /> Ajouter un professeur
                </Button>
            </div>

            {profs.length === 0
                ? <Empty
                    title="Aucun professeur"
                    subtitle="Ajoutez votre premier professeur"
                    icon={<IconProf />}
                  />
                : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profs.map(p => (
                        <ProfCard key={p.id} prof={p} onEdit={openEdit} onDelete={setToDelete} />
                    ))}
                  </div>
            }

            {modal && <ModalProf prof={editing} onClose={closeModal} />}

            {toDelete && (
                <Modal title="Désactiver le professeur" onClose={() => setToDelete(null)}>
                    <ModalBody>
                        <p className="text-sm text-gray-500 text-center">
                            Voulez-vous désactiver <strong>{toDelete.prenom} {toDelete.nom}</strong> ?
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