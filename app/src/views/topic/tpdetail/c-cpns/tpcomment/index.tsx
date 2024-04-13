import React, { memo, useState } from "react";
import sty from './tpcomment.module.scss'
import { CaretRightOutlined, MessageFilled, SendOutlined } from "@ant-design/icons";
import moment from "moment";
import Wangeditor from '@/components/wangeditor'
import { Avatar, Button } from "antd";
import { useAppSelector } from "@/store";
import { getCommentReply, publishReply } from "@/views/topic/server";
moment.locale('zh-cn')
interface IProps {
    commentInfo: any,
    callback1?:any
}
const Tpcomment: React.FC<IProps> = (props) => {
    const { commentInfo,callback1 } = props
    const { avatarfile, username, commenthtml, time, commentId, userId, topicId, receiveAvatar, receiveName } = commentInfo
    const loginUser = useAppSelector(state => state.loginReducer.userInfo)
    const [myreply, setMyreply] = useState<string>('')
    const [text, setText] = useState<string>('')
    const [show, setShow] = useState<boolean>(false)
    const Reply = () => {
        const postdata = {
            topicId,
            commentId,
            receiveId: userId,
            sendId: loginUser.id,
            time: Date.now(),
            replyhtml: myreply,
        }
        setShow(false)
        publishReply(postdata).then(
            (res) => {
                console.log(res.data)
                getCommentReply(topicId).then(
                    (res: any) => {
                        callback1(res.data.replyInfo)
                    }
                )
            }
        )
    }
    return (
        <div className={sty.tpcommentBox}>
            <div className={sty.top}>
                <Avatar src={avatarfile} shape="square" size={30} />
                <span>{username}</span>
                {receiveAvatar && <CaretRightOutlined />}
                {
                    receiveAvatar &&
                    <div className={sty.top}>
                        <Avatar src={receiveAvatar} shape="square" size={30} />
                        <span>{receiveName}</span>
                    </div>
                }
            </div>
            <div className={sty.middle} dangerouslySetInnerHTML={{ __html: commenthtml }}></div>
            <div className={sty.bottom}>
                <span>
                    {moment(time).format('lll')}
                </span>
                <div onClick={() => setShow(!show)}>
                    <MessageFilled /> 回复
                </div>
            </div>
            {
                show && <div className="publish" style={{ marginTop: 0 }}>
                    <div className='editor'>
                        <Wangeditor placeholder={`（回复${username}）👻(●ˇ∀ˇ●)...`} avatar={loginUser.avatarfile} height='54px' toolbarKeys={[
                            "emotion",
                            {
                                "key": "group-image",
                                "title": "图片",
                                "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>",
                                "menuKeys": [
                                    "uploadImage"
                                ]
                            }]} callback1={(html, text) => {
                                setMyreply(html)
                                setText(text)
                            }} />
                    </div>
                    <Button onClick={Reply} className={!text.trim() ? 'btn1' : 'btn1 btn2'} type="primary"><SendOutlined />回复</Button>
                </div>
            }
        </div>
    )
}

export default memo(Tpcomment)