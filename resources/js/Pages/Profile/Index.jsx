import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Button from '@/Components/UI/Button'
import Input from '@/Components/UI/Input'
import Flash from '@/Components/UI/Flash'

export default function Index({ user }) {
    const { props } = usePage()
    const flash     = props.flash ?? {}

    const [formProfil, setFormProfil] = useState({
        nom:       user.nom       ?? '',
        prenom:    user.prenom    ?? '',
        telephone: user.telephone ?? '',
    })

    const [formPassword, setFormPassword] = useState({
        ancien:                  '',
        nouveau:                 '',
        nouveau_confirmation:    '',
    })

    const [errorsProfil,   setErrorsProfil]   = useState({})
    const [errorsPassword, setErrorsPassword] = useState({})
    const [loadingProfil,  setLoadingProfil]  = useState(false)
    const [loadingPassword,setLoadingPassword]= useState(false)

    const submitProfil = (e) => {
        e.preventDefault()
        setLoadingProfil(true)
        router.put('/profil', formProfil, {
            onSuccess: () => setLoadingProfil(false),
            onError:   (e) => { setErrorsProfil(e); setLoadingProfil(false) },
        })
    }

    const submitPassword = (e) => {
        e.preventDefault()
        setLoadingPassword(true)
        router.put('/profil/password', formPassword, {
            onSuccess: () => {
                setLoadingPassword(false)
                setFormPassword({ ancien: '', nouveau: '', nouveau_confirmation: '' })
            },
            onError: (e) => { setErrorsPassword(e); setLoadingPassword(false) },
        })
    }

    const initiales = `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`
    const role = user.role === 'directeur' ? 'Directeur' : 'Professeur'

    return (
        <SiriusLayout title="Mon profil">
            <Flash success={flash.success} error={flash.error} />

            <div className="page-header mb-8">
                <div>
                    <h1 className="page-title">Mon profil</h1>
                    <p className="page-subtitle">Gérez vos informations personnelles</p>
                </div>
            </div>

            <div className="max-w-2xl space-y-6">

                {/* Avatar + infos */}
                <div className="card-p flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-sirius-dark border-2 border-sirius-gold flex items-center justify-center text-xl font-bold text-sirius-gold flex-shrink-0">
                        {initiales}
                    </div>
                    <div>
                        <div className="text-lg font-bold text-gray-900">{user.prenom} {user.nom}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-sirius-gold font-medium mt-1">{role}</div>
                    </div>
                </div>

                {/* Modifier infos */}
                <div className="card overflow-hidden">
                    <div className="section-header">
                        <div className="flex items-center gap-2.5">
                            <div className="w-1 h-5 rounded-full bg-sirius-gold" />
                            <span className="text-[15px] font-semibold text-gray-900">Informations personnelles</span>
                        </div>
                    </div>
                    <div className="section-body">
                        <form onSubmit={submitProfil} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Nom"
                                    value={formProfil.nom}
                                    onChange={e => setFormProfil(f => ({ ...f, nom: e.target.value }))}
                                    error={errorsProfil.nom}
                                    required
                                />
                                <Input
                                    label="Prénom"
                                    value={formProfil.prenom}
                                    onChange={e => setFormProfil(f => ({ ...f, prenom: e.target.value }))}
                                    error={errorsProfil.prenom}
                                    required
                                />
                            </div>
                            <Input
                                label="Téléphone"
                                value={formProfil.telephone}
                                onChange={e => setFormProfil(f => ({ ...f, telephone: e.target.value }))}
                                error={errorsProfil.telephone}
                                placeholder="0612345678"
                            />
                            <div className="flex justify-end">
                                <Button variant="gold" type="submit" loading={loadingProfil}>
                                    Enregistrer
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Changer mot de passe */}
                <div className="card overflow-hidden">
                    <div className="section-header">
                        <div className="flex items-center gap-2.5">
                            <div className="w-1 h-5 rounded-full bg-sirius-gold" />
                            <span className="text-[15px] font-semibold text-gray-900">Changer le mot de passe</span>
                        </div>
                    </div>
                    <div className="section-body">
                        <form onSubmit={submitPassword} className="space-y-4">
                            <Input
                                label="Ancien mot de passe"
                                type="password"
                                value={formPassword.ancien}
                                onChange={e => setFormPassword(f => ({ ...f, ancien: e.target.value }))}
                                error={errorsPassword.ancien}
                                required
                            />
                            <Input
                                label="Nouveau mot de passe"
                                type="password"
                                value={formPassword.nouveau}
                                onChange={e => setFormPassword(f => ({ ...f, nouveau: e.target.value }))}
                                error={errorsPassword.nouveau}
                                required
                            />
                            <Input
                                label="Confirmer nouveau mot de passe"
                                type="password"
                                value={formPassword.nouveau_confirmation}
                                onChange={e => setFormPassword(f => ({ ...f, nouveau_confirmation: e.target.value }))}
                                error={errorsPassword.nouveau_confirmation}
                                required
                            />
                            <div className="flex justify-end">
                                <Button variant="gold" type="submit" loading={loadingPassword}>
                                    Changer le mot de passe
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </SiriusLayout>
    )
}