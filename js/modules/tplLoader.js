/**
 * 符合layui define规范的HTML模板加载&渲染模块
 * 依赖：jquery、layer、laytpl
 * 功能：读取HTML模板文件 + 用JSON数据渲染laytpl模板 + 输出到指定容器
 */
layui.define(['jquery', 'layer', 'laytpl', 'htmlLoader'], function (exports) {
    "use strict";

    var $ = layui.jquery,
        layer = layui.layer,
        laytpl = layui.laytpl,
        htmlLoader = layui.htmlLoader;

    // 核心对象
    var tplLoader = {
        version: '1.0.0',

        /**
         * 加载并渲染HTML模板
         * @param {Object} options 配置项
         * @param {String} options.tplUrl 模板文件URL（必填，存放laytpl语法的HTML文件）
         * @param {Object} [options.data={}] 模板渲染的JSON数据（默认空对象）
         * @param {Boolean} [options.showLoading=true] 是否显示加载中提示
         * @param {Function} [options.success] 渲染成功回调，参数：renderedHtml(最终HTML)
         * @param {Function} [options.error] 加载/渲染失败回调，参数：errMsg/error对象
         * @param {Function} [options.complete] 完成（无论成败）回调
         */
        render: function (options) {
            // 默认配置合并
            var options = $.extend({
                tplUrl: '',
                data: {},
                showLoading: true,
                success: null,
                error: null,
                complete: null
            }, options || {});

            // 1. 校验必填参数
            if (!options.tplUrl) {
                var errMsg = '请配置模板文件URL！';
                layer.msg(errMsg, { icon: 2 });
                typeof options.error === 'function' && options.error(errMsg);
                return;
            }

            htmlLoader.loadHtml(options.tplUrl)
                .then(function (result) {
                    if (result.status === 'success') {
                        const content = result.content;
                        var tpl = laytpl(content);
                        var renderedHtml = tpl.render(options.data);

                        typeof options.success === 'function' && options.success(renderedHtml);
                    } else {
                        typeof options.error === 'function' && options.error(errResult);
                    }
                })
                .catch(function (err) {
                    // 捕获第一个失败的Promise，格式化结果
                    const errResult = { type: 'system', status: 'error', msg: err.message };

                    typeof options.error === 'function' && options.error(errResult);
                });
        }
    };

    // 暴露模块，外部可通过 layui.use('tplLoader') 调用
    exports('tplLoader', tplLoader);
});