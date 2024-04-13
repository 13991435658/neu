import React, { memo } from "react";
import styles from './nav.module.scss'
import { NavLink } from "react-router-dom";

interface IProps{
    navdata:any
}
interface Navitem{
    title:string,
    url:string
}
const Nav:React.FC<IProps> = (props)=>{
    const {navdata} = props
    return (
        <div className={styles.nav}>
            <div className={styles.content} style={{width:'815px',margin:'0 auto'}}>
                {navdata.map((item:Navitem)=>{
                    return (
                        <div className={styles.navitem} key={item.title}>
                            <NavLink to={item.url} className={({isActive})=>{
                                return isActive? styles.active:undefined
                            }}>{item.title}</NavLink>
                        </div>
                    )
                })}
            </div>
        </div>
    )
} 

export default memo(Nav)