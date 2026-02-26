layui.define(['componentBase'], function (exports) {
    var $ = layui.jquery,
        componentBase = layui.componentBase;

    var card = {
        MOD_NAME: 'card',
        render: function (configs) {
            var that = this;

            componentBase.render(configs);
        }
    }

    exports(card.MOD_NAME, card);
});