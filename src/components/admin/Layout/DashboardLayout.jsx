"use client";

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import HamburgerIcon from '../UI/HamburgerIcon';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname(); // Triggers on route change

    // Close sidebar on route change (for mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]); // When pathname changes, run this

    // Simulate auth check - in a real app, use context or a proper auth library
    useEffect(() => {
        // This is a very basic check. In a real app, you'd verify a token.
        // For now, let's assume if they're not on /login, they "should" be logged in.
        // A better approach is to redirect from a protected route hoc or _app.js
        // if no valid session exists. For this example, we'll keep it simple.
        // if (router.pathname.startsWith('/dashboard') && !localStorage.getItem('isLoggedIn')) {
        //   router.push('/login');
        // }
    }, [router]);


    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar for mobile (Hamburger) / Main content header */}
                <header className="bg-white shadow-sm lg:hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <span className="text-xl font-semibold text-gray-700">Dashboard</span>
                        <HamburgerIcon onClick={toggleSidebar} className="lg:hidden" />
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}