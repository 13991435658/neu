import React, { memo, useState } from "react";
import { Button, Form, Input, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useAppSelector } from "@/store";
import styles from './tppublish.module.scss'
import classNames from "classnames";    
import Wangeditor from '@/components/wangeditor'
import { publishTopic } from "../server";
interface IProps { }

const Founditem: React.FC<IProps> = (props) => {
    const loginUser = useAppSelector(state => state.loginReducer.userInfo)
    const [title,settitle] = useState<string>('')
    const [imageUrl, setImageUrl] = useState<string>()
    const [html,sethtml] = useState<string>('')
    const onFinish = (values: any) => {
        const formData = new FormData()
        for (let i in values) {
            formData.append(i, values[i])
        }
        if(values.cover){
            formData.append('cover',values.cover.file)
        }
        formData.append('userId', loginUser.id)
        formData.append('detail',html)
        formData.append('title',title)
        formData.append('time', Date.now() as any)
        publishTopic(formData).then(res=>{
            res.data.ok===1?message.success('发布成功'):message.error('服务器问题')
        })
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    const imgChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        setImageUrl(URL.createObjectURL(info.file as any))
    };
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8, fontSize: '12px' }}>添加话题封面</div>
        </div>
    );
    return (
        <div className={classNames(styles.tppublishBox,'wrap-v3')}>
            <div className="tpptitle">写话题</div>
            <input value={title} onChange={(e)=>settitle(e.target.value)} placeholder="请输入标题(最多50字)" className="tpinput"/>
            <Form
                name="basic"
                style={{ maxWidth: 800 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Wangeditor callback1={(arg)=>sethtml(arg)}/>
                <Form.Item
                    label="话题标签"
                    name="label"
                    wrapperCol={{ span: 12 }}
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="标签" />
                </Form.Item>

                <Form.Item
                    label="封面(选填)"
                    name="cover"
                // valuePropName="fileList"     //这两行解决Upload在Form里的报错
                // getValueFromEvent={normFile}
                >
                    <Upload
                        name="cover"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action=""
                        beforeUpload={() => false}
                        onChange={imgChange}
                    >
                        {imageUrl ? <img src={imageUrl} alt="话题封面" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </Form.Item>
                {/* <Form.Item
                    label="详细描述"
                    name="detail"
                    wrapperCol={{ span: 20 }}
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Wangeditor/>
                </Form.Item> */}

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
        
    )
}

export default memo(Founditem)