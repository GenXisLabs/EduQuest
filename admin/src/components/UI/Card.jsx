"use client";

export default function Card({ title, children, className = '' }) {
    return (
        <div className={`bg-white p-6 rounded-xl shadow-lg ${className}`}>
            {title && <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>}
            <div>{children}</div>
        </div>
    );
}