layui.define(['componentBase'], function (exports) {
    var $ = layui.jquery,
        componentBase = layui.componentBase;

    var empty = {
        MOD_NAME: 'empty',
        render: function (configs) {
            var that = this;

            componentBase.render(configs);
        }
    }

    exports(empty.MOD_NAME, empty);
});