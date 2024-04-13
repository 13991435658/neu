import { useAppSelector } from "@/store";
import React, { ReactNode, memo } from "react";
import styles from '../communication/css/cn.module.scss'
import { Avatar } from "antd";
import { UserOutlined, UsergroupAddOutlined, MessageOutlined, CommentOutlined } from "@ant-design/icons";
import { NavLink, Outlet } from "react-router-dom";

interface IProps {
    children?: ReactNode
}

const Communication: React.FC<IProps> = (props) => {
    const loginUser = useAppSelector(state => state.loginReducer.userInfo)
    return (
        <div className={styles.cnBox}>
            <div className="content wrap-v3">
                <div className="side">
                    <div className="avatar"><Avatar size={50} src={<img src={loginUser.avatarfile} alt="头像" />} /></div>
                    <NavLink to='/communication/conversations' className={({ isActive }) => isActive ? ['nav', 'navclick'].join(' ') : 'nav'}><MessageOutlined /></NavLink>
                    <NavLink to='/communication/contacts' className={({ isActive }) => isActive ? 'nav navclick' : 'nav'} ><UserOutlined /></NavLink>
                    <NavLink to='/communication/group' className={({ isActive }) => isActive ? 'nav navclick' : 'nav'} ><CommentOutlined /></NavLink>
                    <div className="nav"><UsergroupAddOutlined style={{ fontSize: '30px' }} /></div>
                </div>
                <Outlet />
            </div>
        </div>
    )
}

export default memo(Communication)
