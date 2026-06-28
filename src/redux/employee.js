import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_EXT_API || "https://jsonplaceholder.typicode.com/users";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 1. ASYNC FETCH
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async (_, { getState }) => {
    await delay(600); 
    const state = getState();
    if (state.employees.items && state.employees.items.length > 0) {
        return state.employees.items;
    }
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
});

// 2. ASYNC ADD (Mandated by prompt)
export const addEmployeeAsync = createAsyncThunk('employees/addEmployee', async (employeeData) => {
    await delay(600); // Simulate server mutation latency
    return { ...employeeData, id: Date.now() };
});

// 3. ASYNC EDIT (Mandated by prompt)
export const updateEmployeeAsync = createAsyncThunk('employees/updateEmployee', async ({ id, updatedData }) => {
    await delay(600);
    return { id, updatedData };
});

// 4. ASYNC DELETE (Mandated by prompt)
export const deleteEmployeeAsync = createAsyncThunk('employees/deleteEmployee', async (id) => {
    await delay(600);
    return id;
});

const employeeSlice = createSlice({
    name: 'employees',
    initialState: {
        items: [],
        loading: true,
        error: null,
        statusText: 'Syncing',
        searchQuery: '',
        currentPage: 1,
        employeesPerPage: 6
    },
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            state.currentPage = 1; 
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- FETCH CASES ---
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.statusText = 'Loading';
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unable to load workspace data.';
            })

            // --- ADD CASES ---
            .addCase(addEmployeeAsync.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })

            // --- EDIT CASES ---
            .addCase(updateEmployeeAsync.fulfilled, (state, action) => {
                const { id, updatedData } = action.payload;
                const index = state.items.findIndex(emp => emp.id === id);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...updatedData };
                }
            })

            // --- DELETE CASES ---
            .addCase(deleteEmployeeAsync.fulfilled, (state, action) => {
                state.items = state.items.filter(emp => emp.id !== action.payload);
            });
    }
});

export const { setSearchQuery, setCurrentPage } = employeeSlice.actions;

// ==========================================
// MEMOIZED SELECTORS (createSelector)
// ==========================================

const selectItems = (state) => state.employees.items;
const selectSearchQuery = (state) => state.employees.searchQuery;
const selectCurrentPage = (state) => state.employees.currentPage;
const selectPerPage = (state) => state.employees.employeesPerPage;

export const selectFilteredEmployees = createSelector(
    [selectItems, selectSearchQuery],
    (items, query) => {
        const q = query.toLowerCase().trim();
        if (!q) return items;
        return items.filter(user =>
            user.name?.toLowerCase().includes(q) ||
            user.email?.toLowerCase().includes(q) ||
            user.company?.name?.toLowerCase().includes(q)
        );
    }
);

export const selectTotalPages = createSelector(
    [selectFilteredEmployees, selectPerPage],
    (filteredItems, perPage) => Math.ceil(filteredItems.length / perPage)
);

export const selectPaginatedEmployees = createSelector(
    [selectFilteredEmployees, selectCurrentPage, selectPerPage],
    (filteredItems, currentPage, perPage) => {
        const indexOfLast = currentPage * perPage;
        const indexOfFirst = indexOfLast - perPage;
        return filteredItems.slice(indexOfFirst, indexOfLast);
    }
);

export default employeeSlice.reducer;