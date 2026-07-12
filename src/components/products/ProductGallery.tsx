import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
    name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showZoom, setShowZoom] = useState(false);

    const handlePrev = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="space-y-4">
            {/* Imagem Principal */}
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
                <img
                    src={images[selectedIndex]}
                    alt={`${name} - Imagem ${selectedIndex + 1}`}
                    className="w-full h-full object-cover"
                />

                {/* Botões de Navegação */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </>
                )}

                {/* Botão Zoom */}
                <button
                    onClick={() => setShowZoom(true)}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                >
                    <ZoomIn className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Miniaturas */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${selectedIndex === index
                                ? 'border-primary'
                                : 'border-transparent hover:border-gray-300'
                                }`}
                        >
                            <img
                                src={image}
                                alt={`${name} - Miniatura ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Modal de Zoom */}
            {showZoom && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                    onClick={() => setShowZoom(false)}
                >
                    <button
                        onClick={() => setShowZoom(false)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600 transform rotate-45" />
                    </button>
                    <img
                        src={images[selectedIndex]}
                        alt={name}
                        className="max-w-[90vw] max-h-[90vh] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}