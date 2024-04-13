import React, { ReactNode, memo, useEffect, useRef, useState } from "react";
import styles from './goodsCard.module.scss'
import { Avatar } from "antd";
import { AliwangwangOutlined,WomanOutlined,ManOutlined} from "@ant-design/icons";
import { addressArr, categoryArr, newArr } from "@/assets/data/local-data";

interface IProps {
    children?: ReactNode,
    title:string,
    imgUrl:string,
    price:number,
    newdegree:number,
    address:number,
    category:number,
    remark:string,
    time:bigint,
    userId:number,
    avatarfile:string,
    username:string,
    sex:number
}

const GoodsCard: React.FC<IProps> = (props) => {
    const imgRef = useRef<HTMLImageElement>(null)
    const [imgSrc,setImgSrc] = useState<string>('')
    useEffect(()=>{
        const observer = new IntersectionObserver((entries)=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting){
                    setImgSrc(props.imgUrl)
                    observer.unobserve(entry.target)
                }
            })
        })
        if(imgRef.current){
            observer.observe(imgRef.current)
        }
        return ()=>{
            if(imgRef.current){
                observer.unobserve(imgRef.current)
            }
        }
    },[props.imgUrl])
    return (
        <div className={styles.goodsCardBox}>
            <img ref={imgRef} src={imgSrc} alt="图片没了" className="goodsimg" />
            <div className="gstop"><div className="gstitle"><div className="gsnew">{newArr[props.newdegree]}</div>{props.title}</div></div>
            <div className="gsmiddle"><div className="gsprice">￥{props.price.toFixed(2)}</div><div className="gsaddress">{categoryArr[props.category]} {addressArr[props.address]}</div></div>
            <div className="gsbottom">
                <div>
                    <Avatar size={25} src={props.avatarfile} />
                    <span className="gsuser">{props.username} {props.sex ? <WomanOutlined style={{ color: '#ff1493', fontSize: '14px' }} /> : <ManOutlined style={{ color: '#1e80ff', fontSize: '14px' }} />}</span>
                </div>
                <div className="gsdetail">详情 <AliwangwangOutlined /></div>
            </div>
        </div>
    )
}

export default memo(GoodsCard)


