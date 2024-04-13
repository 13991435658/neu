import { createSlice,createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {getAllUser, getfollowInfo} from "../server"

interface IState{
    allUser:any[],
    myfollowArr: number[],
    followmeArr: number[]
}
const initialState:IState = {
    allUser:[],
    myfollowArr: [],
    followmeArr: []
}
const searchUserStore = createSlice({
    name:'searchUser',
    initialState,
    reducers:{
        changeAlluser:(state,{payload}:PayloadAction<any>)=>{
            state.allUser = payload
        },
        changefollowInfo:(state,{payload}:PayloadAction<any>)=>{
            state.myfollowArr = payload.myfollowArr
            state.followmeArr = payload.followmeArr
        },
        clearSearch:(state)=>{
            state.allUser = []
            state.myfollowArr=[]
            state.followmeArr=[]
        }
    }
})

export const AsyncGetallUser = createAsyncThunk('allUser',async (id:number,{dispatch})=>{
    const res = await getAllUser(id)
    dispatch(changeAlluser(res.data.allUser))
})
export const AsyncGetfollowInfo = createAsyncThunk('followInfo',async (id:number,{dispatch})=>{
    const res = await getfollowInfo(id)
    dispatch(changefollowInfo(res.data))
})
export const {changeAlluser,changefollowInfo,clearSearch} =searchUserStore.actions
export default searchUserStore.reducer