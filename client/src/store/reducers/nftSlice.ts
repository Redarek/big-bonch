import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {postNftMetadata} from "./ActionCreators";
import {INftMetadata} from "../../types/INftMetadata";

interface nftSlice {
    nftMetadata: INftMetadata
    isLoading: boolean;
    error: string;
}

const initialState: nftSlice = {
    nftMetadata: {} as INftMetadata,
    isLoading: false,
    error: ''
}
const nftSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},

    extraReducers: {

        [postNftMetadata.fulfilled.type]: (state, action: PayloadAction<number>) => {
            state.error = '';
            state.isLoading = false;
        },
        [postNftMetadata.pending.type]: (state) => {
            state.isLoading = true;
        },
        [postNftMetadata.rejected.type]: (state, action: PayloadAction<string>) => {
            state.error = action.payload
            state.isLoading = false;
        }
    }
})
export const {} = nftSlice.actions;
export default nftSlice.reducer;
