import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Button from '@/Components/UI/Button'
import Badge from '@/Components/UI/Badge'
import Flash from '@/Components/UI/Flash'

const IconArrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
const IconCheck = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
const IconX     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

export default function Presences({ groupe, etudiants = [], date, dejaMarque = false }) {
    const { props } = usePage()
    const flash     = props.flash ?? {}

    // State présences — null = pas encore marqué, true = présent, false = absent
    const [presences, setPresences] = useState(() => {
        const init = {}
        etudiants.forEach(e => {
            init[e.id] = e.presence
        })
        return init
    })
    const [loading, setLoading] = useState(false)

    const togglePresence = (id, value) => {
        setPresences(prev => ({ ...prev, [id]: value }))
    }

    const tousPresents = () => {
        const all = {}
        etudiants.forEach(e => { all[e.id] = true })
        setPresences(all)
    }

    const submit = () => {
        const presencesArray = etudiants.map(e => ({
            idEtudiant: e.id,
            present:    presences[e.id] ?? false,
        }))

        setLoading(true)
        router.post(`/prof/presences/${groupe.id}`, {
            date,
            presences: presencesArray,
        }, {
            onSuccess: () => setLoading(false),
            onError:   () => setLoading(false),
        })
    }

    const nbPresents = Object.values(presences).filter(v => v === true).length
    const nbAbsents  = Object.values(presences).filter(v => v === false).length
    const nbTotal    = etudiants.length

    return (
        <SiriusLayout title={`Présences — ${groupe.nom}`}>
            <Flash success={flash.success} error={flash.error} />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" onClick={() => router.get('/prof/dashboard')}>
                    <IconArrow />
                </Button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h1 className="text-2xl font-bold text-gray-900">{groupe.nom}</h1>
                        <Badge color="gold">{groupe.langue} · {groupe.niveau}</Badge>
                        {dejaMarque && <Badge color="green">Déjà marqué aujourd'hui</Badge>}
                    </div>
                    <p className="page-subtitle">
                        {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="card-p text-center">
                    <div className="text-2xl font-bold text-gray-900">{nbTotal}</div>
                    <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="card-p text-center">
                    <div className="text-2xl font-bold text-green-600">{nbPresents}</div>
                    <div className="text-xs text-gray-500">Présents</div>
                </div>
                <div className="card-p text-center">
                    <div className="text-2xl font-bold text-sirius-danger">{nbAbsents}</div>
                    <div className="text-xs text-gray-500">Absents</div>
                </div>
            </div>

            {/* Actions rapides */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={tousPresents}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors"
                >
                    ✓ Tous présents
                </button>
            </div>

            {/* Liste étudiants */}
            <div className="card overflow-hidden mb-6">
                {etudiants.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">Aucun étudiant dans ce groupe</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {etudiants.map((e, i) => (
                            <div key={e.id} className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                                presences[e.id] === true  ? 'bg-green-50' :
                                presences[e.id] === false ? 'bg-red-50' : 'bg-white'
                            }`}>
                                {/* Numéro */}
                                <div className="w-6 text-xs text-gray-400 flex-shrink-0">{i + 1}</div>

                                {/* Avatar */}
                                <div className="w-9 h-9 rounded-full bg-sirius-gold-light border border-sirius-gold-border flex items-center justify-center text-sirius-gold text-xs font-semibold flex-shrink-0">
                                    {e.prenom?.[0]}{e.nom?.[0]}
                                </div>

                                {/* Nom */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900">
                                        {e.prenom} {e.nom}
                                    </div>
                                </div>

                                {/* Boutons présent/absent */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => togglePresence(e.id, true)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                            presences[e.id] === true
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                                        }`}
                                        title="Présent"
                                    >
                                        <IconCheck />
                                    </button>
                                    <button
                                        onClick={() => togglePresence(e.id, false)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                            presences[e.id] === false
                                                ? 'bg-sirius-danger text-white'
                                                : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-sirius-danger'
                                        }`}
                                        title="Absent"
                                    >
                                        <IconX />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bouton enregistrer */}
            <div className="flex justify-end">
                <Button
                    variant="gold"
                    onClick={submit}
                    loading={loading}
                    disabled={etudiants.length === 0}
                >
                    {dejaMarque ? 'Mettre à jour les présences' : 'Enregistrer les présences'}
                </Button>
            </div>

        </SiriusLayout>
    )
}