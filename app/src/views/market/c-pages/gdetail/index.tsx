import React, { ReactNode, memo, useEffect, useState } from "react";
import styles from './gdetail.module.scss'
import Usercard from "@/components/usercard";
import Gdetailcard from "../../c-cpns/gdetailcard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPublisherInfo } from "../../server";
import { addConversation } from "@/views/communication/server";
import { useAppDispatch, useAppSelector } from "@/store";
import OtherGoods from "../../c-cpns/otherGoods";
import { AsyncGetfollowInfo } from "@/views/searchUser/store";
interface IProps {
    children?: ReactNode
}

const Gdetail: React.FC<IProps> = (props) => {
    const dispatch = useAppDispatch()
    const [searchParams] = useSearchParams()
    const loginUser = useAppSelector(state => state.loginReducer.userInfo)
    const goodsInfo = JSON.parse(searchParams.get('goodsInfo')!)
    const [userInfo, setuserInfo] = useState<any>(null)
    const navigate = useNavigate()
    const btn2callback = () => {
        addConversation(loginUser.id, goodsInfo.userId).then(
            res => {
                console.log(res.data)
                navigate(`/communication/conversations?friendId=${goodsInfo.userId}`)
            }
        )
    }
    useEffect(() => {
        dispatch(AsyncGetfollowInfo(loginUser.id))
        getPublisherInfo(goodsInfo.userId).then(
            (res)=> {
                setuserInfo(res.data)
            }
        )
    }, [])
    return (
        <div className={styles.centerBox}>
            <div className="content wrap-v2">
                <div className="left">
                    <Gdetailcard goodsInfo={goodsInfo} />
                </div>
                <div className="right">
                    <Usercard userId={userInfo?.publisher.id} panel1Num={userInfo?.publishgoods.length} own={loginUser.id===userInfo?.publisher.id} panel1text="发布" btn1text="主页" btn1callback={() => { navigate('/center') }} btn2callback={btn2callback} />
                    <div className="bottom">
                        <div className="bottomcontain">
                            <div className="otherBoxtitle">
                                {loginUser.id===userInfo?.publisher.id?'我':userInfo?.publisher.sex ? '她' : '他'}的其他物品
                            </div>
                            {
                                userInfo?.publishgoods.filter((item:any)=>item.goodsId!==goodsInfo.goodsId).map((item: any) => {
                                    return (
                                        <OtherGoods key={item.goodsId} goodsinfo={item} />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Gdetail)

