import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthResponse} from "../../types/AuthResponse";
import {checkAuth, login, logout} from "./ActionCreators";
import {INftMetadata} from "../../types/INftMetadata";

interface InventoryState {
    menuTitle: number;
    isShowMenu: boolean;
    nft: INftMetadata
}

const initialState: InventoryState = {
    menuTitle: 0,
    isShowMenu: false,
    nft: {} as INftMetadata
}
const inventorySlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setIsShow: (state, action:PayloadAction<boolean>) => {
           state.isShowMenu = action.payload
        },
        setTitle: (state, action: PayloadAction<number>) => {
            state.menuTitle = action.payload
        },
        setNft: (state, action: PayloadAction<INftMetadata>) => {
            state.nft = initialState.nft
            state.nft = action.payload
        }
    },

    extraReducers: {}
})
export const {setNft, setIsShow, setTitle} = inventorySlice.actions;
export default inventorySlice.reducer;
