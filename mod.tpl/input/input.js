layui.define(['componentBase'], function (exports) {
    var $ = layui.jquery,
        componentBase = layui.componentBase;

    var input = {
        MOD_NAME: 'input',
        render: function (configs) {
            var that = this;

            componentBase.render(configs);
        }
    }

    exports(input.MOD_NAME, input);
});