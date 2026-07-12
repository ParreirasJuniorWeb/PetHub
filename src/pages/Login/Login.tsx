import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../contexts/useAuth';
import toast from 'react-hot-toast';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);

    const { signIn, resetPassword, signInWithGoogle, signInWithGitHub } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirecionar para a página anterior ou Produtos
    const from = (location.state as { from?: Location })?.from?.pathname || '/products';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            navigate(from, { replace: true });
        } catch (err: unknown) {
            const code = typeof err === 'object' && err !== null && 'code' in err ? String((err as { code: unknown }).code) : '';
            // Tratar erros específicos do Firebase
            if (code === 'auth/invalid-email') {
                setError('Email inválido. Verifique e tente novamente.');
            } else if (code === 'auth/user-not-found') {
                setError('Nenhum usuário encontrado com este email.');
            } else if (code === 'auth/wrong-password') {
                setError('Senha incorreta. Tente novamente.');
            } else if (code === 'auth/invalid-credential') {
                setError('Email ou senha incorretos.');
            } else {
                setError('Ocorreu um erro ao fazer login. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const mapSocialError = (code: string) => {
        if (code === 'auth/account-exists-with-different-credential') {
            return 'Já existe uma conta com este e-mail usando outro provedor de login.';
        }
        if (code === 'auth/popup-closed-by-user') {
            return 'Login cancelado: a janela de autenticação foi fechada.';
        }
        if (code === 'auth/popup-blocked') {
            return 'O navegador bloqueou o popup de login. Permita popups e tente novamente.';
        }
        return 'Não foi possível autenticar com provedor social. Tente novamente.';
    };

    const handleSocialLogin = async (provider: 'google' | 'github') => {
        setError('');
        setSocialLoading(provider);

        try {
            if (provider === 'google') {
                await signInWithGoogle();
            } else {
                await signInWithGitHub();
            }
            navigate(from, { replace: true });
        } catch (err: unknown) {
            const code = typeof err === 'object' && err !== null && 'code' in err ? String((err as { code: unknown }).code) : '';
            setError(mapSocialError(code));
        } finally {
            setSocialLoading(null);
        }
    };

    const handleForgotPassword = async () => {
        setError('');
        setLoading(true);

        try {
            if (email
                && email.match(/[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?/i)) {
                await resetPassword(email);
                toast.success("Um e-mail de restauro de senha foi enviado para o e-mail informado.");
            } else {
                toast.error("Insira um e-mail válido no campo E-mail do formulário.");
                return;
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro desconhecido';
            console.error(`Um erro insperado foi detectado na aplicação. Segue o log do erro: \n${message}.`);
            setError('Ocorreu um erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 max-w-11/12 w-full min-h-screen flex items-center justify-center bg-neutral-light px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <span className="text-4xl">🐾</span>
                        <span className="text-2xl font-heading font-bold text-primary">
                            PetHub
                        </span>
                    </Link>
                </div>

                {/* Card de Login */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-heading font-bold text-neutral-dark text-center mb-2">
                        Bem-vindo de volta! 🐕
                    </h2>
                    <p className="text-gray-500 text-center mb-8">
                        Entre na sua conta para continuar
                    </p>

                    {/* Erro */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 text-center">{error}</p>
                        </div>
                    )}

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            icon={<Mail className="w-5 h-5 text-gray-400" />}
                        />

                        <div className="relative">
                            <Input
                                label="Senha"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                icon={<Lock className="w-5 h-5 text-gray-400" />}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9.5 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {/* Esqueceu a senha */}
                        <div className="flex justify-end">
                            <button
                                type='button'
                                onClick={handleForgotPassword}
                                className="text-sm cursor-pointer text-primary hover:text-primary-dark transition-colors"
                            >
                                Esqueceu a senha?
                            </button>
                        </div>

                        {/* Botão de Login */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Entrando...</span>
                                </span>
                            ) : (
                                'Entrar'
                            )}
                        </Button>
                    </form>

                    {/* Divisor */}
                    <div className="mt-8 flex items-center">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <span className="px-4 text-sm text-gray-400">ou</span>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* Login Social */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleSocialLogin('google')}
                            disabled={loading || socialLoading !== null}
                            className="flex items-center justify-center space-x-2"
                        >
                            {socialLoading === 'google' ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                                </svg>
                            )}
                            <span>Google</span>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleSocialLogin('github')}
                            disabled={loading || socialLoading !== null}
                            className="flex items-center justify-center space-x-2"
                        >
                            {socialLoading === 'github' ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                            )}
                            <span>GitHub</span>
                        </Button>
                    </div>
                </div>

                {/* Rodapé */}
                <p className="mt-8 text-center text-gray-500">
                    Não tem uma conta?{' '}
                    <Link to="/register" className="text-black hover:text-black-dark font-medium transition-colors">
                        Criar conta
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;