import React, { ReactNode, memo } from "react";
import styles from './css/center.module.scss'
import { useAppSelector } from "@/store";
import { shallowEqual } from "react-redux";
import Usercard from "@/components/usercard";
interface IProps {
    children?: ReactNode
}

const Center: React.FC<IProps> = (props) => {
    const userInfo = useAppSelector((state) => state.loginReducer.userInfo, shallowEqual)
    return (
        <div className={styles.centerBox}>
            <div className="content wrap-v2">
                <div className="left"></div>
                <div className="right">
                    <Usercard {...userInfo} fans={10} follow={20} btn1text="关注" />
                    <div className="bottom"></div>
                </div>
            </div>
        </div>
    )
}

export default memo(Center)

