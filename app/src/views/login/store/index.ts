import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { LoginInfo, login } from '../server'
import { message } from 'antd'
interface IState {
    userInfo: any
}
let initialState: IState = {
    userInfo: {},
}
const loginStore = createSlice({
    name: 'login',
    initialState,
    reducers: {
        changeUserData(state, { payload }: PayloadAction<any>) {
            state.userInfo = payload
        },
        clearUserInfo(state) {
            state.userInfo = {}
        }
    }
})

export const AsyncGetuserInfo = createAsyncThunk('userInfo', async (loginInfo: LoginInfo, { dispatch }) => {
    const res = await login(loginInfo)
    if (res.data.ok === 1) {
        localStorage.setItem('accessToken',res.data.accessToken)
        localStorage.setItem('refreshToken',res.data.refreshToken)
        dispatch(changeUserData(res.data.userInfo))
        message.success('登陆成功')
    } else {
        message.error('账号或密码错误')
    }
})
export const { changeUserData, clearUserInfo } = loginStore.actions
export default loginStore.reducer