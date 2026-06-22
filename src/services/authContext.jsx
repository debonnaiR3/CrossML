import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       
        const storedUser = localStorage.getItem('cml_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        
        const existingDb = localStorage.getItem('cml_accounts');
        if (!existingDb) {
            const demoUser = [{ name: "Reviewer Demo", email: "demo@crossml.com", password: "password123" }];
            localStorage.setItem('cml_accounts', JSON.stringify(demoUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('cml_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('cml_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            
            {!loading && children}
        </AuthContext.Provider>
    );
};