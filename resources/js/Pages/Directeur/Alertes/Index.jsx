import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Button from '@/Components/UI/Button'
import Badge from '@/Components/UI/Badge'
import Flash from '@/Components/UI/Flash'
import Empty from '@/Components/UI/Empty'

const IconBell     = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const IconEye      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IconCheck    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
const IconWhatsapp = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.93 7.93 0 0 0 3.8 1h0a7.94 7.94 0 0 0 7.94-7.94 7.88 7.88 0 0 0-2.34-5.62Zm-5.55 12.2h0a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.65.67-2.43-.16-.25a6.6 6.6 0 1 1 5.6 3.1Zm3.6-4.94c-.2-.1-1.17-.58-1.35-.64s-.32-.1-.45.1-.5.64-.62.77-.23.15-.43.05a5.43 5.43 0 0 1-1.6-1 6 6 0 0 1-1.1-1.37c-.12-.2 0-.3.1-.4s.2-.23.3-.35a1.4 1.4 0 0 0 .2-.34.4.4 0 0 0 0-.37c0-.1-.45-1.08-.62-1.48s-.33-.33-.45-.34h-.38a.74.74 0 0 0-.53.25 2.24 2.24 0 0 0-.7 1.67 3.9 3.9 0 0 0 .82 2.06 8.93 8.93 0 0 0 3.42 3 11.5 11.5 0 0 0 1.14.42 2.75 2.75 0 0 0 1.26.08 2.06 2.06 0 0 0 1.36-.96 1.7 1.7 0 0 0 .12-.96c-.05-.1-.18-.15-.38-.25Z"/></svg>

export default function Index({ alertes = [], total = 0 }) {
    const { props }   = usePage()
    const flash       = props.flash ?? {}
    const [filtre, setFiltre] = useState('tous')

    const alertesFiltrees = filtre === 'tous'
        ? alertes
        : alertes.filter(a => a.type === filtre)

    const absences  = alertes.filter(a => a.type === 'absence').length
    const paiements = alertes.filter(a => a.type === 'paiement').length

    const resoudre = (id) => {
        router.patch(`/directeur/alertes/${id}/resoudre`, {}, { preserveScroll: true })
    }

    const sendWhatsapp = (alerte) => {
        const etudiant = alerte.etudiant
        // Préférer téléphone parent si disponible
        const tel = etudiant.telParent || etudiant.telephone
        if (!tel) { alert('Aucun numéro disponible'); return }
        const phoneIntl = tel.replace(/\D/g, '').replace(/^0/, '212')

        let message = ''
        if (alerte.type === 'absence') {
            message = `Bonjour ${etudiant.nomParent ? etudiant.nomParent : etudiant.prenom},\n\nNous vous informons que ${etudiant.prenom} ${etudiant.nom} a ${alerte.message} dans le groupe ${alerte.groupe?.nom}.\n\nMerci de nous contacter pour régulariser la situation.\n\n— Sirius Center`
        } else {
            message = `Bonjour ${etudiant.nomParent ? etudiant.nomParent : etudiant.prenom},\n\nNous vous rappelons que ${etudiant.prenom} ${etudiant.nom} a un ${alerte.message} pour le groupe ${alerte.groupe?.nom}.\n\nMerci de régulariser avant la prochaine séance.\n\n— Sirius Center`
        }

        window.open(`https://wa.me/${phoneIntl}?text=${encodeURIComponent(message)}`, '_blank')
    }

    return (
        <SiriusLayout title="Alertes">
            <Flash success={flash.success} error={flash.error} />

            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Alertes</h1>
                    <p className="page-subtitle">{total} alerte{total > 1 ? 's' : ''} active{total > 1 ? 's' : ''}</p>
                </div>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="card-p flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{absences}</div>
                        <div className="text-xs text-gray-500">Absences</div>
                    </div>
                </div>
                <div className="card-p flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sirius-danger-light border border-sirius-danger-border flex items-center justify-center text-sirius-danger flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{paiements}</div>
                        <div className="text-xs text-gray-500">Paiements</div>
                    </div>
                </div>
            </div>

            {/* Filtres */}
            <div className="flex gap-2 mb-6">
                {[
                    { label: `Tous (${total})`,          value: 'tous' },
                    { label: `Absences (${absences})`,   value: 'absence' },
                    { label: `Paiements (${paiements})`, value: 'paiement' },
                ].map(f => (
                    <button key={f.value} onClick={() => setFiltre(f.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            filtre === f.value
                                ? 'bg-sirius-dark text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Liste */}
            {alertesFiltrees.length === 0 ? (
                <Empty title="Aucune alerte active" subtitle="Tout va bien !" icon={<IconBell />} />
            ) : (
                <div className="space-y-3">
                    {alertesFiltrees.map(a => (
                        <div key={a.id} className={`card p-4 border-l-4 ${
                            a.type === 'absence' ? 'border-l-orange-400' : 'border-l-sirius-danger'
                        }`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <Badge color={a.type === 'absence' ? 'orange' : 'red'}>
                                            {a.type === 'absence' ? '⚠️ Absence' : '💳 Paiement'}
                                        </Badge>
                                        {a.groupe && (
                                            <Badge color="gold">{a.groupe.langue} · {a.groupe.niveau} · {a.groupe.nom}</Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-7 h-7 rounded-full bg-sirius-gold-light border border-sirius-gold-border flex items-center justify-center text-sirius-gold text-xs font-semibold flex-shrink-0">
                                            {a.etudiant.prenom?.[0]}{a.etudiant.nom?.[0]}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {a.etudiant.prenom} {a.etudiant.nom}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-1">{a.message}</p>

                                    <div className="text-xs text-gray-400 flex items-center gap-3 flex-wrap">
                                        {a.etudiant.telephone && <span>📞 {a.etudiant.telephone}</span>}
                                        {a.etudiant.nomParent && <span>👤 {a.etudiant.nomParent} {a.etudiant.telParent && `· ${a.etudiant.telParent}`}</span>}
                                        <span>{new Date(a.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => router.get(`/directeur/etudiants/${a.etudiant.id}`)}
                                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-sirius-dark hover:text-white transition-all"
                                        title="Voir fiche"
                                    >
                                        <IconEye />
                                    </button>
                                    <button
                                        onClick={() => sendWhatsapp(a)}
                                        className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-500 hover:text-white transition-all"
                                        title="Envoyer WhatsApp"
                                    >
                                        <IconWhatsapp />
                                    </button>
                                    <button
                                        onClick={() => resoudre(a.id)}
                                        className="w-8 h-8 rounded-lg bg-sirius-gold-light flex items-center justify-center text-sirius-gold hover:bg-sirius-gold hover:text-white transition-all"
                                        title="Marquer comme résolu"
                                    >
                                        <IconCheck />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SiriusLayout>
    )
}