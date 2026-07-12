import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Loader2, Check } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../contexts/useAuth';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);

    const { signUp, signInWithGoogle, signInWithGitHub } = useAuth();
    const navigate = useNavigate();

    // Validações de senha
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    const mapSocialError = (code: string) => {
        if (code === 'auth/account-exists-with-different-credential') {
            return 'Já existe uma conta com este e-mail usando outro provedor.';
        }
        if (code === 'auth/popup-closed-by-user') {
            return 'Login cancelado: você fechou a janela de autenticação.';
        }
        if (code === 'auth/popup-blocked') {
            return 'Popup bloqueado pelo navegador. Libere popups e tente novamente.';
        }
        return 'Não foi possível autenticar com o provedor social. Tente novamente.';
    };

    const handleSocialRegister = async (provider: 'google' | 'github') => {
        setError('');
        setSocialLoading(provider);

        try {
            if (provider === 'google') {
                await signInWithGoogle();
            } else {
                await signInWithGitHub();
            }

            navigate('/products');
        } catch (err: unknown) {
            const code =
                typeof err === 'object' && err !== null && 'code' in err
                    ? String((err as { code: unknown }).code)
                    : '';
            setError(mapSocialError(code));
        } finally {
            setSocialLoading(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validações antes do envio
        if (!isPasswordValid) {
            setError('Por favor, corrija os requisitos de senha.');
            return;
        }

        if (!passwordsMatch) {
            setError('As senhas não conferem.');
            return;
        }

        if (!acceptedTerms) {
            setError('Você deve aceitar os termos de uso.');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, name);
            navigate('/products');
        } catch (err: unknown) {
            const code = typeof err === 'object' && err !== null && 'code' in err ? String((err as { code: unknown }).code) : '';
            if (code === 'auth/email-already-in-use') {
                setError('Este email já está cadastrado.');
            } else if (code === 'auth/invalid-email') {
                setError('Email inválido. Verifique e tente novamente.');
            } else if (code === 'auth/weak-password') {
                setError('Senha muito fraca. Use uma senha mais forte.');
            } else {
                setError('Ocorreu um erro ao criar a conta. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full max-w-11/12 flex items-center justify-center bg-neutral-light px-4 py-12">
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

                {/* Card de Registro */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-heading font-bold text-neutral-dark text-center mb-2">
                        Criar Conta 🐱
                    </h2>
                    <p className="text-gray-500 text-center mb-8">
                        Junte-se à família PetHub
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
                            label="Nome completo"
                            type="text"
                            placeholder="Seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            icon={<User className="w-5 h-5 text-gray-400" />}
                        />

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

                        {/* Requisitos de senha */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                A senha deve conter:
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className={`flex items-center space-x-1 ${hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>
                                    <Check className={`w-4 h-4 ${hasMinLength ? 'opacity-100' : 'opacity-30'}`} />
                                    <span>Mínimo 8 caracteres</span>
                                </div>
                                <div className={`flex items-center space-x-1 ${hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
                                    <Check className={`w-4 h-4 ${hasUpperCase ? 'opacity-100' : 'opacity-30'}`} />
                                    <span>Uma letra maiúscula</span>
                                </div>
                                <div className={`flex items-center space-x-1 ${hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}>
                                    <Check className={`w-4 h-4 ${hasLowerCase ? 'opacity-100' : 'opacity-30'}`} />
                                    <span>Uma letra minúscula</span>
                                </div>
                                <div className={`flex items-center space-x-1 ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                                    <Check className={`w-4 h-4 ${hasNumber ? 'opacity-100' : 'opacity-30'}`} />
                                    <span>Um número</span>
                                </div>
                                <div className={`flex items-center space-x-1 ${hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
                                    <Check className={`w-4 h-4 ${hasSpecialChar ? 'opacity-100' : 'opacity-30'}`} />
                                    <span>Um caractere especial</span>
                                </div>
                            </div>
                        </div>

                        <Input
                            label="Confirmar senha"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            error={confirmPassword.length > 0 && !passwordsMatch ? 'As senhas não conferem' : undefined}
                            icon={<Lock className="w-5 h-5 text-gray-400" />}
                        />

                        {/* Termos de uso */}
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                Eu concordo com os{' '}
                                <Link to="/terms" className="text-primary hover:text-primary-dark font-medium">
                                    Termos de Uso
                                </Link>{' '}
                                e a{' '}
                                <Link to="/privacy" className="text-primary hover:text-primary-dark font-medium">
                                    Política de Privacidade
                                </Link>
                            </label>
                        </div>

                        {/* Botão de Registro */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={loading || !isPasswordValid || !passwordsMatch || !acceptedTerms}
                            className="w-full"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Criando conta...</span>
                                </span>
                            ) : (
                                'Criar conta'
                            )}
                        </Button>
                    </form>

                    {/* Divisor */}
                    <div className="mt-8 flex items-center">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <span className="px-4 text-sm text-gray-400">ou</span>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* Registro Social (opcional) */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center justify-center space-x-2"
                            onClick={() => handleSocialRegister('google')}
                            disabled={loading || socialLoading !== null}
                        >
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
                            <span>
                                {socialLoading === 'google' ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Conectando...</span>
                                    </span>
                                ) : (
                                    'Google'
                                )}
                            </span>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center justify-center space-x-2"
                            onClick={() => handleSocialRegister('github')}
                            disabled={loading || socialLoading !== null}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                            <span>
                                {socialLoading === 'github' ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Conectando...</span>
                                    </span>
                                ) : (
                                    'GitHub'
                                )}
                            </span>
                        </Button>
                    </div>
                </div>

                {/* Rodapé */}
                <p className="mt-8 text-center text-gray-500">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="text-primary hover:text-primary-dark font-medium transition-colors">
                        Fazer login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;