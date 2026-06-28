import { createSlice } from '@reduxjs/toolkit';

// Seed demo accounts into the DB ledger on first spin-up if missing
const seedAccountsLedger = () => {
    const existingDb = localStorage.getItem('cml_accounts');
    if (!existingDb) {
        const demoUsers = [
            { name: "Ashpreet (Admin)", email: "admin@crossml.com", password: "password123", role: "admin" },
            { name: "Guest (Viewer)", email: "viewer@crossml.com", password: "password123", role: "viewer" }
        ];
        localStorage.setItem('cml_accounts', JSON.stringify(demoUsers));
    }
};

seedAccountsLedger();

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null, // Caching handled automatically by redux-persist!
        loading: false
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
        register: (state, action) => {
            // Keep user registry ledger updated so Login can validate credentials
            const existingAccounts = JSON.parse(localStorage.getItem('cml_accounts')) || [];
            existingAccounts.push(action.payload);
            localStorage.setItem('cml_accounts', JSON.stringify(existingAccounts));
        }
    }
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;