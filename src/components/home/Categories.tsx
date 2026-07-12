import { Link } from 'react-router-dom';
import { Dog, Cat, Bird, Fish, Rabbit, Heart } from 'lucide-react';

const categories = [
    {
        id: 'dogs',
        name: 'Cachorros',
        slug: 'dogs',
        icon: Dog,
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
        color: 'bg-orange-500',
    },
    {
        id: 'cats',
        name: 'Gatos',
        slug: 'cats',
        icon: Cat,
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
        color: 'bg-purple-500',
    },
    {
        id: 'birds',
        name: 'Pássaros',
        slug: 'birds',
        icon: Bird,
        image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop',
        color: 'bg-yellow-500',
    },
    {
        id: 'fish',
        name: 'Peixes',
        slug: 'fish',
        icon: Fish,
        image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76ebe?w=400&h=400&fit=crop',
        color: 'bg-blue-500',
    },
    {
        id: 'rabbits',
        name: 'Coelhos',
        slug: 'rabbits',
        icon: Rabbit,
        image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop',
        color: 'bg-pink-500',
    },
    {
        id: 'health',
        name: 'Saúde',
        slug: 'health',
        icon: Heart,
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop',
        color: 'bg-red-500',
    },
];

export function Categories() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-dark mb-4">
                        Para todos os pets
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Escolha a categoria do seu amigo e encontre os melhores produtos
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.id}
                                to={`/products?category=${category.slug}`}
                                className="group"
                            >
                                <div className="relative overflow-hidden rounded-2xl aspect-square mb-4">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <div className={`inline-flex p-2 rounded-lg ${category.color} text-white mb-2`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-heading font-semibold text-white">
                                            {category.name}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}