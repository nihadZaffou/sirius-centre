import { usePage } from '@inertiajs/react'
import Sidebar from '@/Components/Sidebar'

const IconBell    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const IconSearch  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
const IconLogout  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>

export default function SiriusLayout({ children, title = '' }) {
    const { auth } = usePage().props ?? {}
    const user      = auth?.user ?? null
    const initiales  = user ? `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}` : '?'
    const nomComplet = user ? `${user.prenom} ${user.nom}` : ''
    const role = user?.role === 'directeur' ? 'Directeur' : user?.role === 'prof' ? 'Professeur' : ''

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar user={user} />

            <div className="flex flex-col flex-1 min-w-0">

                {/* NAVBAR */}
                <header className="h-[72px] bg-white border-b border-gray-200 flex items-center px-4 md:px-8 justify-between flex-shrink-0 gap-4">

                    <div className="min-w-0 pl-12 md:pl-0">
                        <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400 mb-0.5">
                            <span>Sirius Center</span>
                            <span>›</span>
                            <span className="truncate">{title}</span>
                        </div>
                        <div className="text-base lg:text-lg font-semibold text-gray-900 leading-none truncate">
                            {title}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">

                        <div className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-48 lg:w-64">
                            <span className="text-gray-400"><IconSearch /></span>
                            <span className="text-[13px] text-gray-400">Rechercher...</span>
                        </div>

                        <div className="relative cursor-pointer">
                            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                                <IconBell />
                            </div>
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-sirius-danger rounded-full border-2 border-white text-[9px] text-white font-bold flex items-center justify-center">
                                3
                            </span>
                        </div>

                        <div className="hidden sm:block w-px h-7 bg-gray-200" />

                        <div className="hidden sm:flex items-center gap-2 cursor-pointer px-2 lg:px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-sirius-dark border-2 border-sirius-gold flex items-center justify-center text-xs font-semibold text-sirius-gold flex-shrink-0">
                                {initiales}
                            </div>
                            <div className="hidden lg:block">
                                <div className="text-[13px] font-medium text-gray-900 leading-tight">{nomComplet}</div>
                                <div className="text-[11px] text-gray-400">{role}</div>
                            </div>
                            <span className="text-gray-400"><IconChevron /></span>
                        </div>

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
        </div>
    )
}