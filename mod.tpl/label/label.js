layui.define(['componentBase'], function (exports) {
    var $ = layui.jquery,
        componentBase = layui.componentBase;

    var label = {
        MOD_NAME: 'label',
        render: function (configs) {
            var that = this;

            componentBase.render(configs);
        }
    }

    exports(label.MOD_NAME, label);
});