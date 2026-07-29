const IconCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
)
const IconAlert = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
)

export default function Flash({ success, error }) {
    if (!success && !error) return null
    return (
        <>
            {success && (
                <div className="flash-success">
                    <span className="text-green-600"><IconCheck /></span>
                    <p className="text-sm text-green-700">{success}</p>
                </div>
            )}
            {error && (
                <div className="flash-error">
                    <span className="text-sirius-danger"><IconAlert /></span>
                    <p className="text-sm text-sirius-danger">{error}</p>
                </div>
            )}
        </>
    )
}