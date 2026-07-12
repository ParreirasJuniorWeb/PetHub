import { Check } from 'lucide-react';

interface ProductSpecsProps {
    specs: Record<string, string>;
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
    const specEntries = Object.entries(specs);

    if (specEntries.length === 0) return null;

    return (
        <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-heading font-semibold text-neutral-dark mb-4">
                Especificações Técnicas
            </h3>
            <div className="space-y-3">
                {specEntries.map(([key, value]) => (
                    <div key={key} className="flex items-start justify-between">
                        <Check />
                        <span className="text-gray-600">{key}</span>
                        <span className="text-neutral-dark font-medium text-right">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}