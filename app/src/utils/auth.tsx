import React, { ReactElement, memo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import routes from '@/router'
import { message } from "antd";
import { MyRouteObject } from "@/router";

interface IProps {
    children: ReactElement      //这里用ReactNode会报错，因为ReactNode是联合类型，而Auth这个FC需要返回ReactElement类型的，所以用ReactNode的话返回props.children无法确定是ReactElement
}
const Auth: React.FC<IProps> = (props) => {
    const location = useLocation()
    const { pathname } = location

    const match = (routes: MyRouteObject[]): MyRouteObject | null => {
        for (let route of routes) {
            if (route.path === pathname){return route}
            if (route.children){
                const matchres = match(route.children)
                if(matchres) return matchres
            }
        }
        return null
    }

    const guard = () => {
        const route = match(routes)
        
        if(!route){
            message.warning('该页面不存在')
            return false
        }
        if(route.auth){
            const token = localStorage.getItem('accessToken')
            if(token){
                return true
            }else{
                message.warning('请先登录')
                return false
            }
        }
        return true
    }
    return guard() ? props.children : <Navigate to={'/login'} />
}

export default memo(Auth)