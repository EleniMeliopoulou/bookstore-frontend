import { ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

//The auth and likedBooks state is saved in the localStorage. The user remains logged in even when we refresh tha page.
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return (state, action) => {
        //Browser -> localStorage
        if (typeof window !== 'undefined') {
            return localStorageSync({
                keys: ['auth', 'likedBooks'],
                rehydrate: true //rehydrates the state from localStorage
            })(reducer)(state, action);
        }

        //SSR (server) -> without localStorage
        return reducer(state, action);
    };
}

export const metaReducers: MetaReducer[] = [localStorageSyncReducer];