import React, { memo } from "react";
import Avatar from "antd/es/avatar/avatar";
import styles from './msgcss/msg.module.scss'
import moment from "moment";
import 'moment/locale/zh-cn'
import { FileOutlined, PictureOutlined, VideoCameraOutlined } from "@ant-design/icons";
moment.locale('zh-cn')
interface IProps {
    own: boolean
    content: string
    avatarUrl: string
    time: number
}
const MsgLeft: React.FC<IProps> = (props) => {
    const { own, content, avatarUrl, time } = props
    const isFile = () => content.split('-_-')[2]?.startsWith('http:\\localhost:9000')
    const getIcon = () => {
        const type = content.split('-_-')[0]
        if (type === 'image') return <PictureOutlined />
        if (type === 'video') return <VideoCameraOutlined />
        return <FileOutlined />
    }
    const fileDownload = (fileUrl: string, filename: string) => {
        try {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.target = '_blank'
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch {

        }
    }
    const arr = content.split('-_-')
    const type = arr[0]
    const filename = arr[1]
    let fileurl = arr[2]
    if (fileurl) {
        const temp = fileurl.replace(/http:\\/, 'http://')
        fileurl = temp.replace(/ \\/g, '/')
    }
    const size = arr[3]
    return (
        <div className={styles.msgBox}>
            <div className={own ? 'msg msgr' : 'msg'}>
                <Avatar src={avatarUrl} size={39} />
                <div className="msgtext">
                    {!isFile() ? <div className="msgcontent">{content}</div>
                        : (type === 'file' ? <div className="msgfile" onClick={() => fileDownload(fileurl, filename)}>
                            <FileOutlined />
                            <div className="filename">
                                <div className="name">{filename}</div>
                                <div className="size">{size}</div>
                            </div>
                        </div> :
                            <div className="srcitem">
                                {
                                    type === 'image' ? <img src={fileurl} alt="已过期" /> : 
                                    <video  controls src={fileurl}>
                                        <source src={fileurl} />
                                    </video>
                                }
                            </div>
                        )
                    }
                    <div className="time">{moment(time).format('lll')}</div>
                </div>
            </div>
        </div>
    )
}

export default memo(MsgLeft)