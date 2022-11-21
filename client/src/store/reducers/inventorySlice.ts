import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthResponse} from "../../types/AuthResponse";
import {checkAuth, login, logout} from "./ActionCreators";
import {INftMetadata} from "../../types/INftMetadata";

interface InventoryState {
   nft: INftMetadata
}

const initialState: InventoryState = {
    nft: {} as INftMetadata
}
const inventorySlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setNft: (state, action: PayloadAction<INftMetadata>) => {
            state.nft = action.payload
        }
    },

    extraReducers: {}
})
export const {setNft} = inventorySlice.actions;
export default inventorySlice.reducer;
