import React, { memo, useEffect, useState } from 'react'
import { Avatar } from 'antd'
import { occupationArr } from '@/assets/data/local-data'
import { ManOutlined, WomanOutlined } from '@ant-design/icons'
import styles from './usercard.module.scss'
import neuRequest from '@/utils/request'
import { useAppSelector } from '@/store'

interface IProps {
    userId: number,
    panel1Num?: number,
    panel1text?: string
    btn1text?: string,
    btn1callback?: () => void
    btn2callback?: () => void
    own: boolean
}
const UserCard: React.FC<IProps> = (props) => {
    const { userId, btn1text, panel1text, panel1Num, btn1callback, btn2callback, own = false } = props
    const loginUser = useAppSelector(state=>state.loginReducer.userInfo)
    const User = useAppSelector(state => state.searchUserReducer.allUser.filter(user => user.id === userId))
    const [followInfo, setfollowInfo] = useState<any>(null)
    const { avatarfile, username, occupation,sex } = User[0] || loginUser
    useEffect(() => {
        neuRequest.post('/api/followinfo', { id: userId }).then(res => {
            setfollowInfo(res.data)
        })
    }, [userId])
    return (
        <div className={styles.userinfocard}>
            <div className="usertop">
                <Avatar size={50} src={<img src={avatarfile} alt="头像" />} />
                <div className='infospan'>
                    <span className="infotop">{username}</span>
                    <span className="infobottom">{sex ? <WomanOutlined style={{ color: '#ff1493', fontSize: '14px' }} /> : <ManOutlined style={{ color: '#1e80ff', fontSize: '14px' }} />} {occupationArr[occupation]}</span>
                </div>
            </div>
            <div className="usermiddle">
                <div className="infospan center">
                    <span className="infotop">{panel1Num}</span>
                    <span className="infobottom">{panel1text}</span>
                </div>
                <div className="infospan center">
                    <span className="infotop">{followInfo?.followmeArr.length}</span>
                    <span className="infobottom">粉丝</span>
                </div>
                <div className="infospan center">
                    <span className="infotop">{followInfo?.myfollowArr.length}</span>
                    <span className="infobottom">关注</span>
                </div>
            </div>
            <div className="userbottom">
                <div className="btn btn1" onClick={btn1callback}>{btn1text}</div>
                {!own && <div className="btn btn2" onClick={btn2callback}>私信</div>}
            </div>
        </div>
    )
}

export default memo(UserCard)