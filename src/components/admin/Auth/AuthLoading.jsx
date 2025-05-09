"use client";

import { useState, useEffect, useContext, createContext } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '../UI/Spinner';

const AdminContext = createContext(null);

function AuthLoading({ children, isLoginPage = false }) {
    const [loading, setLoading] = useState(true);
    const [adminData, setAdminData] = useState(null);
    const router = useRouter();

    const whenAuthenticated = () => {
        if (isLoginPage) {
            router.push('/admin/dashboard');
        } else {
            setLoading(false);
        }
    };

    const whenNotAuthenticated = () => {
        if (isLoginPage) {
            setLoading(false);
        } else {
            router.push('/admin/login');
        }
    }

    useEffect(() => {
        fetchAdminData().then((result) => {
            if (!result) {
                whenNotAuthenticated();
            } else {
                setAdminData(result.admin);
                whenAuthenticated();
            }
        }).catch(() => {
            whenNotAuthenticated();
        });
    }, []);

    if (!loading) {
        return (
            <AdminContext.Provider value={adminData}>
                {children}
            </AdminContext.Provider>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Spinner />
        </div>
    );
}

function useAdmin() {
    return useContext(AdminContext);
}

const fetchAdminData = async () => {
    try {
        const response = await fetch('/api/admin/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            return null;
        }

        const admin = await response.json();
        return admin;
    } catch (error) {
        console.error('Error fetching admin data:', error);
        return null;
    }
};


export { AuthLoading, useAdmin, fetchAdminData };