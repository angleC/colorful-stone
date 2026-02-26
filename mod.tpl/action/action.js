layui.define(function (exports) {

    var action = {
        version: '1.0.0',
        MOD_NAME: 'action',
        invokeAction: function (actionName, $tag) {
            var that = this;
            const result = that[actionName].apply(that, $tag);

            return result;
        },
        copy: function (arg) {
            console.info(arg);
            return "测试";
        },
        delete: function (arg) {
            arg.remove();
        }
    }

    exports(action.MOD_NAME, action);
});