import React, { memo } from "react";
import type { ReactNode } from "react";
import { NavLink, useNavigate } from 'react-router-dom'
import classnames from 'classnames'
import styles from './css/app-header.module.scss'
import { appHeaderNavdata, occupationArr } from '@/assets/data/local-data'
import { SearchOutlined } from '@ant-design/icons';
import { Input, Avatar, Dropdown, message } from 'antd';
import type { MenuProps } from 'antd';
import { shallowEqual, useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import { UserOutlined, SettingOutlined, PoweroffOutlined,UsergroupAddOutlined } from "@ant-design/icons";
import { clearUserInfo } from "@/views/login/store";
import { clearSearch } from "@/views/searchUser/store";

interface IProps {
    children?: ReactNode
}
interface Ntitle {
    title: string,
    type: string,
    url: string
}

const Header: React.FC<IProps> = (props) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const quit = () => {
        dispatch(clearUserInfo())
        dispatch(clearSearch())
        sessionStorage.removeItem('token')
        message.success('安全退出')
        navigate('/login')
    }
    
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div onClick={()=>navigate('/center')}>
                    <UserOutlined /> <span style={{ marginLeft: '6px' }}>个人中心</span>
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    <SettingOutlined /> <span style={{ marginLeft: '6px' }}>资料编辑</span>
                </a>
            ),
        },
        {
            key: '3',
            label: (
                <div onClick={quit}>
                    <PoweroffOutlined /> <span style={{ marginLeft: '6px' }}>退出</span>
                </div>
            ),
        },
    ];
    const userInfo = useSelector((state: RootState) => state.loginReducer.userInfo, shallowEqual)
    const titleShow = (item: Ntitle) => {
        if (item.type === 'link') {
            return (
                <NavLink className={({ isActive }) => {
                    return isActive ? styles.active : undefined
                }} to={item.url}>
                    {item.title}
                    <i className={styles.icon}></i>
                </NavLink>)
        } else {
            return (<a href={item.url} rel="noreferrer" target="_blank">{item.title}</a>)
        }
    }
    return (
        <div className={styles.nav}>
            <div className={classnames(styles.content, 'wrap-v1')}>
                <div className={styles.left}>
                    <a className={styles.logo} href="/">东北大学</a>
                    <div className={styles.navlist}>
                        {appHeaderNavdata.map((item) => {
                            return (
                                <div className={styles.navitem} key={item.title}>
                                    {titleShow(item)}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className={styles.right}>
                    <Input placeholder="还没写好" className={styles.search} prefix={<SearchOutlined />} />
                    <a href="http://aao.neu.edu.cn/mainm.htm" rel="noreferrer" target="_blank" className={styles.center}>东大教务处</a>
                    {Object.keys(userInfo).length ?
                        <div className={styles.info}>
                            <Dropdown menu={{ items }} placement="bottom" arrow>
                                <Avatar size={40} src={<img src={userInfo.avatarfile} alt="头像" />} />
                            </Dropdown>
                            <div className='infospan'>
                                <span className="top">{userInfo.username}</span>
                                <span className="bottom">{occupationArr[userInfo.occupation]}</span>
                            </div>
                            <div className="icon"><UsergroupAddOutlined onClick={()=>navigate('/searchuser')} /></div>
                        </div>
                        :
                        <a href="/#" className={styles.login}>登录</a>
                    }
                </div>
            </div>
            <div className={styles.divider}></div>
        </div>
    )
}

export default memo(Header)