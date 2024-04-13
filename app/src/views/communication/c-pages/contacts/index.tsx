import React, { memo, useEffect, useState } from "react";
import { UserOutlined, MessageOutlined, CaretDownOutlined, WomanOutlined, ManOutlined, HomeOutlined, UserDeleteOutlined, UserAddOutlined } from "@ant-design/icons";
import { relationship } from "@/utils/fc";
import { Avatar, message, Button, Empty } from "antd";
import { useAppDispatch, useAppSelector } from "@/store";
import { shallowEqual } from "react-redux";
import { AsyncGetallUser, AsyncGetfollowInfo } from "@/views/searchUser/store";
import { followUser, unfollowUser } from "@/views/searchUser/server";
import { occupationArr } from "@/assets/data/local-data";
import { useNavigate } from "react-router-dom";
import { addConversation } from "../../server";
interface IProps { }
const Contacts: React.FC<IProps> = (props) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const loginUser = useAppSelector(state => state.loginReducer.userInfo)
    const allUsers = useAppSelector(state => state.searchUserReducer.allUser, shallowEqual)
    const myfollowArr = useAppSelector(state => state.searchUserReducer.myfollowArr, shallowEqual)
    const followmeArr = useAppSelector(state => state.searchUserReducer.followmeArr, shallowEqual)
    const [userDetail, setuserDetail] = useState<any>(null)
    const unfollow = async () => {
        const res = await unfollowUser(loginUser.id, userDetail.id)
        res.data.ok && message.success('取关成功')
        if (relationship(userDetail.id, myfollowArr, followmeArr) === 1) {
            setuserDetail(null)
        }
        dispatch(AsyncGetfollowInfo(loginUser.id))
    }
    const follow = async () => {
        const followInfo = {
            followId: loginUser.id,
            isfollowedId: userDetail.id
        }
        const res = await followUser(followInfo)
        res.data.ok && message.success('关注成功')
        dispatch(AsyncGetfollowInfo(loginUser.id))
    }
    const goConversation = () => {
        addConversation(loginUser.id, userDetail.id).then(
            res => {
                console.log(res.data)
                navigate(`/communication/conversations?friendId=${userDetail.id}`)
            }
        )
    }
    useEffect(() => {
        dispatch(AsyncGetfollowInfo(loginUser.id))
        dispatch(AsyncGetallUser(loginUser.id))
    }, [])
    return (
        <>
            <div className='cnleft'>
                <div className="ltop"> <UserOutlined /> </div>
                {allUsers.some(item => relationship(item.id, myfollowArr, followmeArr) !== 0) ?
                    allUsers.map(item => (
                        relationship(item.id, myfollowArr, followmeArr) !== 0 &&
                        <div className="friend" key={item.id} onClick={() => setuserDetail(item)}>
                            <Avatar size={50} src={<img src={item.avatarfile} alt="头像" />} />
                            <div className='friendinfo'>
                                <span className="itop">
                                    {item.username}
                                </span>
                                <span className="ibottom">
                                    {
                                        relationship(item.id, myfollowArr, followmeArr) === 1 ? '🧔🏼你的关注' :
                                            relationship(item.id, myfollowArr, followmeArr) === -1 ? '🧔🏻你的粉丝' : '💑互相关注'
                                    }<CaretDownOutlined />
                                </span>
                            </div>
                        </div>
                    )) : <div className="empty">
                        <Empty
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                            imageStyle={{ height: 60 }}
                            description={
                                <span>
                                    暂无联系人
                                </span>
                            }
                        >
                            <Button type="primary" onClick={() => navigate('/searchuser')}>添加关系</Button>
                        </Empty>
                    </div>
                }
            </div>
            <div className='cnright'>
                {
                    userDetail ?
                        <div>
                            <div className="userdtop">
                                <Avatar size={70} src={<img src={userDetail.avatarfile} alt="头像" />} />
                                <div className='dspan'>
                                    <span className="dtop">{userDetail.username}</span>
                                    <div className='doccupation'>
                                        <div>{userDetail.sex ? <WomanOutlined style={{ color: '#ff1493', fontSize: '14px' }} /> : <ManOutlined style={{ color: '#1e80ff', fontSize: '14px' }} />}</div>
                                        <div style={{ marginLeft: '5px' }}>{occupationArr[userDetail.occupation]}</div>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        {
                                            relationship(userDetail.id, myfollowArr, followmeArr) === 1 ? '🧔🏼你的关注' :
                                                relationship(userDetail.id, myfollowArr, followmeArr) === -1 ? '🧔🏻你的粉丝' : '💑互相关注'
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="userdbottom">
                                <div className="dbtn" onClick={goConversation}>
                                    <MessageOutlined />
                                    <div>发消息</div>
                                </div>
                                <div className="dbtn">
                                    <HomeOutlined />
                                    <div>个人主页</div>
                                </div>
                                {
                                    relationship(userDetail.id, myfollowArr, followmeArr) !== -1 ?
                                        <div className="dbtn" onClick={unfollow}>
                                            <UserDeleteOutlined />
                                            <div>取消关注</div>
                                        </div> :
                                        <div className="dbtn" onClick={follow}>
                                            <UserAddOutlined />
                                            <div>回关</div>
                                        </div>
                                }
                            </div>
                        </div> :
                        <div>

                        </div>
                }
            </div>
        </>
    )
}

export default memo(Contacts)