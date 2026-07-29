const IconX = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
)

export default function Modal({ title, subtitle, onClose, children, maxWidth = 'max-w-md' }) {
    return (
        <div className="modal-overlay">
            <div className={`modal-box ${maxWidth}`}>
                <div className="modal-header">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
                    </div>
                    <button onClick={onClose} className="btn-ghost btn-icon text-gray-400">
                        <IconX />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export function ModalBody({ children }) {
    return <div className="modal-body">{children}</div>
}

export function ModalFooter({ children }) {
    return <div className="p-6 pt-0 flex gap-3">{children}</div>
}