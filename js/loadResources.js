layui.define(['scriptLoader', 'htmlLoader'], function (exports) {
    "use strict";
    var scriptLoader = layui.scriptLoader,
        htmlLoader = layui.htmlLoader;

    var loadResources = {
        version: '1.0.0',
        MOD_NAME: 'loadResources',
        /**
         * 异步加载单个JS文件
         */
        loadJS: function (url) {
            return scriptLoader.loadScript(url);
        },
        /**
         * 新增：异步加载JSON文件
         */
        loadJSON: function (url) {
            return new Promise((resolve, reject) => {
                fetch(url)
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error(`HTTP状态码：${response.status}`);
                        }
                        // 解析JSON数据
                        return response.json();
                    }).then(function (jsonData) {
                        resolve({
                            type: 'json',
                            url: url,
                            status: 'success',
                            data: jsonData // 存储解析后的JSON数据
                        });
                    }).catch(function (error) {
                        console.info(`JSON文件加载/解析失败：${url} - ${error.message}`);
                        reject({
                            type: 'json',
                            url: url,
                            status: 'error',
                            msg: error.message
                        });
                    });
            });
        },
        /**
         * 异步加载HTML内容
         * @param {string} url - HTML片段URL
         * @returns {Promise}
         */
        loadHTML: function (url) {
            return htmlLoader.loadHtml(url);
        },

        /**
         * 批量加载资源（核心方法）
         * @param {Object} options - 配置项
         * @param {string[]} options.jsUrls - JS文件URL数组
         * @param {string[]} options.htmlUrls - HTML文件URL数组
         * @param {string[]} options.jsonUrls - HTML文件URL数组
         * @param {Function} success - 全部加载成功的回调
         * @param {Function} error - 加载失败的回调（可选）
         * @param {boolean} options.ignoreError - 是否忽略部分失败（默认false）
         */
        loadAll: function (options, success, error) {
            var that = this;
            // 参数兼容处理（符合layui易用性风格）
            options = options || {};
            options.jsUrls = options.jsUrls || [];
            options.htmlUrls = options.htmlUrls || [];
            options.jsonUrls = options.jsonUrls || []; // 新增JSON配置项
            options.ignoreError = options.ignoreError || false;

            // 收集所有加载任务
            var tasks = [];

            // 添加JS加载任务
            if (Array.isArray(options.jsUrls) && options.jsUrls.length > 0) {
                options.jsUrls.forEach(function (url) {
                    if (!that.isEmpty(url)) {
                        tasks.push(that.loadJS(url));
                    }
                });
            }

            // 添加HTML加载任务
            if (Array.isArray(options.htmlUrls) && options.htmlUrls.length > 0) {
                options.htmlUrls.forEach(function (url) {
                    if (!that.isEmpty(url)) {
                        tasks.push(that.loadHTML(url));
                    }
                });
            }

            // 新增：添加JSON加载任务
            if (Array.isArray(options.jsonUrls) && options.jsonUrls.length > 0) {
                options.jsonUrls.forEach(function (url) {
                    if (!that.isEmpty(url)) {
                        tasks.push(that.loadJSON(url));
                    }
                });
            }
            // 无任务时直接执行成功回调
            if (tasks.length === 0) {
                typeof success === 'function' && success([]);
                return;
            }
            // 5. 核心修复：直接处理Promise逻辑，避免中间变量导致的类型问题
            try {
                if (options.ignoreError) {
                    // 方案1：优先用原生allSettled，否则手动处理（确保参数是纯数组）
                    const allSettled = Promise.allSettled || function (promises) {
                        return Promise.all(Array.from(promises).map(p =>
                            p.then(v => ({ status: 'fulfilled', value: v }))
                                .catch(e => ({ status: 'rejected', reason: e }))
                        ));
                    };

                    allSettled(Array.from(tasks)) // 强制转为Array类型
                        .then(function (results) {
                            var finalResults = [];
                            results.forEach(function (item) {
                                finalResults.push(item.status === 'fulfilled' ? item.value : item.reason);
                            });
                            typeof success === 'function' && success(finalResults);
                        })
                        .catch(function (err) {
                            typeof error === 'function' && error([{ type: 'system', status: 'error', msg: err.message }]);
                        });
                } else {
                    // 方案2：直接使用Promise.all，强制转为Array类型
                    Promise.all(Array.from(tasks))
                        .then(function (results) {
                            typeof success === 'function' && success(results);
                        })
                        .catch(function (err) {
                            // 捕获第一个失败的Promise，格式化结果
                            const errResult = { type: 'system', status: 'error', msg: err.message };
                            typeof error === 'function' && error([errResult]);
                        });
                }
            } catch (systemError) {
                // 捕获同步错误（比如Promise方法调用失败）
                typeof error === 'function' && error([{
                    type: 'system',
                    status: 'error',
                    msg: `系统错误：${systemError.message}`
                }]);
            }
        },
        isEmpty: function (value) {
            // 先判断是否为 undefined 或 null，再判断是否为空字符串
            return value === undefined || value === null || value === "";
        }
    };


    exports(loadResources.MOD_NAME, loadResources);
});