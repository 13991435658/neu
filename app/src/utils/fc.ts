type Tship<T,Y> = (target:T,myfollowArr:number[],followmeArr:number[])=>Y

const relationship:Tship<number,number> = (target,myfollowArr,followmeArr) => {
    const num = (myfollowArr.includes(target) ? 1 : 0) + (followmeArr.includes(target) ? 1 : 0)
    if (num === 1) {
        return myfollowArr.includes(target) ? 1 : -1
    }
    return num
}

const shipArr:Tship<any[],Array<any[]>> = (userArr,myfollowArr,followmeArr)=>{
    const myfollow = userArr.filter(user=>relationship(user.id,myfollowArr,followmeArr)===1)
    const followme = userArr.filter(user=>relationship(user.id,myfollowArr,followmeArr)===-1)
    const friend = userArr.filter(user=>relationship(user.id,myfollowArr,followmeArr)===2)
    return [myfollow,followme,friend]
}

export {relationship,shipArr}