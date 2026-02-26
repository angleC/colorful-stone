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
                        url: 'mod.tpl/label'
                    },  
                    {
                        key: 'input',
                        name: '文本框',
                        icon: 'layui-icon layui-icon-layer',
                        url: 'mod.tpl/input'
                    },  
                    {
                        key: 'labelInput',
                        name: '标签文本框',
                        icon: 'layui-icon layui-icon-form',
                        url: 'mod.tpl/labelInput'
                    },                 
                    {
                        key: 'button',
                        name: '按钮',
                        icon: 'layui-icon layui-icon-layer',
                        url: 'mod.tpl/button'
                    }
                ]
            },
            
            {
                id: 'container',
                label: '容器组件',
                controls: [
                    {
                        key: 'panel',
                        name: '面板',
                        icon: 'layui-icon layui-icon-layer',
                        url: 'mod.tpl/panel'
                    },
                    {
                        key: 'card',
                        name: '卡片面板',
                        icon: 'layui-icon layui-icon-layer',
                        url: 'mod.tpl/card'
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
        getControl: function (groupid, controlkey) {
            var that = this;
            var groups = that.groups;
            var control = null;

            $.each(groups, function (index, item) {
                if (null != control) {
                    return false;
                }
                if (undefined != item.controls && null != item.controls
                    && item.id === groupid && item.controls.length > 0) {
                    $.each(item.controls, function (i, ctr) {
                        if (ctr.key === controlkey) {
                            control = ctr;
                            return false;
                        }
                    })
                }
            });

            return control;
        }
    }

    exports('controls', controls);
});