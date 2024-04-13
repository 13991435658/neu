import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import Login from '@/views/login'
import Contacts from "@/views/communication/c-pages/contacts";
import Conversations from "@/views/communication/c-pages/conversations";
const Group = lazy(() => import('@/views/communication/c-pages/group'))
const Center = lazy(()=>import('@/views/center'))
const SearchUser = lazy(()=>import('@/views/searchUser'))
const Market = lazy(() => import('@/views/market'))
const Communication = lazy(() => import('@/views/communication'))
const Competition = lazy(() => import('@/views/competition'))
const Lostfound = lazy(() => import('@/views/lostfound'))
const Register = lazy(() => import('@/views/register'))
const Goods = lazy(() => import('@/views/market/c-pages/goods'))                    
const Gdynamic = lazy(()=>import('@/views/market/c-pages/gdynamic'))
const Gmanage = lazy(()=>import('@/views/market/c-pages/gmanage'))
const Gpublish = lazy(()=>import('@/views/market/c-pages/gpublish'))
const Grecord = lazy(()=>import('@/views/market/c-pages/grecord'))
const Gdetail = lazy(()=>import('@/views/market/c-pages/gdetail'))
const Found = lazy(()=>import('@/views/lostfound/c-pages/found'))
const Founditem = lazy(()=>import('@/views/lostfound/c-pages/founditem'))
const Lostitem = lazy(()=>import('@/views/lostfound/c-pages/lostitem'))
const Topic = lazy(()=>import('@/views/topic'))
const Tpcenter = lazy(()=>import ('@/views/topic/tpcenter'))
const Tpdetail = lazy(()=>import ('@/views/topic/tpdetail'))
const Tppublish = lazy(()=>import ('@/views/topic/tppublish'))
const Cmphome = lazy(()=>import('@/views/competition/cmphome'))
const Cmpcmps = lazy(()=>import('@/views/competition/cmpcmps'))
const Cmppublish = lazy(()=>import('@/views/competition/cmppublish'))
const Cmpdetail = lazy(()=>import('@/views/competition/cpmdetail'))
interface MyRouteObject {
    children?: MyRouteObject[];
    element?: React.ReactNode;
    path?: string;
    auth?: boolean;
}
const routes: MyRouteObject[] = [
    {
        path: '/',
        element: <Navigate to='/login' />,
        auth: false
    },
    {
        path: '/login',
        element: <Login />,
        auth: false
    },
    {
        path: '/register',
        element: <Register />,
        auth: false
    },
    {
        path: '/center',
        element: <Center />,
        auth: true
    },
    {
        path:'/searchuser',
        element:<SearchUser/>,
        auth:true
    },
    {
        path: '/market',
        element: <Market />,
        auth:true,
        children: [
            {
                path:'/market',
                element: <Navigate to='/market/goods' />,
            },
            {
                path: '/market/goods',
                element: <Goods />,
                auth:true
            },
            {
                path:'/market/gdetail',
                element:<Gdetail/>,
                auth:true
            },
            {
                path: '/market/gdynamic',
                element: <Gdynamic />,
                auth:true
            },
            {
                path: '/market/gmanage',
                element: <Gmanage />,
                auth:true
            },
            {
                path: '/market/gpublish',
                element: <Gpublish />,
                auth:true
            },
            {
                path: '/market/grecord',
                element: <Grecord />,
                auth:true
            }
        ]
    },
    {
        path: '/communication',
        element: <Communication />,
        auth:true,
        children:[
            {
                path:'/communication',
                element:<Navigate to='/communication/contacts'/>
            },
            {
                path:'/communication/contacts',
                element:<Contacts/>,
                auth:true
            },
            {
                path:'/communication/conversations',
                element:<Conversations/>,
                auth:true
            },
            {
                path:'/communication/group',
                element:<Group/>,
                auth:true
            }
        ]
    },
    {
        path: '/competition',
        element: <Competition />,
        auth:true,
        children:[
            {
                path:'/competition',
                element:<Navigate to='/competition/cmphome'/>,
                auth:true
            },
            {
                path:'/competition/cmphome',
                element:<Cmphome/>,
                auth:true
            },
            {
                path:'/competition/cmpcmps',
                element:<Cmpcmps/>,
                auth:true
            },
            {
                path:'/competition/cmppublish',
                element:<Cmppublish/>,
                auth:true
            },
            {
                path:'/competition/cmpdetail',
                element:<Cmpdetail/>,
                auth:true
            },
        ]
    },
    {
        path: '/lostfound',
        element: <Lostfound />,
        children:[
            {
                path:'',
                element:<Navigate to='/lostfound/found'/>
            },
            {
                path:'/lostfound/found',
                element:<Found/>,
                auth:true
            },
            {
                path:'/lostfound/founditem',
                element:<Founditem/>,
                auth:true
            },
            {
                path:'/lostfound/lost',
                auth:true
            },
            {
                path:'/lostfound/lostitem',
                element:<Lostitem/>,
                auth:true
            },
        ],
        auth:true
    },
    {
        path:'/topic',
        element:<Topic/>,
        auth:true,
        children:[
            {
                path:'/topic',
                element:<Navigate to='/topic/tpcenter' />,
            },
            {
                path:'/topic/tpcenter',
                element:<Tpcenter/>,
                auth:true
            },
            {
                path:'/topic/tppublish',
                element:<Tppublish/>,
                auth:true
            },
            {
                path:'/topic/tpdetail',
                element:<Tpdetail/>,
                auth:true
            }
        ]
    }
]

export type {MyRouteObject}
export default routes