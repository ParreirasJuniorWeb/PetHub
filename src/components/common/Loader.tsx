import { Loader2 } from 'lucide-react';

const Loading = () => {
    return (
        <section className="py-16 bg-neutral-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </div>
        </section>
    );
};

export default Loading;