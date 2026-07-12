import { Link } from 'react-router-dom';
import { ArrowRight, PawPrint } from 'lucide-react';
import { Button } from '../common/Button';

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-white/10 via-primary-light/20 to-accent/10 py-16 sm:py-24 lg:py-32">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 text-primary/20">
                    <PawPrint className="w-32 h-32 rotate-12" />
                </div>
                <div className="absolute bottom-10 right-10 text-secondary/20">
                    <PawPrint className="w-40 h-40 -rotate-12" />
                </div>
                <div className="absolute top-1/2 left-1/2 text-accent/20">
                    <PawPrint className="w-24 h-24 rotate-45" />
                </div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md mb-6">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-sm font-medium text-gray-600">
                            Entrega gratuite para pedidos acima de R$ 199
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-neutral-dark mb-6">
                        Tudo que seu{' '}
                        <span className="text-slate-400 text-3xl">pet precisa</span>
                        <br />
                        em um só lugar
                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-8">
                        Encontre ração, brinquedos, acessórios e muito mais para seu melhor amigo.
                        Qualidade comprovada e entrega rápida para todo o Brasil.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/products">
                            <Button size="lg" className="group cursor-pointer">
                                Comprar agora
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/products?category=services">
                            <Button variant="outline" size="lg" className='cursor-pointer'>
                                Ver serviços
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
                        {[
                            { value: '+5.000', label: 'Produtos' },
                            { value: '+10.000', label: 'Clientes' },
                            { value: '4.9', label: 'Avaliação' },
                            { value: '24h', label: 'Entrega' },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl sm:text-4xl font-heading font-bold text-primary">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section >
    );
}