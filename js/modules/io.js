layui.define(function (exports) {    
    var $ = layui.jquery,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element;

    let MOD_NAME = 'io';

    var io = {
        read_file:function(options){
            var that = this;
            var options = options;
            // 1. 创建 FileReader 实例
            const reader = new FileReader();
            // 2. 监听读取完成事件（成功）
            reader.onload = function(e) {
                // e.target.result 是读取到的文件内容
                const content = e.target.result;

                console.log('文件内容：', content);
                if(typeof options.onload ==='function'){
                    options.onload(content);
                }
            };

            // 3. 监听读取错误事件
            reader.onerror = function() {
                alert('文件读取失败：' + reader.error.message);
                if(typeof options.onerror ==='function'){
                    options.onerror(reader.error);
                }
            };

            // 4. 根据文件类型选择读取方式（这里以文本为例）
            // readAsText：读取为文本（支持指定编码，默认 UTF-8）
            // readAsDataURL：读取为 Base64 编码（适合图片、视频等）
            // readAsArrayBuffer：读取为二进制数组（适合处理二进制文件）
            reader.readAsText(selectedFile, 'UTF-8');
        }
    }

    exports(MOD_NAME, io);
});