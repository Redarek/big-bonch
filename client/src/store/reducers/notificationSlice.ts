// setNotificationMintNFTIsVisible: (bool: boolean) => void;
// setNotificationItem: (obj: Reward) => void;

import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthResponse} from "../../types/AuthResponse";
import {checkAuth, login, logout, patchNftMetadata} from "./ActionCreators";
import {INftMetadata} from "../../types/INftMetadata";
import {useState} from "react";
interface Reward {
    type: "GetItem" | "MintNFT";
    img: string;
    name: string
}

interface NotificationState {
    isShowNotification: boolean;
    notificationItem: Reward;
}

const initialState: NotificationState = {
    isShowNotification: false,
    notificationItem: {} as Reward,
}
const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification : (state, action:PayloadAction<Reward>) => {
            state.isShowNotification = true;
            state.notificationItem = action.payload
        },
        hideNotification : (state) => {
            state.isShowNotification = false;
            state.notificationItem = initialState.notificationItem
        }

    },

    extraReducers: {}
})
export const {showNotification, hideNotification} = notificationSlice.actions;
export default notificationSlice.reducer;
