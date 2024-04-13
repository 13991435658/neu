import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import thunk from 'redux-thunk';
import loginReducer from '@/views/login/store'
import searchUserReducer from '@/views/searchUser/store'
import marketReducer from '@/views/market/store'

const reducers = combineReducers({
    loginReducer,
    searchUserReducer,
    marketReducer
})


const persistConfig = {
    key: 'root',
    storage,
    blacklist: []  // 黑名单 不缓存的
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk],
});


export type RootState = ReturnType<typeof store.getState>         //上下任选其一
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<any>();
export default store