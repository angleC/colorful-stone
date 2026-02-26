layui.define(['componentBase'], function (exports) {
    var $ = layui.jquery,
        componentBase = layui.componentBase;

    var labelInput = {
        MOD_NAME: 'labelInput',
        render: function (configs) {
            var that = this;

            componentBase.render(configs);
        },
        setData: function ($target, value) {
            var that = this;
            var $input = $target.find('input');

            $input.val(value);
        },
        getData: function ($target) {
            var $input = $target.find('input');

            return $input.val();
        }
    }

    exports(labelInput.MOD_NAME, labelInput);
});