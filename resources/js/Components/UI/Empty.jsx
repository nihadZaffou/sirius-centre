export default function Empty({ title = 'Aucun résultat', subtitle = '', icon }) {
    return (
        <div className="empty-state">
            {icon && (
                <div className="flex justify-center mb-3 text-gray-300">
                    {icon}
                </div>
            )}
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            {subtitle && <p className="text-xs text-gray-300">{subtitle}</p>}
        </div>
    )
}