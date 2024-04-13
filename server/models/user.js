const db = require("../db/dbconfig");
const userModel = {
    getAlluser: (query) => {
        const { userId } = query
        return db.query('select * from users where id!=?', [userId])
    },
    getRecommendUser: (query) => {
        const { userId } = query
        return db.query('select * from users where id!=?', [userId])
    },
    getGrouplist: async (query) => {
        const { userId } = query
        const [res] = await db.query(`select * from groups where userlist like '%${userId}%' order by groupId desc`)
        return res
    },
    read: (body)=>{
        const {chatId,userId} = body
        return db.query(`delete from unread where chatId=${chatId} and userId=${userId}`)
    },
    followUser: (body) => {
        const { followId, isfollowedId } = body
        return db.query('insert into follows (followId,isfollowedId) values (?,?)', [followId, isfollowedId])
    },
    unreadAdd: async (body) => {
        const { chatId, userlist } = body
        console.log(chatId,userlist)
        for (let id of userlist) {
            const [res] = await db.query(`select * from unread where chatId=${chatId} and userId=${id}`)
            if (res.length) {
                db.query(`update unread set unreadnum = unreadnum+1 where chatId=${chatId} and userId=${id}`)
            } else {
                db.query(`insert into unread (chatId,userId,unreadnum) values (${chatId},${id},1)`)
            }
        }
    },
    unfollowUser: (query) => {
        const { followId, isfollowedId } = query
        return db.query('delete from follows where followId=? and isfollowedId=?', [followId, isfollowedId])
    },
    myfollow: (id) => {
        return db.query('select * from follows where followId=?', [id])
    },
    followme: (id) => {
        return db.query('select * from follows where isfollowedId=?', [id])
    },
    matchConversation: (query) => {
        const { currentId, targetId } = query
        return db.query('select * from conversations where (currentId=? and targetId=?) or (currentId=? and targetId=?)', [currentId, targetId, targetId, currentId])
    },
    createGroup: (userlist) => {
        return db.query('insert into groups (userlist) values (?)', [userlist])
    },
    addConversation: (query) => {
        const { currentId, targetId } = query
        return db.query('insert into conversations (currentId,targetId) values (?,?)', [currentId, targetId])
    },
    getConversations: (id) => {
        return db.query('select * from conversations where currentId=? or targetid=?', [id, id])
    },
    getMessages: (id) => {
        return db.query('select * from messages where conversationId=?', [id])
    },
    sendMessage: (conversationId, senderId, content, time) => {
        return db.query('insert into messages (conversationId,senderId,content,time) values (?,?,?,?)', [conversationId, senderId, content, time])
    },
    lastMessage: async (body) => {
        const { cvsidArr,userId } = body
        const result = {}
        for (cvsid of cvsidArr) {
            const sql = `select * from messages where conversationId=? order by time desc limit 1`
            const [res] = await db.query(sql, [cvsid])
            const [unread] = await db.query(`select u.unreadnum from unread u where chatId=${cvsid} and userId=${userId}`)
            const unreadNum = !unread[0]?0:unread[0]['unreadnum']
            res.length !== 0 ? result[cvsid] = { 'content': res[0]['content'], 'time': res[0]['time'],'unread':unreadNum } : result[cvsid] = { 'content': '', time: '','unread':unreadNum }
        }
        return result
    }
}

module.exports = userModel