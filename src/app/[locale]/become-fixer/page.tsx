'use client';

import { useState } from 'react';
import FixerRegisterForm from '@/componentsLumonis/fixer/Fixer-register-form';
import { FixerEnableWizard } from '@/componentsLumonis/fixer/Filter-eneable-wizard';
import { useAppSelector } from '@/app/redux/hooks';
import { IUser } from '@/types/user';

export default function BecomeFixerPage() {
    const { user: reduxUser } = useAppSelector((state) => state.user);
    const [requester, setRequester] = useState<IUser | null>(null);

    // If user is already logged in, we can potentially skip the first step or pre-fill it.
    // For now, we'll pre-fill it and let them confirm/add phone.

    const defaultValues = {
        name: reduxUser?.name || '',
        email: reduxUser?.email || '',
        phone: '', // Phone might not be in redux user yet
    };

    return (
        <div>
            <div className="container mx-auto max-w-4xl p-4">
                <header className="mb-6 text-center">
                    <h1 className="text-2xl font-bold">Conviertete en un Fixer</h1>
                    <p className="text-sm text-gray-500">
                        Completa tu registro y habilita tu cuenta como FIXER
                    </p>
                </header>

                <section className="space-y-6">
                    {!requester ? (
                        <div className="neon-border glass-panel rounded-2xl border border-gray-200 p-4 shadow-sm animate-slide-up">
                            <h2 className="mb-3 text-center text-lg font-semibold">Datos iniciales</h2>
                            <FixerRegisterForm
                                defaultValues={defaultValues}
                                onSubmit={(data) => {
                                    const { name, email, phone } = data;
                                    // Use redux ID if available, else mock or generate
                                    const _id = reduxUser?._id || 'req-guest';
                                    const url_photo = 'https://picsum.photos/80'; // Placeholder or from redux if available

                                    // Construct a partial IUser object for the wizard
                                    const user: IUser = {
                                        _id,
                                        name,
                                        email,
                                        telefono: phone,
                                        url_photo,
                                        role: 'requester',
                                        // Initialize other fields as undefined or empty if needed by the type
                                    };

                                    setRequester(user);
                                }}
                                submitButtonText="Continuar"
                            />
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <FixerEnableWizard user={requester} />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
