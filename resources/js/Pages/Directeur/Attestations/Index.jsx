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
const IconDownload = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const IconTrash    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
const IconSearch   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const IconX        = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconDoc      = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>

const anneeCourante = () => {
    const now = new Date()
    const y   = now.getFullYear()
    return now.getMonth() >= 8 ? `${y}/${y+1}` : `${y-1}/${y}`
}

function ModalGenerer({ langues, onClose }) {
    const [search, setSearch]         = useState('')
    const [resultats, setResultats]   = useState([])
    const [etudiant, setEtudiant]     = useState(null)
    const [langue, setLangue]         = useState('')
    const [niveau, setNiveau]         = useState('')
    const [annee, setAnnee]           = useState(anneeCourante())
    const [errors, setErrors]         = useState({})
    const [loading, setLoading]       = useState(false)

    const niveauxDispos = langue
        ? langues.find(l => l.code === langue)?.niveaux ?? []
        : []

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
    if (!etudiant) errs.etudiant = 'Choisissez un étudiant'
    if (!langue)   errs.langue   = 'Choisissez une langue'
    if (!niveau)   errs.niveau   = 'Choisissez un niveau'
    if (!annee)    errs.annee    = 'Saisissez l\'année scolaire'
    if (Object.keys(errs).length) { setErrors(errs); return }

    // Utiliser fetch pour appeler Laravel et récupérer l'URL de redirect
    const params = new URLSearchParams({
        idEtudiant: etudiant.id,
        langue,
        niveau,
        annee,
    })

    window.location.href = `/directeur/attestations/preview?${params.toString()}`
    onClose()
}
    return (
        <Modal title="Générer une attestation" onClose={onClose} maxWidth="max-w-lg">
            <form onSubmit={submit}>
                <ModalBody>
                    <div className="space-y-4">

                        {/* Recherche étudiant */}
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

                        {/* Langue */}
                        <div>
                            <label className="label">Langue <span className="text-sirius-danger">*</span></label>
                            <select
                                value={langue}
                                onChange={e => { setLangue(e.target.value); setNiveau('') }}
                                className={`select ${errors.langue ? 'input-error' : ''}`}
                            >
                                <option value="">Choisir une langue</option>
                                {langues.map(l => (
                                    <option key={l.code} value={l.code}>{l.label}</option>
                                ))}
                            </select>
                            {errors.langue && <p className="text-xs text-sirius-danger mt-1">{errors.langue}</p>}
                        </div>

                        {/* Niveau */}
                        {langue && (
                            <div>
                                <label className="label">Niveau <span className="text-sirius-danger">*</span></label>
                                <select
                                    value={niveau}
                                    onChange={e => setNiveau(e.target.value)}
                                    className={`select ${errors.niveau ? 'input-error' : ''}`}
                                >
                                    <option value="">Choisir un niveau</option>
                                    {niveauxDispos.map(n => (
                                        <option key={n.code} value={n.code}>{n.label}</option>
                                    ))}
                                </select>
                                {errors.niveau && <p className="text-xs text-sirius-danger mt-1">{errors.niveau}</p>}
                            </div>
                        )}

                        {/* Année scolaire */}
                        <Input
                            label="Année scolaire"
                            value={annee}
                            onChange={e => setAnnee(e.target.value)}
                            error={errors.annee}
                            placeholder="2025/2026"
                            required
                        />

                        <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                            <p className="text-xs text-blue-600">
                                Le PDF sera téléchargé automatiquement après génération.
                            </p>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={onClose} type="button" className="flex-1">Annuler</Button>
                    <Button variant="gold" type="submit" loading={loading} className="flex-1">
                        <IconDownload /> Générer PDF
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export default function Index({ attestations = [], langues = [] }) {
    const { props }                   = usePage()
    const flash                       = props.flash ?? {}
    const [modalGenerer, setModal]    = useState(false)
    const [toDelete, setToDelete]     = useState(null)

    const handleDelete = () => {
        router.delete(`/directeur/attestations/${toDelete.id}`, {
            onSuccess: () => setToDelete(null),
        })
    }

    const statutColor = (s) => ({
        validee:    'green',
        en_attente: 'orange',
        refusee:    'red',
    }[s] ?? 'gray')

    const statutLabel = (s) => ({
        validee:    'Générée',
        en_attente: 'En attente',
        refusee:    'Refusée',
    }[s] ?? s)

    return (
        <SiriusLayout title="Attestations">
            <Flash success={flash.success} error={flash.error} />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Attestations</h1>
                    <p className="page-subtitle">{attestations.length} attestation{attestations.length > 1 ? 's' : ''}</p>
                </div>
                <Button variant="gold" onClick={() => setModal(true)}>
                    <IconPlus /> Générer une attestation
                </Button>
            </div>

            {attestations.length === 0 ? (
                <Empty title="Aucune attestation" subtitle="Générez la première attestation" icon={<IconDoc />} />
            ) : (
                <div className="table-wrapper">
                    {/* Desktop */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th">Étudiant</th>
                                    <th className="table-th">Langue</th>
                                    <th className="table-th">Niveau</th>
                                    <th className="table-th">Date</th>
                                    <th className="table-th">Statut</th>
                                    <th className="table-th text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attestations.map(a => (
                                    <tr key={a.id} className="table-tr">
                                        <td className="table-td">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-sirius-gold-light border border-sirius-gold-border flex items-center justify-center text-sirius-gold text-xs font-semibold">
                                                    {a.etudiant.prenom?.[0]}{a.etudiant.nom?.[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{a.etudiant.prenom} {a.etudiant.nom}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-td capitalize">{a.langue}</td>
                                        <td className="table-td">
                                            <Badge color="gold">{a.niveau?.toUpperCase()}</Badge>
                                        </td>
                                        <td className="table-td text-xs text-gray-500">
                                            {new Date(a.date).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="table-td">
                                            <Badge color={statutColor(a.statut)}>{statutLabel(a.statut)}</Badge>
                                        </td>
                                        <td className="table-td">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setToDelete(a)}
                                                    className="w-8 h-8 rounded-lg bg-sirius-danger-light flex items-center justify-center text-sirius-danger hover:bg-sirius-danger hover:text-white transition-all"
                                                >
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {attestations.map(a => (
                            <div key={a.id} className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">{a.etudiant.prenom} {a.etudiant.nom}</div>
                                        <div className="text-xs text-gray-400 capitalize">{a.langue} · {a.niveau?.toUpperCase()}</div>
                                    </div>
                                    <Badge color={statutColor(a.statut)}>{statutLabel(a.statut)}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">{new Date(a.date).toLocaleDateString('fr-FR')}</span>
                                    <button onClick={() => setToDelete(a)}
                                        className="w-8 h-8 rounded-lg bg-sirius-danger-light flex items-center justify-center text-sirius-danger hover:bg-sirius-danger hover:text-white transition-all">
                                        <IconTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {modalGenerer && <ModalGenerer langues={langues} onClose={() => setModal(false)} />}

            {toDelete && (
                <Modal title="Supprimer l'attestation" onClose={() => setToDelete(null)}>
                    <ModalBody>
                        <p className="text-sm text-gray-500 text-center">
                            Voulez-vous supprimer l'attestation de <strong>{toDelete.etudiant.prenom} {toDelete.etudiant.nom}</strong> ?
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