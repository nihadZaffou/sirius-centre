import { useState, useEffect } from 'react'

const IconCheck  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
const IconX      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconWarn   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const IconClose  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

function ToastItem({ toast, onRemove }) {
    const [visible, setVisible] = useState(false)
    const [leaving, setLeaving] = useState(false)

    useEffect(() => {
        // Apparition
        setTimeout(() => setVisible(true), 10)
        // Disparition automatique
        const timer = setTimeout(() => handleClose(), toast.duration ?? 4000)
        return () => clearTimeout(timer)
    }, [])

    const handleClose = () => {
        setLeaving(true)
        setTimeout(() => onRemove(toast.id), 300)
    }

    const styles = {
        success: {
            bg:     'bg-white border-l-4 border-green-500',
            icon:   'text-green-500 bg-green-50',
            IconEl: <IconCheck />,
        },
        error: {
            bg:     'bg-white border-l-4 border-sirius-danger',
            icon:   'text-sirius-danger bg-red-50',
            IconEl: <IconX />,
        },
        warning: {
            bg:     'bg-white border-l-4 border-amber-500',
            icon:   'text-amber-500 bg-amber-50',
            IconEl: <IconWarn />,
        },
        info: {
            bg:     'bg-white border-l-4 border-blue-500',
            icon:   'text-blue-500 bg-blue-50',
            IconEl: <IconWarn />,
        },
    }

    const s = styles[toast.type] ?? styles.info

    return (
        <div className={`
            flex items-start gap-3 p-4 rounded-xl shadow-lg min-w-[300px] max-w-[400px]
            transition-all duration-300 ease-out
            ${s.bg}
            ${visible && !leaving ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
        `}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${s.icon}`}>
                {s.IconEl}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
                {toast.title && (
                    <div className="text-sm font-semibold text-gray-900 mb-0.5">{toast.title}</div>
                )}
                <div className="text-sm text-gray-600">{toast.message}</div>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-0.5">
                <IconClose />
            </button>
        </div>
    )
}

export function ToastContainer({ toasts, onRemove }) {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map(t => (
                <div key={t.id} className="pointer-events-auto">
                    <ToastItem toast={t} onRemove={onRemove} />
                </div>
            ))}
        </div>
    )
}