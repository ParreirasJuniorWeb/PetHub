import { useRouteError, Link } from "react-router-dom";

// Tipos para as propriedades do componente
export interface ErrorFallbackProps {
    error: Error | unknown;
    resetErrorBoundary: () => void;
    customMessage?: string | null | undefined
}

// Helper para verificar se é um erro de rota (Navigation Error)
function isRouteError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;

    const routeError = error as {
        status?: unknown;
        statusText?: unknown;
        data?: unknown;
    };

    return (
        routeError.status != null ||
        routeError.statusText != null ||
        routeError.data != null
    );
}

function ErrorFallback({ error, resetErrorBoundary, customMessage = "" }: ErrorFallbackProps) {
    // 1. Captura o erro da rota (React Router)
    const routeError = useRouteError();

    // 2. Determina qual erro exibir (Preferência para o erro da Rota)
    let errorMessage: string = "An unexpected error occurred.";
    let errorStatus: number | undefined = undefined;

    // Verifica se há um erro de rota (404, 500, etc)
    if (isRouteError(routeError)) {
        const routeErr = routeError as { status?: number; statusText?: string; data?: string | Error };
        errorStatus = routeErr.status;

        // Tenta extrair a mensagem do erro da rota ou usa o texto padrão do status
        if (typeof routeErr.data === 'string') {
            errorMessage = routeErr.data;
        } else if (routeErr instanceof Error) {
            errorMessage = routeErr.message;
        } else {
            errorMessage = routeErr.statusText || "Unknown Route Error";
        }
    } else if (error instanceof Error) {
        // Erro genéricoThrown pelo componente
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    // Log apenas para desenvolvimento
    console.error("Captured Error (Boundary):", error);
    console.error("Captured Error (Route):", routeError);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 text-center">

                {/* Container do Erro */}
                <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

                    {/* Ícone de Alerta (SVG) */}
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                        <svg
                            className="h-10 w-10 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    {/* Título e Status */}
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {errorStatus ? `Error ${errorStatus}` : "Oops!"}
                    </h2>
                    <p className="mt-2 text-lg text-gray-600">
                        {errorStatus === 404
                            ? "We can't find that page."
                            : "Something went wrong."}
                    </p>

                    {/* Detalhes do Erro (Área Técnica) */}
                    <div className="mt-6 rounded-md bg-red-50 p-4 text-left border border-red-100">
                        <div className="flex">
                            <div className="shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Technical Details</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    {/* Transbordando o texto em um bloco seguro */}
                                    <p className="whitespace-pre-wrap font-mono bg-white/50 p-2 rounded">
                                        {errorMessage || customMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ações */}
                    <div className="mt-8 flex gap-x-4 justify-center">
                        <button
                            onClick={resetErrorBoundary}
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                        >
                            Try Again
                        </button>

                        <Link
                            to="/"
                            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Go Home
                        </Link>
                    </div>

                </div>

                <p className="text-center text-xs text-gray-500">
                    If this problem persists, please contact support.
                </p>
            </div>
        </div>
    );
}

export default ErrorFallback;