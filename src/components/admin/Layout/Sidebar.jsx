"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

// Example Icons (replace with your preferred icon library or SVGs)
const HomeIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const DotIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>;
const ProfileIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
const LogoutIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;


const NavItem = ({ href, icon, children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href}>
            <span // Changed from <a> to <span> because Link provides the <a>
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md group
                    ${isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
            >
                {icon && <span className="mr-3">{icon}</span>}
                {children}
            </span>
        </Link>
    );
};

export default function Sidebar({ isOpen, toggleSidebar }) {
    const router = useRouter();

    const handleLogout = async () => {
        const response = await fetch('/api/admin/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        router.push('/admin/login');
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col`}
            >
                <div className="flex items-center justify-center h-20 border-b border-gray-700">
                    <span className="text-2xl font-semibold text-white">Admin</span>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    <NavItem  href="/admin/dashboard" icon={<HomeIcon />}>
                        Dashboard
                    </NavItem>
                    <NavItem href="/admin/dashboard/students" icon={<DotIcon />}>
                        Students
                    </NavItem>
                    <NavItem href="/admin/dashboard/papers" icon={<DotIcon />}>
                        Papers
                    </NavItem>
                    <NavItem href="/admin/dashboard/universities" icon={<DotIcon />}>
                        Universities
                    </NavItem>
                    <NavItem href="/admin/dashboard/batches" icon={<DotIcon />}>
                        Batchs
                    </NavItem>
                    <NavItem href="/admin/dashboard/profile" icon={<ProfileIcon />}>
                        Profile
                    </NavItem>
                    {/* Add more NavItems here */}
                </nav>
                <div className="px-2 py-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group"
                    >
                        <LogoutIcon />
                        <span className="ml-3">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}