import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
    persistStore, 
    persistReducer,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER 
} from 'redux-persist';
import storageModule from 'redux-persist/lib/storage'; // <-- 1. Imported as safe module object
import authReducer from './auth';
import employeeReducer from './employee';

// <-- 2. Safely unwrap Vite's ES-Module wrapper automatically
const storage = storageModule.default || storageModule;

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'employees']
};

const rootReducer = combineReducers({
    auth: authReducer,
    employees: employeeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);