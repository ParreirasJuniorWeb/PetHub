import { Truck, ShieldCheck, HeadphonesIcon, Gift } from 'lucide-react';

const services = [
    {
        icon: Truck,
        title: 'Entrega Rápida',
        description: 'Entregamos em todo o Brasil com speed e segurança',
        color: 'bg-blue-500',
    },
    {
        icon: ShieldCheck,
        title: 'Compra Segura',
        description: 'Seus dados protegidos com criptografia SSL',
        color: 'bg-green-500',
    },
    {
        icon: HeadphonesIcon,
        title: 'Suporte 24/7',
        description: 'Estamos sempre prontos para ajudar você',
        color: 'bg-purple-500',
    },
    {
        icon: Gift,
        title: 'Promoções Exclusivas',
        description: 'Descontos especiais para clientes frequentes',
        color: 'bg-orange-500',
    },
];

export function Services() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={index}
                                className="text-center p-6 rounded-2xl bg-neutral-light hover:bg-primary/5 transition-colors group"
                            >
                                <div className={`inline-flex p-4 rounded-2xl ${service.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-heading font-semibold text-neutral-dark mb-2">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {service.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}