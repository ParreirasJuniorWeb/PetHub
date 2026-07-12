import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { SocialIcon } from 'react-social-icons';

const Footer = () => {
    return (
        <footer className="bg-neutral-dark text-black flex-1 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🐾</span>
                            <span className="text-black text-xl font-heading font-bold text-primary-light">
                                PetHub
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Sua loja de confiança para produtos de qualidade para seu melhor amigo.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-heading font-semibold">Links Rápidos</h3>
                        <ul className="space-y-2">
                            <li><Link to="/products" className="text-gray-400 hover:text-primary transition-colors">Produtos</Link></li>
                            <li><Link to="/services" className="text-gray-400 hover:text-primary transition-colors">Serviços</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors">Sobre Nós</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contato</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <h3 className="font-heading font-semibold">Categorias</h3>
                        <ul className="space-y-2">
                            <li><Link to="/products?category=food" className="text-gray-400 hover:text-primary transition-colors">Ração</Link></li>
                            <li><Link to="/products?category=toys" className="text-gray-400 hover:text-primary transition-colors">Brinquedos</Link></li>
                            <li><Link to="/products?category=accessories" className="text-gray-400 hover:text-primary transition-colors">Acessórios</Link></li>
                            <li><Link to="/products?category=health" className="text-gray-400 hover:text-primary transition-colors">Saúde</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="font-heading font-semibold">Contato</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-2 text-gray-400">
                                <MapPin size={18} />
                                <span>Rua Example, 123</span>
                            </li>
                            <li className="flex items-center space-x-2 text-gray-400">
                                <Phone size={18} />
                                <span>(11) 99999-9999</span>
                            </li>
                            <li className="flex items-center space-x-2 text-gray-400">
                                <Mail size={18} />
                                <span>contato@pethub.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social Media */}
                <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">© 2024 PetHub. Todos os direitos reservados.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                            <SocialIcon url="https://facebook.com" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                            <SocialIcon url="https://instagram.com" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                            <SocialIcon url="https://twitter.com" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                            <SocialIcon url="https://linkedin.com" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;