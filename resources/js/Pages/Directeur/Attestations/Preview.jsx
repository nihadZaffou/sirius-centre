import { router } from '@inertiajs/react'
import { useRef } from 'react'
import { CertificateView } from '@/Components/Certificate/CertificateView'

const IconPrint = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
const IconArrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
const IconImage = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>

export default function Preview({ certificateData }) {
    const printRef = useRef(null)

    // Adapter les données Laravel vers le format du dev
const certData = {
    salutation:       certificateData?.student?.salutation       ?? 'Frau/Herr',
    fullName:         certificateData?.student?.fullName         ?? '',
    birthDate:        certificateData?.student?.birthDate        ?? '',
    birthPlace:       certificateData?.student?.birthPlace       ?? '',
    academicPeriod:   certificateData?.course?.academicPeriod    ?? '',
    level:            certificateData?.course?.level             ?? '',
    courseTitle:      certificateData?.course?.courseTitle       ?? '',
    texteComplet:     certificateData?.course?.texteComplet      ?? '',
    bemerkungen:      certificateData?.course?.bemerkungen       ?? '',
    certificateTitle: certificateData?.meta?.certificateTitle    ?? 'TEILNAHMEBESTÄTIGUNG',
    headerText:       'Hiermit wird bescheinigt, dass',
    directorTitle:    certificateData?.meta?.directorTitle       ?? '',
    issueDate:        certificateData?.meta?.issueDate           ?? '',
    centerType:       certificateData?.center?.centerType        ?? 'Centre Sirius (PRIVE)',
    address:          certificateData?.center?.address           ?? 'Bd Mohammed 6 RUE 20 Baalabak Oujda',
    ice:              certificateData?.center?.ice               ?? '(002646655000021)',
    gsm:              certificateData?.center?.gsm               ?? '0629965237',
    email:            certificateData?.center?.email             ?? 'siriuscentre1@gmail.com',
}
    return (
        <>
            {/* Barre d'actions — cachée à l'impression */}
            <div className="no-print fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
                <button
                    onClick={() => router.get('/directeur/attestations')}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                    <IconArrow /> Retour
                </button>

                <div className="text-sm font-medium text-gray-700">
                    {certData.fullName}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-sirius-gold text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90"
                    >
                        <IconPrint /> Imprimer / PDF A4
                    </button>
                </div>
            </div>

            {/* Espace pour la barre fixe */}
            <div className="no-print h-16" />

            {/* Attestation */}
            <CertificateView
                certificate={certData}
                printRef={printRef}
                isInlineEditing={false}
            />
        </>
    )
}