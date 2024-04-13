import React, { ReactNode, memo } from "react";
import styles from './neuv1.module.scss'

interface IProps{
    children?:ReactNode
    keywords?:Array<string>
    title?:string
    moreLink?:string
    moretext?:string
    getIndex:(index:number)=>void
}

const NeuV1:React.FC<IProps> = (props)=>{
    const {keywords=[],title='默认标题',moreLink='#',moretext='更多',getIndex} = props
    return (
        <div className={styles.neuv1Box}>
            <div className="v1left">
                <h3 className="v1title">{title}</h3>
                <div className="keyword">
                    {
                        keywords.map((item,index)=>{
                            return (
                                <div className="item" key={item}>
                                    <span onClick={()=>getIndex(index)} className="link">{item}</span>
                                    <span className="divider">|</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="v1right">
                <a href={moreLink}>{moretext}</a>
                <i className="v1icon"></i>
            </div>
        </div>
    )
}

export default memo(NeuV1)