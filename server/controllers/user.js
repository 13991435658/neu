const userModel = require("../models/user")


const userCtrl = {
    getAlluser: async (req, res) => {
        const [result] = await userModel.getAlluser(req.query)
        res.send({
            ok: 1,
            allUser: result
        })
    },
    read:async (req,res)=>{
        await userModel.read(req.body)
        res.send({
            ok:1
        })
    },
    getRecommmendUser: async (req, res) => {
        const [result] = await userModel.getRecommendUser(req.query)
        res.send({
            ok: 1,
            recommendUser: result.sort(() => Math.random() > 0.5 ? -1 : 1)
        })
    },
    getGrouplist: async (req,res)=>{
        const result = await userModel.getGrouplist(req.query)
        const result1 = result.map((item) => ({
            groupId: item.groupId,
            userlist: JSON.parse(item.userlist)
        }))
        res.send({
            ok:1,
            grouplist:result1
        })
    },
    unreadAdd:async (req,res)=>{
        await userModel.unreadAdd(req.body)
        res.send({
            ok:1
        })
    },
    creategroup:async (req,res)=>{
        const [result] = await userModel.createGroup(req.body.userlist)
        res.send({
            ok:1,
            insertgroup:{
                groupId:result.insertId,
                userlist:JSON.parse(req.body.userlist)
            },
            message:'创建成功'
        })
    },
    followUser: async (req, res) => {
        try {
            await userModel.followUser(req.body)
            res.send({
                ok: 1,
                message: '关注成功'
            })
        } catch {
            res.status(401).send({
                ok: 0,
                message: '服务器错误'
            })
        }
    },
    unfollowUser: async (req, res) => {
        try {
            await userModel.unfollowUser(req.query)
            res.send({
                ok: 1,
                message: '取关成功'
            })
        } catch {
            res.status(401).send({
                ok: 0,
                message: '服务器错误'
            })
        }
    },
    getfollowInfo: async (req, res) => {
        const [myfollowInfo] = await userModel.myfollow(req.body.id)
        const [followmeInfo] = await userModel.followme(req.body.id)
        const myfollowArr = myfollowInfo.map(item => item.isfollowedId)
        const followmeArr = followmeInfo.map(item => item.followId)
        res.send({
            ok: 1,
            myfollowArr,
            followmeArr
        })
    },
    addConversation: async (req, res) => {
        const [result] = await userModel.matchConversation(req.query)
        if (result.length) {
            res.send({
                ok: 0,
                message: '对话已存在'
            })
        } else {
            await userModel.addConversation(req.query)
            res.send({
                ok: 1,
                message: '创建新对话'
            })
        }
    },
    getConversations: async (req, res) => {
        const [result] = await userModel.getConversations(req.params.id)
        if (result.length) {
            res.send({
                ok: 1,
                conversations: result
            })
        } else {
            res.send({
                ok: 0,
                message: '暂无对话'
            })
        }
    },
    getMessages: async (req, res) => {
        const [result] = await userModel.getMessages(req.params.id)
        if (result.length) {
            res.send({
                ok: 1,
                messages: result.sort((a,b)=>a.time-b.time)
            })
        } else {
            res.send({
                ok: 0,
                message: '暂无消息'
            })
        }
    },
    sendMessage: async (req, res) => {
        const {conversationId,senderId,content} = req.body
        const time = Date.now()
        try {
            await userModel.sendMessage(conversationId,senderId,content,time)
            res.send({
                ok: 1,
                message: {
                    conversationId,
                    senderId,
                    content,
                    time
                }
            })
        } catch {
            res.status(401).send({
                ok: 0,
                message: '服务器错误'
            })
        }
    },
    lastMessage:async (req,res)=>{
        const result = await userModel.lastMessage(req.body)
        res.send({
            ok:1,
            lastMsg:result
        })
    }
}

module.exports = userCtrl