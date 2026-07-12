import { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';

export function Newsletter() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Digite seu email');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Email inválido');
            return;
        }

        setLoading(true);

        // Simular subscription (substituir por chamada real ao Firebase)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubscribed(true);
        } catch (err) {
            console.error(err);
            setError('Erro ao se cadastrar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-16 bg-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-linear-to-br from-primary to-primary-dark rounded-3xl p-8 sm:p-12">
                    <div className="max-w-2xl mx-auto text-center">
                        {/* Icon */}
                        <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-6">
                            <Send className="w-8 h-8 text-white" />
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
                            Receba nossas ofertas
                        </h2>
                        <p className="text-primary-light mb-8">
                            Cadastre-se e receba exclusive discounts and news directly in your email.
                        </p>

                        {/* Form */}
                        {!subscribed ? (
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <div className="flex-1">
                                    <input
                                        type="email"
                                        placeholder="Seu melhor email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-white text-neutral-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    />
                                    {error && (
                                        <p className="text-red-300 text-sm mt-2 text-left">{error}</p>
                                    )}
                                </div>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    disabled={loading}
                                    onClick={handleSubmit}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Cadastrar'
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="flex items-center justify-center space-x-2 text-white bg-white/20 rounded-lg p-4">
                                <CheckCircle className="w-6 h-6 text-green-400" />
                                <span className="font-medium">Email cadastrado com sucesso!</span>
                            </div>
                        )}

                        {/* Privacy Note */}
                        <p className="text-primary-light/70 text-sm mt-4">
                            respeitamos sua privacidade. Cancele a qualquer momento.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}