export default function Button({
    children,
    variant = 'gold',
    size = 'md',
    icon = false,
    loading = false,
    disabled = false,
    onClick,
    type = 'button',
    className = '',
}) {
    const variants = {
        gold:    'btn-gold',
        dark:    'btn-dark',
        danger:  'btn-danger',
        outline: 'btn-outline',
        ghost:   'btn-ghost',
    }
    const sizes = {
        sm: 'btn-sm',
        md: '',
        icon: 'btn-icon',
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`btn ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {loading ? (
                <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Chargement...
                </>
            ) : children}
        </button>
    )
}