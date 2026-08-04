import { router, usePage } from '@inertiajs/react'
import Sidebar from '@/Components/Sidebar'
import { useState, useEffect, useCallback, useRef } from 'react'
// ── Toast System ──
let _toastId = 0

function ToastItem({ toast, onRemove }) {
    const [show, setShow] = useState(false)
    const [leave, setLeave] = useState(false)

    useEffect(() => {
        setTimeout(() => setShow(true), 10)
        const t = setTimeout(() => close(), toast.duration ?? 4000)
        return () => clearTimeout(t)
    }, [])

    const close = () => {
        setLeave(true)
        setTimeout(() => onRemove(toast.id), 300)
    }

    const colors = {
        success: 'border-l-4 border-green-500 bg-white',
        error:   'border-l-4 border-red-500 bg-white',
        warning: 'border-l-4 border-amber-500 bg-white',
        info:    'border-l-4 border-blue-500 bg-white',
    }

    const icons = {
        success: '✅',
        error:   '❌',
        warning: '⚠️',
        info:    'ℹ️',
    }

    return (
        <div className={`
            flex items-start gap-3 p-4 rounded-xl shadow-lg w-[350px]
            transition-all duration-300
            ${colors[toast.type] ?? colors.info}
            ${show && !leave ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
        `}>
            <span className="text-lg flex-shrink-0">{icons[toast.type]}</span>
            <p className="flex-1 text-sm text-gray-700">{toast.message}</p>
            <button onClick={close} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
        </div>
    )
}

function useToast() {
    const [toasts, setToasts] = useState([])

    const remove = useCallback((id) => {
        setToasts(p => p.filter(t => t.id !== id))
    }, [])

    const add = useCallback((message, type, duration = 4000) => {
        const id = ++_toastId
        setToasts(p => [...p, { id, message, type, duration }])
    }, [])

    return {
        toasts,
        remove,
        success: (msg) => add(msg, 'success'),
        error:   (msg) => add(msg, 'error'),
        warning: (msg) => add(msg, 'warning'),
        info:    (msg) => add(msg, 'info'),
    }
}

// ── Icons ──
const IconBell    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const IconSearch  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
const IconLogout  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>

export default function SiriusLayout({ children, title = '' }) {
    const { auth, alertesCount = 0, flash = {} } = usePage().props ?? {}
    const user       = auth?.user ?? null
    const initiales  = user ? `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}` : '?'
    const nomComplet = user ? `${user.prenom} ${user.nom}` : ''
    const role       = user?.role === 'directeur' ? 'Directeur' : user?.role === 'prof' ? 'Professeur' : ''

    const [search, setSearch]   = useState('')
    const [results, setResults] = useState([])
    const [showRes, setShowRes] = useState(false)

    const toast = useToast()
    const shownFlash = useRef(null)
    const prevFlash = useRef({ success: null, error: null })

const lastFlash = useRef('')
const handleSearch = async (val) => {
    if (val.length < 2) { setResults([]); setShowRes(false); return }
    try {
        const res  = await fetch(`/directeur/inscription/rechercher?q=${encodeURIComponent(val)}`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
        })
        const data = await res.json()
        setResults(Array.isArray(data) ? data : [])
        setShowRes(true)
    } catch { setResults([]) }
}
useEffect(() => {
    const current = JSON.stringify(flash)
    if (current === lastFlash.current) return
    lastFlash.current = current
    if (flash?.success) toast.success(flash.success)
    else if (flash?.error) toast.error(flash.error)
}, [flash])

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar user={user} />

            <div className="flex flex-col flex-1 min-w-0">

                {/* NAVBAR */}
                <header className="h-[72px] bg-white border-b border-gray-200 flex items-center px-4 md:px-8 justify-between flex-shrink-0 gap-4">

                    <div className="min-w-0 pl-12 md:pl-0">
                        <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400 mb-0.5">
                            <span>Sirius Center</span><span>›</span>
                            <span className="truncate">{title}</span>
                        </div>
                        <div className="text-base lg:text-lg font-semibold text-gray-900 leading-none truncate">
                            {title}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">

                        {/* Recherche */}
                        <div className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-48 lg:w-64 relative">
                            <span className="text-gray-400"><IconSearch /></span>
                        <input
                                type="text"
                                onChange={e => {
                                    setSearch(e.target.value)
                                    handleSearch(e.target.value)
                                }}
                                onBlur={() => setTimeout(() => setShowRes(false), 200)}
                                placeholder="Rechercher étudiant..."
                                className="text-[13px] text-gray-600 outline-none bg-transparent w-full"
                            />
                            {showRes && results.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                    {results.map(r => (
                                        <button key={r.id} type="button"
                                            onClick={() => { router.visit(`/directeur/etudiants/${r.id}`); setSearch(''); setShowRes(false) }}
                                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                            <div className="text-sm font-medium text-gray-900">{r.prenom} {r.nom}</div>
                                            <div className="text-xs text-gray-400">{r.cin} · {r.telephone}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cloche */}
                        <div className="relative cursor-pointer" onClick={() => user?.role === 'directeur' && router.visit('/directeur/alertes')}>
                            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                                <IconBell />
                            </div>
                            {alertesCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-sirius-danger rounded-full border-2 border-white text-[9px] text-white font-bold flex items-center justify-center">
                                    {alertesCount}
                                </span>
                            )}
                        </div>

                        <div className="hidden sm:block w-px h-7 bg-gray-200" />

                        {/* Profil */}
                        <div className="hidden sm:flex items-center gap-2 cursor-pointer px-2 lg:px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                            onClick={() => router.visit('/profil')}>
                            <div className="w-8 h-8 rounded-full bg-sirius-dark border-2 border-sirius-gold flex items-center justify-center text-xs font-semibold text-sirius-gold flex-shrink-0">
                                {initiales}
                            </div>
                            <div className="hidden lg:block">
                                <div className="text-[13px] font-medium text-gray-900 leading-tight">{nomComplet}</div>
                                <div className="text-[11px] text-gray-400">{role}</div>
                            </div>
                            <span className="text-gray-400"><IconChevron /></span>
                        </div>

                        {/* Déconnexion */}
                        <a href="/deconnexion" className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-sirius-danger-light border border-sirius-danger-border flex items-center justify-center text-sirius-danger hover:bg-red-100 transition-colors">
                            <IconLogout />
                        </a>
                    </div>
                </header>

                {/* CONTENU */}
                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    {children}
                </main>
            </div>

            {/* TOASTS */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toast.toasts.map(t => (
                    <div key={t.id} className="pointer-events-auto">
                        <ToastItem toast={t} onRemove={toast.remove} />
                    </div>
                ))}
            </div>
        </div>
    )
}