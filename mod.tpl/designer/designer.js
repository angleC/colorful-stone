layui.define(['componentBase'], function (exports) {
    var $ = layui.jquery,
        componentBase = layui.componentBase;

    var designer = {
        MOD_NAME: 'designer',
        render: function (configs) {
            var that = this;

            componentBase.render(configs);
        }
    }

    exports(designer.MOD_NAME, designer);
});