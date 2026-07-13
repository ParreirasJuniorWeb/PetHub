import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { useCart } from "../../contexts/useCart";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();
    const { cartAmount } = useCart();

    return (
        <header className="bg-white flex-1 shadow-sm sticky top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl">🐾</span>
                        <span className="text-xl font-heading font-bold text-primary">
                            PetHub
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-neutral-dark hover:text-primary transition-colors">
                            Início
                        </Link>
                        <Link to="/products" className="text-neutral-dark hover:text-primary transition-colors">
                            Produtos
                        </Link>
                        <Link to="/orders" className="text-neutral-dark hover:text-primary transition-colors">
                            Pedidos
                        </Link>
                        <Link to="/favorites" className="text-neutral-dark hover:text-primary transition-colors">
                            Favoritos
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="p-2 text-neutral-dark hover:text-primary transition-colors relative">
                            <ShoppingCart size={24} />
                            {user && cartAmount > 0
                                && (
                                    <span className="absolute -top-1 -right-1 bg-blue-950 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                        {cartAmount}
                                    </span>
                                )}
                        </Link>
                        {!user ? (
                            <Link
                                to="/login"
                                className="p-2 text-neutral-dark hover:text-primary transition-colors flex flex-col items-center justify-center">
                                <User size={24} />
                                <small className='text-[12px]'>Login</small>
                            </Link>
                        ) : (
                            <Link
                                to="/profile"
                                className="p-2 cursor-pointer text-neutral-dark hover:text-primary transition-colors flex flex-col items-center justify-center">
                                <User size={24} />
                            </Link>
                        )}
                        <button
                            className="md:hidden p-2 text-neutral-dark"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-4 py-4 space-y-3">
                        <Link to="/" className="block text-neutral-dark hover:text-primary">
                            Início
                        </Link>
                        <Link to="/products" className="block text-neutral-dark hover:text-primary">
                            Produtos
                        </Link>
                        <Link to="/orders" className="block text-neutral-dark hover:text-primary">
                            Pedidos
                        </Link>
                        <Link to="/favorites" className="block text-neutral-dark hover:text-primary">
                            Favoritos
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;