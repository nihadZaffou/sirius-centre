import { Link, usePage } from '@inertiajs/react'
import { useState } from 'react'

// Icons
const IconDashboard    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
const IconLangues      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
const IconGroupes      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const IconEtudiants    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
const IconProfs        = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
const IconPaiements    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IconAttestations = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
const IconAlertes      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const IconAnnonces     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/></svg>
const IconTraductions  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
const IconLogs         = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const IconLogout       = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IconMenu         = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
const IconX            = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

const menuDirecteur = {
    principal: [
        { label: 'Dashboard',     href: '/directeur/dashboard',    icon: <IconDashboard />,    gold: true },
        { label: 'Langues',       href: '/directeur/langues',      icon: <IconLangues />,      gold: true },
        { label: 'Groupes',       href: '/directeur/langues',      icon: <IconGroupes />,      gold: true },
        { label: 'Étudiants',     href: '/directeur/etudiants',    icon: <IconEtudiants />,    gold: true },
        { label: 'Professeurs',   href: '/directeur/profs',        icon: <IconProfs />,        gold: true },
        { label: 'Attestations',  href: '/directeur/attestations', icon: <IconAttestations />, gold: true },
    ],
    gestion: [
        { label: 'Alertes',      href: '/directeur/alertes',     icon: <IconAlertes />,     danger: true, badge: 3 },
        { label: 'Annonces',     href: '/directeur/annonces',    icon: <IconAnnonces />,    white: true },
        { label: 'Traductions',  href: '/directeur/traductions', icon: <IconTraductions />, white: true },
        { label: 'Logs',         href: '/directeur/logs',        icon: <IconLogs />,        white: true },
    ],
}
const menuDirecteurSecondaire = {
    principal: [
        { label: 'Dashboard',    href: '/directeur/dashboard',    icon: <IconDashboard />, gold: true },
        { label: 'Attestations', href: '/directeur/attestations', icon: <IconAttestations />, gold: true },
        { label: 'Traductions',  href: '/directeur/traductions',  icon: <IconTraductions />, white: true },
    ],
    gestion: [],
}

const menuProf = {
    principal: [
        { label: 'Dashboard',    href: '/prof/dashboard', icon: <IconDashboard />, gold: true },
        { label: 'Mes groupes',  href: '/prof/groupes',   icon: <IconGroupes />,   gold: true },
    ],
    gestion: [],
}

function MenuItem({ item, active }) {
    const iconColor = item.danger
        ? 'text-sirius-danger'
        : item.gold
            ? 'text-sirius-gold'
            : 'text-gray-200'

    return (
        <Link href={item.href} className="no-underline block">
            <div className={`sidebar-item ${active ? 'sidebar-item-active' : ''}`}>
                <span className={`flex-shrink-0 ${active ? 'text-sirius-gold' : iconColor}`}>
                    {item.icon}
                </span>
                <span className={`text-[13px] truncate ${active ? 'text-white font-medium' : 'text-gray-500'}`}>
                    {item.label}
                </span>
                {item.badge && (
                    <span className="ml-auto badge-red badge text-[10px] px-1.5 py-0.5">
                        {item.badge}
                    </span>
                )}
            </div>
        </Link>
    )
}

function SidebarContent({ user, url, onClose }) {
const menu = user?.role === 'prof'
    ? menuProf
    : user?.typeAcces === 'secondaire'
        ? menuDirecteurSecondaire
        : menuDirecteur

    return (
        <div className="flex flex-col h-full bg-sirius-dark">

            {/* Logo */}
            <div className="px-5 pt-6 pb-5 border-b border-sirius-dark-2 text-center">
                {onClose && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 md:hidden">
                        <IconX />
                    </button>
                )}
                <img
                    src="/images/logo-sirius.png"
                    alt="Sirius Center"
                    className="w-24 h-24 object-contain mx-auto mb-2"
                    style={{ mixBlendMode: 'screen' }}
                />
                <div className="text-sirius-gold text-[15px] font-bold tracking-[2px]">SIRIUS CENTER</div>
                <div className="text-gray-600 text-[10px] tracking-wide mt-0.5">Centre de Langues et de Formation</div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <p className="text-[10px] font-semibold text-gray-700 uppercase tracking-[1.5px] px-2 mb-2">
                    Principal
                </p>
                {menu.principal.map(item => (
                    <MenuItem key={item.href + item.label} item={item} active={url === item.href || url.startsWith(item.href + '/')} />
                ))}

                {menu.gestion.length > 0 && (
                    <>
                        <div className="h-px bg-sirius-dark-2 my-3" />
                        <p className="text-[10px] font-semibold text-gray-700 uppercase tracking-[1.5px] px-2 mb-2">
                            Gestion
                        </p>
                        {menu.gestion.map(item => (
                            <MenuItem key={item.href + item.label} item={item} active={url === item.href} />
                        ))}
                    </>
                )}
            </nav>

            {/* User */}
            <div className="px-4 py-4 border-t border-sirius-dark-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sirius-dark-2 border-2 border-sirius-gold flex items-center justify-center text-xs font-semibold text-sirius-gold flex-shrink-0">
                    {user?.prenom?.[0]}{user?.nom?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-gray-200 truncate">
                        {user?.prenom} {user?.nom}
                    </div>
                    <div className="text-[11px] text-sirius-gold">
                        {user?.role === 'directeur' ? 'Directeur' : 'Professeur'}
                    </div>
                </div>
                <a href="/deconnexion" className="text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0">
                    <IconLogout />
                </a>
            </div>
        </div>
    )
}

export default function Sidebar({ user }) {
    const { url } = usePage()
    const [mobileOpen, setMobileOpen] = useState(false)

    if (!user) return null

    return (
        <>
            {/* Bouton menu mobile */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-sirius-dark rounded-xl flex items-center justify-center text-sirius-gold shadow-lg"
            >
                <IconMenu />
            </button>

            {/* Overlay mobile */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar mobile */}
            <div className={`md:hidden fixed top-0 left-0 h-full w-[270px] z-50 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent user={user} url={url} onClose={() => setMobileOpen(false)} />
            </div>

            {/* Sidebar desktop */}
            <aside className="hidden md:flex flex-col w-[270px] min-h-screen flex-shrink-0">
                <SidebarContent user={user} url={url} />
            </aside>
        </>
    )
}