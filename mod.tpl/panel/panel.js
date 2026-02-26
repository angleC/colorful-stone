layui.define(['componentBase'], function (exports) {
    var $ = layui.jquery,
        componentBase = layui.componentBase;

    var panel = {
        MOD_NAME: 'panel',
        render: function (configs) {
            var that = this;

            componentBase.render(configs);
        }
    }

    exports(panel.MOD_NAME, panel);
});