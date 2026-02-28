layui.define(function (exports) {
    "use strict";
    var $ = layui.jquery;

    var utils = {
        version: '1.0.0',
        MOD_NAME: 'utils',
        /**
         * 随机指定长度的id字符串
         * @param {长度} length 
         * @returns 
         */
        generateId: function (length) {
            var length = length || 6;
            const charPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let uniqueId;

            let tempId = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charPool.length);
                tempId += charPool[randomIndex];
            }
            uniqueId = tempId;

            return uniqueId;
        }
    };

    exports(utils.MOD_NAME, utils)
});