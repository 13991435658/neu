import React, { memo, useState } from "react";
import { Button, Form, Input, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useAppSelector } from "@/store";
import { publishFounditem } from "../../server";

interface IProps { }

const Lostitem: React.FC<IProps> = (props) => {
    const { TextArea } = Input;
    const loginUser = useAppSelector(state => state.loginReducer.userInfo)
    const [imageUrl, setImageUrl] = useState<string>()
    const onFinish = (values: any) => {
        const formData = new FormData()
        for (let i in values) {
            formData.append(i, values[i])
        }
        formData.append('userId', loginUser.id)
        formData.append('type','1')
        formData.append('itemimgfile', values.itemimg.file)
        formData.append('time', Date.now() as any)
        publishFounditem(formData).then(
            res => {
                console.log(res.data)
                res.data.ok ? message.success('发布成功') : message.error('服务器错误')
            }
        )
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
            <div style={{ marginTop: 8, fontSize: '12px' }}>点击上传</div>
        </div>
    );
    return (
        <div>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="丢失的物品"
                    name="itemname"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="item" />
                </Form.Item>

                <Form.Item
                    label="详细描述"
                    name="detailInfo"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <TextArea rows={3} placeholder="maxLength is 100" maxLength={100} />
                </Form.Item>

                <Form.Item
                    label="丢失位置"
                    name="address"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="address" />
                </Form.Item>

                <Form.Item
                    label="联系方式"
                    name="contact"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="title" />
                </Form.Item>

                <Form.Item
                    label="物品图片"
                    name="itemimg"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                // valuePropName="fileList"     //这两行解决Upload在Form里的报错
                // getValueFromEvent={normFile}
                >
                    <Upload
                        name="goodsimg"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action=""
                        beforeUpload={() => false}
                        onChange={imgChange}
                    >
                        {imageUrl ? <img src={imageUrl} alt="物品图" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        submit
                    </Button>
                </Form.Item>

            </Form>
        </div>
    )
}

export default memo(Lostitem)