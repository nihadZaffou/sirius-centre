import { useState, useCallback } from 'react'

let toastId = 0

export function useToast() {
    const [toasts, setToasts] = useState([])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const addToast = useCallback((message, type, title = '', duration = 4000) => {
        const id = ++toastId
        setToasts(prev => [...prev, { id, message, type, title, duration }])
    }, [])

    const toast = {
        success: (msg, title) => addToast(msg, 'success', title),
        error:   (msg, title) => addToast(msg, 'error',   title),
        warning: (msg, title) => addToast(msg, 'warning', title),
        info:    (msg, title) => addToast(msg, 'info',    title),
    }

    return { toasts, toast, removeToast }
}