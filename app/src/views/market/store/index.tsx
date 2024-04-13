import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getGoods } from "../server";

interface IState{
    allgoods:any[]
}
const initialState:IState = {
    allgoods:[]
}
const marketReducer = createSlice({
    name:'market',
    initialState,
    reducers:{
        changeAllgoods(state,{payload}){
            state.allgoods = payload
        }
    }
})

export const AsyncGetAllgoods = createAsyncThunk('allgoods',async (args,{dispatch})=>{
    const res = await getGoods()
    dispatch(changeAllgoods(res.data.goodsList))
})

export const {changeAllgoods} = marketReducer.actions
export default marketReducer.reducer