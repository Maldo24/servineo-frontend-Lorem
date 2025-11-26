import { FixerProfile } from "@/componentsLumonis/Fixer-profile";
import type { Fixer } from "@/app/lib/mock-data";

const mockFixer: Fixer = {
    id: "68e87a9cdae3b73d8040102f",
    name: "Carlos Méndez",
    email: "carlos.mendez@ejemplo.com",
    phone: "+591 71234567",
    photo: "",
    city: "Cochabamba",
    rating: 4.7,
    completedJobs: 128,
    services: ["Fontanería", "Electricidad", "Pintura", "Albañilería"],
    bio: "Soy un técnico profesional con más de 8 años de experiencia en reparaciones del hogar. Me especializo en soluciones rápidas y efectivas, con un enfoque en la satisfacción del cliente.",
    joinDate: new Date("2018-05-15"),
    jobOffers: [
        {
            id: "offer-1",
            title: "Reparación de tubería",
            description: "Necesito reparar una fuga en la tubería principal del baño",
            services: ["Fontanería"],
            price: 350,
            createdAt: new Date("2025-10-28"),
            city: "Cochabamba",
            rating: 4.8,
            completedJobs: 5,
            location: {
                lat: -17.3895,
                lng: -66.1568,
                address: "Av. América #123, Cochabamba"
            },
            fixerId: "68e87a9cdae3b73d8040102f",
            fixerName: "Carlos Méndez",
            tags: ["Urgente", "Casa", "Baño"],
            whatsapp: "59171234567",
            photos: ["/placeholder-job.jpg"],

        }
    ],
    paymentMethods: ["Efectivo", "Transferencia", "QR"],
    whatsapp: "59171234567"
}

export default function FixerProfilePage() {
    return <FixerProfile fixer={mockFixer} isOwner={true} />
}
