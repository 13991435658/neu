import React, { memo, useEffect, useRef, useState } from "react";
import '../../css/cn.module.scss'
import { Avatar, Badge, Button, Empty, Modal, Upload } from "antd";
import { FolderAddOutlined, MessageOutlined } from "@ant-design/icons";
import { getConversations, getMessages, lastMessage, read, sendMessage, unreadAdd } from "../../server";
import { useAppSelector } from "@/store";
import { SendOutlined } from "@ant-design/icons";
import { shallowEqual } from "react-redux";
import { io } from "socket.io-client";
import { useImmer } from 'use-immer'
import Message from "../../c-cpns/message";
import { useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import UploadFile from "../../c-cpns/uploadFile";
moment.locale('zh-cn')
interface IProps { }
const Conversations: React.FC<IProps> = (props) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [conversations, setConversations] = useState<any[]>([])
    const [currentCvs, setcurrentCvs] = useState<any>()
    const [currentMsg, setcurrentMsg] = useState<any[]>([])
    const [socketMsg, setsocketMsg] = useState<any>()
    const [lastMsg, setlastMsg] = useImmer<any>(null)
    const [file, setfile] = useState(null)

    const socket = useRef<any>()
    const [sendtext, setSendtext] = useState<string>('')
    const scrollRef = useRef<any>(null)
    const allUsers = useAppSelector(state => state.searchUserReducer.allUser, shallowEqual)
    const loginUser = useAppSelector(state => state.loginReducer.userInfo)



    //函数：接收对话id,返回消息列表
    const getcurrentCvs: (arg: number) => Promise<any> = async (conversationId: number) => {
        const res = await getMessages(conversationId)
        res.data.ok === 1 ? setcurrentMsg(res.data.messages) : setcurrentMsg([])
    }
    //点击左边列表，创建消息界面，并发送对话id获取消息
    const showMsg = (msgInfo: any) => {
        setcurrentCvs(msgInfo)
        getcurrentCvs(msgInfo.conversationId)
        setlastMsg((draft: any) => {
            draft[msgInfo.conversationId]['unread'] = 0
        })
        read({ chatId: msgInfo.conversationId, userId: loginUser.id })
    }

    const sendMsg = (sendtext:string) => {
        if (sendtext) {
            const sendMsgInfo = {
                conversationId: currentCvs.conversationId,
                senderId: loginUser.id,
                content: sendtext
            }
            socket.current.emit('sendMsg', {
                conversationId: currentCvs.conversationId,
                senderId: loginUser.id,
                receiverId: currentCvs.friendInfo.id,
                content: sendtext
            })
            //添加新消息到数据库
            sendMessage(sendMsgInfo).then(
                res => setcurrentMsg([...currentMsg, res.data.message])
            )
            unreadAdd({
                chatId:currentCvs.conversationId,
                userlist:[currentCvs.friendInfo.id]
            })
            setlastMsg((draft: any) => {
                draft[currentCvs.conversationId]['content'] = sendtext
                draft[currentCvs.conversationId]['time'] = Date.now()
            })
            setSendtext('')
        }
    }
    const getmyConversations: () => Promise<any> = async () => {
        const res = await getConversations(loginUser.id)
        res.data.ok === 1 ? setConversations(res.data.conversations.map((conversation: any) => ({
            conversationId: conversation.conversationId,
            friendInfo: allUsers.filter((item:any)=> item.id === (conversation.currentId === loginUser.id ? conversation.targetId : conversation.currentId))[0]
        }))) : setConversations([])
    }

    useEffect(() => {
        getmyConversations()
    }, [])
    useEffect(() => {
        socket.current = io('ws://localhost:5000')
        socket.current.emit('addUser', loginUser.id)
        socket.current.on('allUsers', (users: any) => {
            console.log(users)
        })
        socket.current.on('receiveMsg', (msgInfo: any) => {
            // console.log(currentCvs,conversations)  //不论什么时候都是空值，未设置依赖项，闭包问题，永远记录创建监听时的状态值。
            setsocketMsg(msgInfo)
        })
    }, [])
    useEffect(() => {
        //监听到有人给自己发消息，但左边列表没有，重新获取列表即可（对方发消息的时候已经创建了对话）
        if (socketMsg && !conversations.find(item => item.friendInfo.id === socketMsg.conversationId)) {
            getmyConversations()  //重新获取后会自动触发获取最新消息
        }
         //监听到有人给自己发消息，左边列表也有，直接修改最新状态
        if (socketMsg && conversations.find(item => item.friendInfo.id === socketMsg.conversationId)) {
            setlastMsg((draft: any) => {
                draft[socketMsg.conversationId]['content'] = socketMsg.content
                draft[socketMsg.conversationId]['time'] = Date.now()
                draft[socketMsg.conversationId]['unread'] = draft[socketMsg.conversationId]['unread'] + 1
            })
        }
        //监听到有人给自己发消息，同时右边窗口打开的就是对方，刷新当前消息界面
        socketMsg && currentCvs?.friendInfo.id === socketMsg.senderId && setcurrentMsg(prev => [...prev, socketMsg])
    }, [socketMsg])  //加不加currentCvs都行，不加的话虽然Cvs切换过来socketMsg不重新添加进去，但数据库上已经有了，点击即请求

    useEffect(() => {
        //从其他网页调过来发消息的，直接打开右边消息界面即可，因为跳转的时候已经判断过了，没有的话就添加了
        if (searchParams.get('friendId') && conversations.length !== 0) {
            const cvs = conversations.find(item => item.friendInfo.id === Number(searchParams.get('friendId')))
            setcurrentCvs(cvs)
            getcurrentCvs(cvs.conversationId)
        }
    }, [conversations])

    useEffect(() => {
        //获取每个对话的最消息 
        if (conversations.length) {
            const cvsidArr = conversations.map(cvs => cvs.conversationId)
            lastMessage(cvsidArr,loginUser.id).then(res => setlastMsg(res.data.lastMsg))
        }
    }, [conversations])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [currentMsg])

    return (
        <>
            <div className='cnleft'>
                <div className="ltop"><MessageOutlined /></div>
                {
                    conversations.length !== 0 ? conversations.map(item => (
                        <div className="friend" onClick={() => showMsg(item)} key={item.conversationId} >
                            <Avatar size={50} src={<img src={item.friendInfo.avatarfile} alt="头像" />} />
                            <div className='friendinfo'>
                            <div className="badge">
                                    {lastMsg && <Badge size='small' overflowCount={99} count={lastMsg[item.conversationId]?.unread} />}
                                    </div>
                                <div className="itop">
                                    <div>{item.friendInfo.username}</div>
                                    <div className="tr">{lastMsg && lastMsg[item.conversationId]?.time && moment(lastMsg[item.conversationId]['time']).format('lll')}</div>
                                </div>
                                <div className="ibottom">
                                    {lastMsg && lastMsg[item.conversationId]?.content}
                                </div>
                            </div>
                        </div>
                    )) : <div className="empty">
                        <Empty
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                            imageStyle={{ height: 60 }}
                            description={
                                <span>
                                    暂无消息
                                </span>
                            }
                        >
                            <Button type="primary" onClick={() => navigate('/communication/contacts')}>找好友聊天</Button>
                        </Empty>
                    </div>
                }
            </div>
            <div className="msgright">
                {
                    currentCvs ?
                        <>
                            <div className="mtop">
                                {currentCvs.friendInfo.username}
                            </div>
                            <div className="mmiddle">
                                {currentMsg.length ? currentMsg.map(msg =>
                                    <div key={msg.time} ref={scrollRef}>
                                        <Message avatarUrl={msg.senderId === loginUser.id ? loginUser.avatarfile : currentCvs.friendInfo.avatarfile} content={msg.content} time={msg.time} own={msg.senderId === loginUser.id} />
                                    </div>) : <p className="nomsg">打开了对话，但未发送消息</p>}
                            </div>
                            <div className="mbottom">
                                <div className="operation"> 
                                    <UploadFile successUpload = {sendMsg} />
                                </div>
                                <textarea onChange={e => setSendtext(e.target.value)} value={sendtext} className="ta" name="" id="" cols={70} rows={4}></textarea>
                                <Button className="send" type="primary" shape="round" onClick={()=>sendMsg(sendtext)}><SendOutlined />发送</Button>
                            </div>
                        </> :
                        <>

                        </>
                }
            </div>
        </>
    )
}

export default memo(Conversations)