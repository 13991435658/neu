import React, { memo, useEffect, useRef, useState } from 'react'
import styles from './tpdetail.module.scss'
import classNames from 'classnames'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { getCommentReply, getTopicComment, getTopicDetail, publishComment } from '../server'
import Wangeditor from '@/components/wangeditor'
import { Button, Empty } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import '@/mock/comment'
import Tpcomment from './c-cpns/tpcomment'
import Usercard from '@/components/usercard'
import Cpn2 from '../cpn2'

interface IProps {

}
const Topic: React.FC<IProps> = (props) => {
    const loginUser = useAppSelector(state => state.loginReducer.userInfo)
    const [mycomment, setMycomment] = useState<string>('')
    const [comment, setComment] = useState<any>(null)
    const [text, setText] = useState<string>('')
    const [allreplys, setallreplys] = useState<any[]>([])
    const [searchparams] = useSearchParams()
    const [currentTopicId,setcurrentTopicId] = useState(Number(searchparams.get('topicId')))
    const [detail, setDetail] = useState<any>(null)
    const publishRef = useRef<any>(null)
    const editorRef = useRef<any>(null)
    const Publish = () => {
        const postdata = {
            topicId: currentTopicId,
            userId: loginUser.id,
            commenthtml: mycomment,
            time: Date.now()
        }
        editorRef.current.setHtml('')
        publishComment(postdata).then(
            res => console.log(res.data)
        )
        getTopicComment(currentTopicId).then(
            res => {
                res.data.commentInfo.length && setComment(res.data.commentInfo)
            }
        )
    }
    // console.log(new URLSearchParams(location.search).get('topicId'))  location.search:'?topicId=5' 
    useEffect(() => {
        getTopicDetail(currentTopicId).then(
            (res: any) => {
                if (res.data.ok === 1) {
                    setDetail(res.data.detail)
                }
            }
        )
        getTopicComment(currentTopicId).then(
            res => {
                 setComment(res.data.commentInfo)
            }
        )
        getCommentReply(currentTopicId).then(
            (res: any) => {
                setallreplys(res.data.replyInfo)
            }
        )
        // neuRequest.get('/mockcomment').then(
        //     res => {
        //         setComment(res.data)
        //         console.log(res.data)
        //     }
        // )
    }, [currentTopicId])
    return (
        detail &&
        <div className={classNames(styles.tpdetailBox, 'wrap-v2')}>
            <div className="tpdcontent">
                <div className="tpdtitle">
                    {detail.title}
                </div>
                <div className="tpdhtml">
                    <div onClick={() =>
                        publishRef.current.scrollIntoView({ behavior: 'smooth' })
                    } className="tpdtips">
                        {comment ? `查看全部${comment?.length}条评论` : '暂无评论🥶...去评论'}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: detail.detail }} className="tpdhtml"></div>
                    <div className="publish">
                        <div ref={publishRef} className='editor'>
                            <Wangeditor ref={editorRef} avatar={loginUser.avatarfile} height='54px' toolbarKeys={[
                                "emotion",
                                {
                                    "key": "group-image",
                                    "title": "图片",
                                    "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>",
                                    "menuKeys": [
                                        "uploadImage"
                                    ]
                                }]} callback1={(html, text) => {
                                    setMycomment(html)
                                    setText(text)
                                }} />
                        </div>
                        <Button onClick={Publish} className={!text.trim() ? 'btn1' : 'btn1 btn2'} type="primary"><SendOutlined />发布</Button>
                    </div>
                    {
                        comment ? <div className="comment">
                            <div className="commenttop">
                                共{comment.length}条评论
                            </div>
                            <div className="commentmiddle">
                                {
                                    comment.map((item: any) => {
                                        const replyArr = allreplys.filter(reply => {
                                            return reply.commentId === item.commentId
                                        })
                                        return (
                                            <div key={item.commentId}>
                                                <Tpcomment callback1={setallreplys} commentInfo={item}/>
                                                {
                                                    replyArr.map(item => {
                                                        const replyInfo = {
                                                            avatarfile: item.avatarfile,
                                                            username: item.username,
                                                            commenthtml: item.replyhtml,
                                                            time: item.time,
                                                            commentId: item.commentId,
                                                            userId: item.sendId,
                                                            topicId: item.topicId,
                                                            receiveAvatar: item.receiveAvatar,
                                                            receiveName: item.receiveName,
                                                        }
                                                        return <div key={item.replyId}  style={{ margin: '15px 0 0 40px' }}>
                                                            <Tpcomment callback1={setallreplys} commentInfo={replyInfo} />
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        )
                                    }
                                    )
                                }
                                {
                                    comment.length > 5 ?
                                        <div style={{ cursor: 'pointer' }} className='commentbottom'>点击查看更多评论 ＞</div>
                                        :
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='没有更多了...' />
                                }
                            </div>
                        </div> :
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='还没人评论...' />
                    }
                </div>
            </div>
            <div className="tpdright">
                <div className='tpdusercard'>
                    <Usercard own={loginUser.id===detail.userId} userId={detail.userId} panel1text='话题'  />
                </div>
                <div className='tpdrecommend'>
                    <Cpn2 setcurrentTopicId={setcurrentTopicId} />
                </div>
            </div>
        </div>
    )
}

export default memo(Topic)