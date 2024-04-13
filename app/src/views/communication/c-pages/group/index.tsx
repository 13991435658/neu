import React, { useEffect, useRef, useState } from "react";
import '../../css/cn.module.scss'
import { SendOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/store";
import { Avatar, Badge, Button, Drawer, Empty, message } from "antd";
import stys from './group.module.scss'
import neuRequest from "@/utils/request";
import { useNavigate } from "react-router-dom";
import Message from "../../c-cpns/message";
import UploadFile from "../../c-cpns/uploadFile";
import { io } from "socket.io-client";
import { getMessages, lastMessage, read, sendMessage, unreadAdd } from "../../server";
import moment from "moment";
import { useImmer } from "use-immer";

const Group = () => {
    const allUsers = useAppSelector(store => store.searchUserReducer.allUser)
    const loginUser = useAppSelector(store => store.loginReducer.userInfo)
    console.log(loginUser.username)
    const navigate = useNavigate()
    const [open, setOpen] = useState<boolean>(false);
    const scrollRef = useRef<any>(null)
    const [sendtext, setSendtext] = useState<any>()
    const [grouplist, setGrouplist] = useState<any[]>([])
    const [currentMsg, setcurrentMsg] = useState<any[]>([])
    const [lastMsg, setlastMsg] = useImmer<any>(null)
    const [currentGroup, setcurrentGroup] = useState<any>()
    const [socketMsg, setsocketMsg] = useState<any>()
    const socket = useRef<any>()
    const groupRef = useRef<any>([loginUser.id])
    const createGroup = async () => {
        if (groupRef.current.length > 1) {
            const res = await neuRequest.post('/api/creategroup', {
                userlist: JSON.stringify(groupRef.current)
            })
            setGrouplist([...grouplist, res.data.insertgroup])
            message.success('创建成功')
            setcurrentGroup(res.data.insertgroup)
            onClose()
        } else {
            message.success('请选择成员')
        }
    }
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    const getcurrentMsg: (arg: number) => Promise<any> = async (id: number) => {
        const res = await getMessages(id)
        res.data.ok === 1 ? setcurrentMsg(res.data.messages) : setcurrentMsg([])
    }
    const showMsg = (currentinfo: any) => {
        setcurrentGroup(currentinfo)
        getcurrentMsg(currentinfo.groupId)
        setlastMsg((draft: any) => {
            draft[currentinfo.groupId]['unread'] = 0
        })
        read({ chatId: currentinfo.groupId, userId: loginUser.id })
    }
    const getuserInfo = (id: number) => allUsers.find(item => item.id === id)
    const sendMsg = async (sendtext: string) => {
        if (sendtext) {
            const sendMsgInfo = {
                conversationId: currentGroup.groupId,
                senderId: loginUser.id,
                content: sendtext
            }
            socket.current.emit('sendGroupMsg', {
                groupId: currentGroup.groupId,
                senderId: loginUser.id,
                receiverIdList: currentGroup.userlist.filter((item: number) => item != loginUser.id),
                content: sendtext
            })
            //添加新消息到数据库
            sendMessage(sendMsgInfo).then(
                res => setcurrentMsg([...currentMsg, res.data.message])
            )
            const newuserlist = currentGroup.userlist.filter((item: any) => item != loginUser.id)
            unreadAdd({
                chatId: currentGroup.groupId,
                userlist: newuserlist
            })
            setlastMsg((draft: any) => {
                draft[currentGroup.groupId]['content'] = sendtext
                draft[currentGroup.groupId]['time'] = Date.now()
            })
            setSendtext('')
        }
    }

    const addUser = (e: any) => {
        if (e.target.value && e.target.checked === true) {
            groupRef.current.push(e.target.value)
        }
        if (e.target.value && e.target.checked === false) {
            groupRef.current.splice(groupRef.current.indexOf(e.target.value), 1)
        }
        console.log(groupRef.current)
    }
    const getGroupList = () => {
        neuRequest.get(`/api/grouplist?userId=${loginUser.id}`).then(res => {
            setGrouplist(res.data.grouplist)
        })
    }
    useEffect(() => {
        getGroupList()
    }, [])
    useEffect(() => {
        //获取每个对话的最消息 
        if (grouplist.length) {
            const cvsidArr = grouplist.map(group => group.groupId)
            lastMessage(cvsidArr, loginUser.id).then(res => {
                setlastMsg(res.data.lastMsg)
            })
        }
    }, [grouplist])
    useEffect(() => {
        socket.current = io('ws://localhost:5000')
        socket.current.emit('addUser', loginUser.id)
        socket.current.on('allUsers', (users: any) => {
            console.log(users)
        })
        socket.current.on('receiveMsg', (msgInfo: any) => {
            setsocketMsg(msgInfo)
        })
    }, [])
    useEffect(() => {
        //监听到有人给自己发消息，但左边列表没有，重新获取列表即可
        if (socketMsg && !grouplist.find(item => item.groupId === socketMsg.conversationId)) {
            getGroupList()    //重新获取后会自动触发获取最新消息
        }
        //监听到有人给自己发消息，左边列表也有，直接修改最新状态
        if (socketMsg && grouplist.find(item => item.groupId === socketMsg.conversationId)) {
            setlastMsg((draft: any) => {
                draft[socketMsg.conversationId]['content'] = socketMsg.content
                draft[socketMsg.conversationId]['time'] = Date.now()
                draft[socketMsg.conversationId]['unread'] = draft[socketMsg.conversationId]['unread'] + 1
            })
        }
        //监听到有人给自己发消息，同时右边窗口打开的就是对方，刷新当前消息界面
        socketMsg && currentGroup?.groupId === socketMsg.conversationId && setcurrentMsg(prev => [...prev, socketMsg])

    }, [socketMsg])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [currentMsg])
    return (
        <>
            <div className='cnleft'>
                <div className="ltop" onClick={showDrawer} style={{ cursor: 'pointer' }}> <UsergroupAddOutlined /> 点击创建 </div>
                <div>
                    {
                        grouplist.length ? grouplist.map(item => (
                            <div className="friend" key={item.groupId} onClick={() => showMsg(item)}>
                                <Avatar size={50} src={<img src='/images/group.jpg' alt="头像" />} />
                                <div className='friendinfo'>
                                    <div className="badge">
                                        {lastMsg && <Badge size='small' overflowCount={99} count={lastMsg[item.groupId]?.unread} />}
                                    </div>
                                    <div className="itop">
                                        <div>群{item.groupId}</div>
                                        <div className="tr">{lastMsg && lastMsg[item.groupId]?.time && moment(lastMsg[item.groupId]['time']).format('lll')}</div>
                                    </div>
                                    <div className="ibottom">
                                        {lastMsg && lastMsg[item.groupId]?.content}
                                    </div>
                                </div>
                            </div>
                        )) : <div className="empty">
                            <Empty
                                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                imageStyle={{ height: 60 }}
                                description={
                                    <span>
                                        暂无群聊
                                    </span>
                                }
                            >
                                <Button type="primary">创建群聊</Button>
                            </Empty>
                        </div>

                    }
                </div>
            </div>
            <div className="msgright">
                {
                    currentGroup ?
                        <>
                            <div className="mtop">
                                {currentGroup.groupId}
                            </div>
                            <div className="mmiddle">
                                {currentMsg.length ? currentMsg.map(msg =>
                                    <div key={msg.time} ref={scrollRef}>
                                        <Message avatarUrl={msg.senderId === loginUser.id ? loginUser.avatarfile : getuserInfo(msg.senderId).avatarfile} content={msg.content} time={msg.time} own={msg.senderId === loginUser.id} />
                                    </div>) : <p className="nomsg">打开了对话，但未发送消息</p>}
                            </div>
                            <div className="mbottom">
                                <div className="operation">
                                    <UploadFile successUpload={sendMsg} />
                                </div>
                                <textarea onChange={e => setSendtext(e.target.value)} value={sendtext} className="ta" name="" id="" cols={70} rows={4}></textarea>
                                <Button className="send" type="primary" shape="round" onClick={() => sendMsg(sendtext)}><SendOutlined />发送</Button>
                            </div>
                        </> :
                        <>

                        </>
                }
            </div>
            <Drawer title="选择成员" onClose={onClose} open={open}>
                {
                    allUsers.map(item => (
                        <div key={item.id} className={stys.userlist} onClick={addUser}>
                            <Avatar src={item.avatarfile} />
                            <div className={stys.username}>{item.username}</div>
                            <input type="checkbox" value={item.id} name="group" />
                        </div>
                    ))
                }
                <Button type="primary" onClick={createGroup}>创建群聊</Button>
            </Drawer>
        </>
    )
}

export default Group