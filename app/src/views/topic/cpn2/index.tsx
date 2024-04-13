import React, { memo, useEffect, useState } from "react";
import { getTopicRank } from "../server";
import stys from './cpn2.module.scss'
import { useNavigate } from "react-router-dom";
interface IProps{
    setcurrentTopicId:any
}
const Cpn2:React.FC<IProps> = (props) => {
    const {setcurrentTopicId} = props
    const [topicRank, settopicRank] = useState<any[]>()
    const navigate = useNavigate()
    useEffect(() => {
        getTopicRank().then((res) => {
            settopicRank(res.data.topicRank)
        })
    }, [])
    return (
        <div className={stys.topicRankBox}>
            <div className={stys.title}>
                话题热度
            </div>
            <div className={stys.alltopic}>
                {
                    topicRank && topicRank.map(
                        (item, index:any) =>
                            <div className={stys.topicitem} key={item.topicId}>
                                <div className={index<3?stys.topichot1:stys.topichot2}>
                                    {index+1}
                                </div>
                                <div onClick={()=>{
                                    setcurrentTopicId(item.topicId)
                                    navigate(`/topic/tpdetail?topicId=${item.topicId}`)
                                }} className={stys.topictext} >
                                    {item.title}
                                </div>
                            </div>
                    )
                }
            </div>
        </div>
    )
}

export default memo(Cpn2)