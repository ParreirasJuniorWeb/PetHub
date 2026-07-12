import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
    return (
        <div className={`
      bg-white rounded-xl shadow-sm border border-gray-100
      ${hover ? 'hover:shadow-lg hover:border-primary/20 transition-all duration-300' : ''}
      ${className}
    `}>
            {children}
        </div>
    );
};