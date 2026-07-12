// Page404.tsx
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

const Page404 = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
            <div className="text-center max-w-md">

                {/* Número 404 grande */}
                <h1 className="text-[120px] font-bold text-gray-200 dark:text-gray-700 leading-none select-none">
                    404
                </h1>

                {/* Título */}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
                    Página Não Encontrada
                </h2>

                {/* Descrição */}
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Desculpe, a página que você está procurando não existe ou foi movida.
                </p>

                {/* Ilustração opcional (SVG) */}
                <div className="mb-8 flex justify-center">
                    <Search className="w-32 h-32 text-gray-300 dark:text-gray-700" />
                </div>

                {/* Botões de ação */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        <Home size={20} />
                        Voltar ao Início
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Página Anterior
                    </button>
                </div>

                {/* Link para suporte */}
                <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
                    Precisa de ajuda?{" "}
                    <Link to="/contato" className="text-blue-600 hover:underline">
                        Fale conosco
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Page404;