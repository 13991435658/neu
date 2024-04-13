import neuRequest from "@/utils/request"

interface LoginInfo{
    username:string
    password:string
}
export const login = (loginInfo:LoginInfo)=>{
    return neuRequest.post('/api/login',loginInfo)
}

export type {LoginInfo}