import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchTokensByUserId, postNftMetadata} from "./ActionCreators";
import {INftMetadata} from "../../types/INftMetadata";
import {ethers} from 'ethers'
declare var window: any

interface nftSlice {
    nftMetadata: INftMetadata;
    nftsMetadata: INftMetadata[];
    isLoading: boolean;
    error: string;
}

const initialState: nftSlice = {
    nftMetadata: {} as INftMetadata,
    nftsMetadata: [] as INftMetadata[],
    isLoading: false,
    error: ''
}
const nftSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},

    extraReducers: {
        [fetchTokensByUserId.fulfilled.type]: (state, action: PayloadAction<INftMetadata[]>) => {
            state.nftsMetadata = action.payload
            state.error = '';
            state.isLoading = false;
        },
        [fetchTokensByUserId.pending.type]: (state) => {
            state.isLoading = true;
        },
        [fetchTokensByUserId.rejected.type]: (state, action: PayloadAction<string>) => {
            state.error = action.payload
            state.isLoading = false;
        },
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
