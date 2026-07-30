import { router } from '@inertiajs/react'
import { useRef } from 'react'
import { CertificateView } from '@/Components/Certificate/CertificateView'

const IconPrint  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
const IconArrow  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>

export default function Preview({ certificateData }) {
    const printRef = useRef(null)

    const handlePrint = () => {
        window.print()
    }

    return (
        <>
            {/* Barre d'actions — cachée à l'impression */}
            <div className="no-print fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
                <button
                    onClick={() => router.get('/directeur/attestations')}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <IconArrow /> Retour
                </button>

                <div className="text-sm font-medium text-gray-700">
                    Attestation — {certificateData.student.fullName}
                </div>

                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-sirius-gold text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                    <IconPrint /> Imprimer / Télécharger PDF
                </button>
            </div>

            {/* CSS Print */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { margin: 0; padding: 0; background: white; }
                    @page { size: A4 portrait; margin: 0; }
                }
                body {
                    background: #e5e7eb;
                    padding-top: 64px;
                }
                @media print {
                    body { padding-top: 0; background: white; }
                }
            `}</style>

            {/* Attestation */}
            <CertificateView
                certificate={certificateData}
                printRef={printRef}
                isInlineEditing={false}
            />
        </>
    )
}