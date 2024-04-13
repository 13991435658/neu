// sliceFileWorker.js
export {}
// 监听主线程发送的消息
onmessage = function (event) {
    const { file, existChunkList,hash } = event.data;
    // 调用切片函数，将文件切片后发送给主线程
    const chunkList = sliceFile(file, existChunkList,hash);
    postMessage(chunkList);
};

// 切片函数
function sliceFile(file:any, existChunkList:any[],hash:string) {
    const chunkList = [];
    let chunkSize = 1024 * 100;
    const maxNum = 100;
    let count = Math.ceil(file.size / chunkSize);
    if (count > maxNum) {
        chunkSize = Math.ceil(file.size / maxNum);
        count = 100;
    }
    let chunkIndex = 0;
    while (chunkIndex < count) {
        const start = chunkIndex * chunkSize;
        const end = Math.min((chunkIndex + 1) * chunkSize, file.size);
        const chunk = file.slice(start, end);
        const filename = `${hash}-${chunkIndex}`;
        // 判断该切片是否已上传过，如果上传过则不再重复上传
        if (!existChunkList.includes(filename)) {
            chunkList.push({
                file: chunk,
                filename: filename
            });
        }
        chunkIndex++;
    }
    return chunkList;
}
