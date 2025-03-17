import {configureStore} from '@reduxjs/toolkit';
import { infoSlice } from './info';

export const store = configureStore({
    reducer: {
        info: infoSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>