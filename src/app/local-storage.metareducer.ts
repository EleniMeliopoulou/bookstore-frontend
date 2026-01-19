import { ActionReducer, MetaReducer } from '@ngrx/store'; 
import { localStorageSync } from 'ngrx-store-localstorage'; 

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> { 
    return (state, action) => { // ΜΟΝΟ στον browser υπάρχει localStorage 

        if (typeof window !== 'undefined') { 
            return localStorageSync({ 
                keys: ['auth'], 
                rehydrate: true 
            })(reducer)(state, action); 
        } 
        
        // Σε SSR / Vite server → απλά τρέξε τον reducer χωρίς localStorage 
        return reducer(state, action); }; 
} 

export const metaReducers: MetaReducer[] = [localStorageSyncReducer];