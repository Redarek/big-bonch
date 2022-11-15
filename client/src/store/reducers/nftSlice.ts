import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchNftNumber, postMintNft} from "./ActionCreators";
import {INft} from "../../types/INft";

interface nftSlice {
    nft: INft
   tokenId: number;
   isLoading: boolean;
   error: string;
}

const initialState: nftSlice = {
    nft: {} as INft,
    tokenId: -1,
    isLoading: false,
    error: ''
}
const nftSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},

    extraReducers: {

        [fetchNftNumber.fulfilled.type]: (state, action: PayloadAction<number>) => {
            state.tokenId = action.payload
            state.error = '';
            state.isLoading = false;
        },
        [fetchNftNumber.pending.type]: (state) => {
            state.isLoading = true;
        },
        [fetchNftNumber.rejected.type]: (state, action: PayloadAction<string>) => {
            state.error = action.payload
            state.isLoading = false;
        },

        [postMintNft.fulfilled.type]: (state, action: PayloadAction<number>) => {
            state.error = '';
            state.isLoading = false;
        },
        [postMintNft.pending.type]: (state) => {
            state.isLoading = true;
        },
        [postMintNft.rejected.type]: (state, action: PayloadAction<string>) => {
            state.error = action.payload
            state.isLoading = false;
        }
    }
})
export const {} = nftSlice.actions;
export default nftSlice.reducer;
