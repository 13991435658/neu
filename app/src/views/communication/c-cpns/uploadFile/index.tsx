import { FileOutlined, FolderAddOutlined, PictureOutlined, UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Modal, Progress, Upload } from 'antd';
import { useRef, useState } from 'react';
import SparkMD5 from 'spark-md5';
import { getfileExistInfo, mergeChunk, uploadChunk } from '../../server';
interface IProps {
    successUpload: (content: string) => void
}
const UploadFile = (props: IProps) => {
    const { successUpload } = props
    const hashRef = useRef('')
    const suffixRef = useRef('')
    const [file, setfile] = useState<any>(null)
    const [percent, setpercent] = useState(0)
    const [progressShow, setprogressShow] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const conicColors = {
        '0%': '#87d068',
        '50%': '#ffe58f',
        '100%': '#ffccc7',
    };
    const handleOk = () => {
        uploadFile(file)
        setIsModalOpen(false)
    }
    const handleCancel = () => setIsModalOpen(false)
    const getIcon = (filetype: string) => {
        const type = filetype.split('/')[0]
        if (type === 'image') return <PictureOutlined />
        if (type === 'video') return <VideoCameraOutlined />
        return <FileOutlined />
    }
    const getfileType = (filetype: string) => {
        const type = filetype.split('/')[0]
        if (type !== 'image' && type !== 'video') return 'file'
        return type
    }
    const handleChange = (info: any) => {
        setIsModalOpen(true)
        setfile(info.file)
    }
    const getHash = (file: any): Promise<{ hash: string, suffix: string }> => {
        return new Promise((resolve) => {
            let hash,
                suffix = file.name.split('.').pop()
            const fileReader = new FileReader()
            fileReader.readAsArrayBuffer(file)
            fileReader.onload = (ev) => {
                let spark = new SparkMD5.ArrayBuffer()
                spark.append((ev.target as any).result)
                hash = spark.end()
                resolve({
                    hash,
                    suffix
                })
            }
        })
    }

    const sliceFile = (file: any, chunkSize = 1024 * 100, maxNum = 100) => {
        let count = file.size / chunkSize
        if (count > maxNum) {
            chunkSize = Math.ceil(file.size / maxNum)
            count = 100
        }
        const chunkList = []
        let chunkIndex = 0
        while (chunkIndex < count) {
            chunkList.push({
                file: file.slice(chunkIndex * chunkSize, (chunkIndex + 1) * chunkSize),
                filename: `${hashRef.current}-${chunkIndex}`
            })
            chunkIndex++
        }
        return chunkList
    }


    const uploadFile = async (file: any) => {
        console.log(file)
        if (!file) return
        setprogressShow(true)
        //1.先获取hash
        const { hash, suffix } = await getHash(file)
        hashRef.current = hash
        suffixRef.current = suffix
        const data = {
            hash: hashRef.current,
            suffix: suffixRef.current
        }
        //2.判断文件是否已经存在,并获取已经传过的chunk
        let existChunkList: any[] = []
        const { data: fileExistInfo } = await getfileExistInfo(data)
        if (fileExistInfo.ok === 1) {
            console.log('文件已存在')
            setpercent(100)
            setTimeout(() => {
                setprogressShow(false)
            }, 1000);
            const filecontent = getfileType(file.type) + '-_-' + file.name + '-_-' + fileExistInfo.filepath+'-_-'+fileExistInfo.size
            successUpload(filecontent)
            return
        } else {
            existChunkList = fileExistInfo.existChunkList
        }
        //3.开始切片
        const chunkList = sliceFile(file)
        // const sliceFileWorker = new Worker('./sliceFileWorker.js');
        // sliceFileWorker.postMessage({ file, existChunkList,hash });
        // sliceFileWorker.onmessage = (event) => {
        //     const chunkList = event.data;
        //     uploadChunks(chunkList);
        // };

        //4.切片上传     5.合并
        let loaded = 0
        let total = chunkList.length
        const complete = () => {
            if (loaded < total) return
            setTimeout(() => {
                setprogressShow(false)
            }, 1000);
            mergeChunk(data).then(res => {
                if (res.data.ok === 1) {
                    console.log(`合并成功,路径：${res.data.filepath}`)
                }
                const filecontent = getfileType(file.type) + '-_-' + file.name + '-_-' + res.data.filepath+'-_-'+res.data.size
                successUpload(filecontent)
            })
        }
        chunkList.forEach((chunk) => {
            if (existChunkList.length && existChunkList.includes(chunk.filename)) {
                setpercent(Math.ceil(++loaded / total))
                complete()
            } else {
                const fm = new FormData()
                fm.append('file', chunk.file)
                fm.append('filename', chunk.filename)
                uploadChunk(fm).then(res => {
                    if (res.data.ok === 1) {
                        setpercent(Math.ceil(++loaded / total) * 100)
                        complete()
                    }
                })
            }
        })
    }

    return (
        <div>
            <Upload onChange={handleChange} showUploadList={false} beforeUpload={() => false}>
                <Button shape="circle" icon={<FolderAddOutlined />}></Button>
                <div style={{ width: '300px' }}>
                    {progressShow && <Progress percent={percent} strokeWidth={5} strokeColor={conicColors}></Progress>}
                </div>
            </Upload>
            <Modal title="发送下面文件？" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>{file?.name}</p>
            </Modal>
        </div>
    )
};
export default UploadFile;