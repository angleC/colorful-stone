/**
 * 符合layui define规范的HTML文件加载模块
 * 依赖：jquery、layer
 */
layui.define(['jquery', 'layer'], function(exports) {
    "use strict";
    
    var $ = layui.jquery,
        layer = layui.layer;

    // 核心对象
    var htmlLoader = {
        // 版本标识
        version: '1.0.0',
        
        /**
         * 加载HTML文件内容
         */
        loadHtml: function(url) {
            return new Promise((resolve, reject) => {
                fetch(url).then(function (response) {
                    if (!response.ok) {
                        throw new Error(`HTTP状态码：${response.status}`);
                    }
                    return response.text();
                }).then(function (html) {
                    resolve({
                        type: 'html',
                        url: url,
                        status: 'success',
                        content: html
                    });
                }).catch(function (error) {
                    console.info(`HTML内容加载失败：${url} - ${error.message}`);
                    reject({
                        type: 'html',
                        url: url,
                        status: 'error',
                        msg: error.message
                    });
                });
            });
        }
    };

    // 暴露模块，外部可通过 layui.use('htmlLoader') 调用
    exports('htmlLoader', htmlLoader);
});