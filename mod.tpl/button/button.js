layui.define(['componentBase'], function (exports) {
    var $ = layui.jquery,
        componentBase = layui.componentBase;

    var button = {
        MOD_NAME: 'button',
        render: function (configs) {
            var that = this;

            componentBase.render(configs);
        }
    }

    exports(button.MOD_NAME, button);
});