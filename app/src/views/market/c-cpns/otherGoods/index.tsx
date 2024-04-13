import React, { memo } from "react";
import styles from './otherGoods.module.scss'
import { newArr } from "@/assets/data/local-data";
import moment from "moment";
import { useNavigate } from "react-router-dom";

interface IProps {
    goodsinfo: any
}

const OtherGoods: React.FC<IProps> = (props) => {
    const { goodsinfo } = props
    const navigate = useNavigate()
    return (
        <div onClick={() => navigate(`/market/gdetail?goodsInfo=${JSON.stringify(goodsinfo)}`)} className={styles.otherGoodsBox}>
            <img src={goodsinfo.imgUrl} alt="" />
            <div className="ogright">
                <div className="ogtop"><div className="ogtitle"><div className="ognew">{newArr[goodsinfo.newdegree]}</div>{goodsinfo.title}</div></div>
                <div className="ogprice">￥{goodsinfo.price.toFixed(2)}<span>{moment(goodsinfo.time).format('ll')}</span></div>
            </div>
        </div>
    )
}

export default memo(OtherGoods)