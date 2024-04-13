import '@wangeditor/editor/dist/css/style.css' // 引入 css
import React, { useState, useEffect, useImperativeHandle } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import neuRequest from '@/utils/request'
import styles from './editor.module.scss'
import { Avatar } from 'antd'
// import { DomEditor } from '@wangeditor/editor'
interface IProps {
    callback1: (html: string, isEmpty: string) => void
    toolbarKeys?: any[],
    height?: string,
    avatar?:string,
    placeholder?:string,
    callback2?:any
}
const MyEditor = React.forwardRef((props:IProps,ref) => {
    const { callback1, toolbarKeys = null, height = '300px',avatar,placeholder='请输入内容👻(●ˇ∀ˇ●)...' } = props
    // editor 实例
    const [editor, setEditor] = useState<IDomEditor | null>(null)
    useImperativeHandle(ref,()=>{
        return {
            setHtml
        }
    })
    // 编辑器内容
    const [html, setHtml] = useState('')

    // 模拟 ajax 请求，异步设置 html
    // useEffect(() => {
    //     setTimeout(() => {
    //         setHtml('<p>hello world</p>')
    //     }, 500)
    // }, [])

    //用来查看工具栏属性的
    // const toolbar = DomEditor.getToolbar(editor as any)
    // console.log(toolbar?.getConfig().toolbarKeys)

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {}
    if (toolbarKeys) {
        toolbarConfig.toolbarKeys = toolbarKeys
    } else {
        toolbarConfig.excludeKeys = [
            'group-video',
            '|'
        ]
    }
    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        placeholder,
        MENU_CONF: {}
    }
    editorConfig.MENU_CONF!['uploadImage'] = {
        async customUpload(file: File, insertFn: any) {
            let formData = new FormData();
            formData.append("uploadimg", file);
            const res = await neuRequest.post('/api/uploadimg', formData)
            if (res.data.ok === 1) {
                const { url, alt } = res.data.message
                //插入操作 ,url:图片url，alt：图片alt，href：图片href            
                insertFn(url, alt)
            }
        },
    }

    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    return (
        <div className={styles.editorBox}>
            {avatar && <div className={styles.avatar}><Avatar src={avatar} shape='square' size={54}/></div>}
            <div className={styles.editorInput}>
                <div className={styles.toolbar}>
                    <Toolbar
                        editor={editor}
                        defaultConfig={toolbarConfig}
                        mode="default"
                    />

                </div>
                <div className={styles.editor}>
                    <Editor
                        defaultConfig={editorConfig}
                        value={html}
                        onCreated={setEditor}
                        onChange={editor => {
                            setHtml(editor.getHtml())
                            callback1(editor.getHtml(), editor.getText())
                        }}
                        mode="default"
                        style={{ height: height, overflowY: 'hidden' }}
                    />
                </div>
            </div>
        </div>
    )
}
)
export default MyEditor