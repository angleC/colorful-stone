layui.define(function (exports) {
    "use strict";
    var $ = layui.jquery;

    var controls = {
        groups: [
            {
                id: 'basectrl',
                label: '基础组件',
                controls: [
                    {
                        key: 'label',
                        name: '标签',
                        icon: 'layui-icon layui-icon-note',
                        url: 'mod.tpl/label',
                        bottomAction: true,//是否加载底部操作模板
                    },
                    {
                        key: 'input',
                        name: '文本框',
                        icon: 'layui-icon layui-icon-layer',
                        url: 'mod.tpl/input',
                        bottomAction: true,//是否加载底部操作模板
                    },
                    {
                        key: 'labelInput',
                        name: '标签文本框',
                        icon: 'layui-icon layui-icon-form',
                        url: 'mod.tpl/labelInput',
                        bottomAction: true,//是否加载底部操作模板
                    },
                    {
                        key: 'button',
                        name: '按钮',
                        icon: 'layui-icon layui-icon-layer',
                        url: 'mod.tpl/button',
                        bottomAction: true,//是否加载底部操作模板
                    }
                ]
            },
            {
                id: 'container',
                label: '容器组件',
                controls: [
                    {
                        key: 'designer',
                        name: '设计区容器',
                        icon: 'layui-icon layui-icon-layer',
                        url: 'mod.tpl/designer',
                        visible: false,//是否在控件面板显示，默认显示                        
                        topAction: false,//是否加载顶部操作模板
                    },
                    {
                        key: 'empty',
                        name: '空白提示',
                        icon: 'layui-icon layui-icon-tips',
                        url: 'mod.tpl/empty',
                        visible: false,//是否在控件面板显示，默认显示                        
                        bottomAction: true,//是否加载顶部操作模板
                    },
                    {
                        key: 'panel',
                        name: '面板',
                        icon: 'layui-icon layui-icon-layer',
                        url: 'mod.tpl/panel',
                        bottomAction: true,//是否加载底部操作模板
                    },
                    {
                        key: 'card',
                        name: '卡片面板',
                        icon: 'layui-icon layui-icon-layer',
                        url: 'mod.tpl/card',
                        bottomAction: true,//是否加载底部操作模板
                    }
                ]
            }
        ],
        /**
         * 获取控件
         * @param {分组id} groupid 
         * @param {控件key} controlkey 
         * @returns 
         */
        getControl: function (controlkey, groupid) {
            var that = this;
            var groups = that.groups;
            var control = null;
            var groupid = groupid || '';

            $.each(groups, function (index, item) {
                if (null != control) {
                    return false;
                }

                var controls = item.controls || [];
                if ((item.id === groupid || groupid === '') && controls.length > 0) {
                    $.each(controls, function (i, ctr) {
                        if (ctr.key === controlkey) {
                            control = ctr;
                            return false;
                        }
                    });
                }
            });

            return control;
        }
    }

    exports('controls', controls);
});