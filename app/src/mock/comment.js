import Mock from 'mockjs'
const Random = Mock.Random
export const MockComment = Mock.mock('/mockcomment', 'get', () => {
    const comment = Mock.mock({
        'commentInfo|10': [
            {
                username: '@cword(4,8)',
                avatar: function(){
                    return Random.image('100x100', Random.color(), Random.color(), 'png', Random.cword())
                },
                comment: '@csentence(20,60)',
                time: function () {
                    return Random.datetime('yyyy-MM-dd HH:mm')
                }
            }
        ]
    })
    return comment
})
