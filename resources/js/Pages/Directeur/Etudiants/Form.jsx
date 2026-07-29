import { useForm, Link } from '@inertiajs/react'
import SiriusLayout from '@/Layouts/SiriusLayout'
import Button from '@/Components/UI/Button'
import Input from '@/Components/UI/Input'

const IconArrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>

function Section({ title, children, optional = false }) {
    return (
        <div className="form-section">
            <div className="form-section-title">
                <div className="w-1 h-5 bg-sirius-gold rounded-full" />
                <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                {optional && <span className="text-xs text-gray-400">(optionnel)</span>}
            </div>
            <div className="form-grid">
                {children}
            </div>
        </div>
    )
}

export default function Form({ etudiant = null, groupes = [], mode = 'create' }) {
    const isEdit = mode === 'edit'

    const { data, setData, post, put, processing, errors } = useForm({
        nom:        etudiant?.nom        ?? '',
        prenom:     etudiant?.prenom     ?? '',
        email:      etudiant?.email      ?? '',
        telephone:  etudiant?.telephone  ?? '',
        cin:        etudiant?.cin        ?? '',
        adresse:    etudiant?.adresse    ?? '',
        ville:      etudiant?.ville      ?? '',
        nomParent:  etudiant?.nomParent  ?? '',
        dateNaissance: etudiant?.dateNaissance ?? '',
        telParent:  etudiant?.telParent  ?? '',
        idGroupe:   '',
    })

    const submit = (e) => {
        e.preventDefault()
        isEdit
            ? put(`/directeur/etudiants/${etudiant.id}`)
            : post('/directeur/etudiants')
    }

    const set = (name) => (e) => setData(name, e.target.value)

    return (
        <SiriusLayout title={isEdit ? 'Modifier étudiant' : 'Ajouter un étudiant'}>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/directeur/etudiants">
                    <Button variant="outline" size="icon">
                        <IconArrow />
                </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? "Modifier l'étudiant" : 'Ajouter un étudiant'}
                    </h1>
                    <p className="page-subtitle mt-0.5">
                        {isEdit ? 'Modifiez les informations ci-dessous' : "Remplissez les informations de l'étudiant"}
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="max-w-3xl">

                {/* Infos personnelles */}
                <Section title="Informations personnelles">
                    <Input
                        label="Nom" value={data.nom}
                        onChange={set('nom')} error={errors.nom}
                        placeholder="BENALI" required
                    />
                    <Input
                        label="Prénom" value={data.prenom}
                        onChange={set('prenom')} error={errors.prenom}
                        placeholder="Mohammed" required
                    />
                    <Input
                        label="Date de naissance"
                        type="date"
                        value={data.dateNaissance ?? ''}
                        onChange={set('dateNaissance')}
                        error={errors.dateNaissance}
                    />
                    <Input
                        label="Email" type="email" value={data.email}
                        onChange={set('email')} error={errors.email}
                        placeholder="mohammed@email.com" required
                    />
                    <Input
                        label="Téléphone" value={data.telephone}
                        onChange={set('telephone')} error={errors.telephone}
                        placeholder="0612345678"
                    />
                    <Input
                        label="CIN" value={data.cin}
                        onChange={set('cin')} error={errors.cin}
                        placeholder="AB123456"
                    />
                    <Input
                        label="Ville" value={data.ville}
                        onChange={set('ville')} error={errors.ville}
                        placeholder="Fès"
                    />
                    <div className="col-span-1 md:col-span-2">
                        <Input
                            label="Adresse" value={data.adresse}
                            onChange={set('adresse')} error={errors.adresse}
                            placeholder="Rue Ibn Battouta, Quartier Zitoun"
                        />
                    </div>
                </Section>

                {/* Infos parent */}
                <Section title="Informations parent / tuteur">
                    <Input
                        label="Nom du parent" value={data.nomParent}
                        onChange={set('nomParent')} error={errors.nomParent}
                        placeholder="Nom complet du parent"
                    />
                    <Input
                        label="Téléphone parent" value={data.telParent}
                        onChange={set('telParent')} error={errors.telParent}
                        placeholder="0612345678"
                    />
                </Section>

                {/* Groupe — création uniquement */}
                {!isEdit && groupes.length > 0 && (
                    <div className="form-section">
                        <div className="form-section-title">
                            <div className="w-1 h-5 bg-sirius-gold rounded-full" />
                            <h2 className="text-base font-semibold text-gray-900">Inscription à un groupe</h2>
                            <span className="text-xs text-gray-400">(optionnel)</span>
                        </div>
                        <select
                            value={data.idGroupe}
                            onChange={e => setData('idGroupe', e.target.value)}
                            className="select"
                        >
                            <option value="">Aucun groupe pour l'instant</option>
                            {groupes.map(g => (
                                <option key={g.id} value={g.id}>
                                    {g.nom} — {g.langue} {g.niveau}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-2">
                            Mot de passe par défaut : <strong>sirius123</strong>
                        </p>
                    </div>
                )}

                {/* Boutons */}
                <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" variant="gold" loading={processing}>
                        {isEdit ? 'Enregistrer les modifications' : "Ajouter l'étudiant"}
                    </Button>
                    <Link href="/directeur/etudiants">
                        <Button type="button" variant="outline">Annuler</Button>
                    </Link>
                </div>

            </form>
        </SiriusLayout>
    )
}