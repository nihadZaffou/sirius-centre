import { useForm } from '@inertiajs/react'
import { useState } from 'react'

const IconEmail = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </svg>
)

const IconLock = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
)

const IconEye = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
)

const IconEyeOff = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
)

const IconAlert = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
)

const IconCheck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
)

function InputField({ label, type = 'text', value, onChange, placeholder, error, icon, rightElement }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <div className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border bg-white transition-all
                ${error
                    ? 'border-sirius-danger ring-2 ring-sirius-danger/15'
                    : 'border-gray-200 focus-within:border-sirius-gold focus-within:ring-2 focus-within:ring-sirius-gold/20'
                }
            `}>
                <span className={error ? 'text-sirius-danger' : 'text-gray-400'}>{icon}</span>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="flex-1 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-300"
                />
                {rightElement}
            </div>
            {error && (
                <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-sirius-danger"><IconAlert /></span>
                    <p className="text-xs text-sirius-danger">{error}</p>
                </div>
            )}
        </div>
    )
}

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const [showPassword, setShowPassword] = useState(false)
    const [attempted, setAttempted] = useState(false)

    // Validation locale
    const localErrors = {}
    if (attempted) {
        if (!data.email) localErrors.email = 'L\'adresse email est requise.'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) localErrors.email = 'Adresse email invalide.'
        if (!data.password) localErrors.password = 'Le mot de passe est requis.'
        else if (data.password.length < 6) localErrors.password = 'Le mot de passe doit contenir au moins 6 caractères.'
    }

    const allErrors = { ...localErrors, ...errors }
    const hasErrors = Object.keys(allErrors).length > 0

    const submit = (e) => {
        e.preventDefault()
        setAttempted(true)

        // Validation locale avant envoi
        if (!data.email || !data.password || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return

        post('/login', {
            onError: () => reset('password'),
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">

            {/* Panneau gauche — branding */}
            <div className="hidden lg:flex w-1/2 bg-sirius-dark flex-col items-center justify-center p-12">
                <img
                    src="/images/logo-sirius.png"
                    alt="Sirius Center"
                    className="w-44 h-44 object-contain mb-8"
                    style={{ mixBlendMode: 'screen' }}
                />
                <h1 className="text-sirius-gold text-3xl font-bold tracking-widest mb-2">
                    SIRIUS CENTER
                </h1>
                <p className="text-gray-500 text-sm tracking-wide text-center mb-16">
                    Centre de Langues et de Formation
                </p>

                <div className="w-full max-w-xs space-y-0">
                    {[
                        { label: 'Langues enseignées', value: '8' },
                        { label: 'Niveaux disponibles', value: '9' },
                        { label: 'Gestion complète',   value: '100%' },
                    ].map(item => (
                        <div key={item.label} className="flex items-center justify-between py-4 border-b border-gray-800">
                            <div className="flex items-center gap-2">
                                <span className="text-sirius-gold"><IconCheck /></span>
                                <span className="text-gray-500 text-sm">{item.label}</span>
                            </div>
                            <span className="text-sirius-gold font-bold">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Panneau droit — formulaire */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">

                    {/* Logo mobile */}
                    <div className="lg:hidden text-center mb-8">
                        <img
                            src="/images/logo-sirius.png"
                            alt="Sirius Center"
                            className="w-24 h-24 object-contain mx-auto mb-3"
                        />
                        <h1 className="text-sirius-gold text-xl font-bold tracking-widest">SIRIUS CENTER</h1>
                    </div>

                    {/* Message statut (ex: déconnexion réussie) */}
                    {status && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <p className="text-sm text-green-700">{status}</p>
                        </div>
                    )}

                    {/* Erreur globale */}
                    {errors.email && attempted && (
                        <div className="flex items-center gap-2 bg-sirius-danger-light border border-sirius-danger-border rounded-xl px-4 py-3 mb-4">
                            <span className="text-sirius-danger flex-shrink-0"><IconAlert /></span>
                            <p className="text-sm text-sirius-danger">
                                Email ou mot de passe incorrect. Vérifiez vos identifiants.
                            </p>
                        </div>
                    )}

                    {/* Card formulaire */}
                    <div className="bg-white rounded-2xl p-8 border border-gray-200">

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">Connexion</h2>
                            <p className="text-sm text-gray-500">Accédez à votre espace de gestion</p>
                        </div>

                        <form onSubmit={submit} className="space-y-5" noValidate>

                            <InputField
                                label="Adresse email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="admin@sirius.ma"
                                error={allErrors.email}
                                icon={<IconEmail />}
                            />

                            <InputField
                                label="Mot de passe"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                                error={allErrors.password}
                                icon={<IconLock />}
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <IconEyeOff /> : <IconEye />}
                                    </button>
                                }
                            />

                            {/* Se souvenir */}
                            <div className="flex items-center gap-2">
                                <div
                                    onClick={() => setData('remember', !data.remember)}
                                    className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all flex-shrink-0 ${
                                        data.remember
                                            ? 'bg-sirius-gold border-sirius-gold'
                                            : 'border-gray-300'
                                    }`}
                                >
                                    {data.remember && (
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    )}
                                </div>
                                <label
                                    onClick={() => setData('remember', !data.remember)}
                                    className="text-sm text-gray-500 cursor-pointer select-none"
                                >
                                    Se souvenir de moi
                                </label>
                            </div>

                            {/* Bouton */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-sirius-gold text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                        </svg>
                                        Connexion en cours...
                                    </>
                                ) : 'Se connecter'}
                            </button>

                        </form>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        Sirius Center · Système de gestion interne · {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    )
}