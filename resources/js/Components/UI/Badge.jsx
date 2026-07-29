export default function Badge({ children, color = 'gray' }) {
    const colors = {
        gold:   'badge-gold',
        green:  'badge-green',
        red:    'badge-red',
        orange: 'badge-orange',
        blue:   'badge-blue',
        gray:   'badge-gray',
    }
    return (
        <span className={`badge ${colors[color]}`}>{children}</span>
    )
}