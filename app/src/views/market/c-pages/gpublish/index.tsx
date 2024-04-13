import React, { memo, useState } from "react";
import { Button, Form, Input, Select, Upload, message,InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { addressArr, categoryArr, newArr } from "@/assets/data/local-data";
import { useAppSelector } from "@/store";
import { publishGoods } from "../../server";
import { useDispatch } from "react-redux";
import { AsyncGetAllgoods } from "../../store";

interface IProps{}

const Gpublish:React.FC<IProps> = (props)=>{
    const { TextArea } = Input;
    const dispatch = useDispatch<any>()
    const loginUser = useAppSelector(state=>state.loginReducer.userInfo)
    const [imageUrl,setImageUrl] = useState<string>()
    const onFinish = (values: any) => {
        const formData = new FormData()
        for (let i in values) {
            formData.append(i, values[i])
        }
        formData.append('userId',loginUser.id)
        formData.append('goodsimgfile', values.goodsimg.file)
        formData.append('time',Date.now() as any)
        publishGoods(formData).then(
            res=>{
                res.data.ok?message.success('发布成功'):message.error('服务器错误')
                dispatch(AsyncGetAllgoods())
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
                    label="商品名"
                    name="title"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="title" />
                </Form.Item>

                <Form.Item
                    label="价格"
                    name="price"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <InputNumber prefix="￥" min={1} max={2000}/>
                </Form.Item>

                <Form.Item
                    label="新旧程度"
                    name="newdegree"
                    initialValue={6}
                >
                    <Select
                        style={{ width: 120 }}
                        options={newArr.map((item,index)=>({
                            value:index,
                            label:item
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="位置"
                    name="address"
                    initialValue={0}
                >
                    <Select
                        style={{ width: 120 }}
                        options={addressArr.map((item,index)=>({
                            value:index,
                            label:item
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="物品种类"
                    name="category"
                    initialValue={0}
                >
                    <Select
                        style={{ width: 120 }}
                        options={categoryArr.map((item,index)=>({
                            value:index,
                            label:item
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="商品备注"
                    name="remark"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <TextArea rows={3} placeholder="maxLength is 100" maxLength={100} />
                </Form.Item>
                
                <Form.Item
                    label="产品图片"
                    name="goodsimg"
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
                        {imageUrl ? <img src={imageUrl} alt="商品图" style={{ width: '100%' }} /> : uploadButton}
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

export default memo(Gpublish)