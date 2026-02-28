layui.config({
    base: './js/modules/'
}).extend({
    utils: '{/}/js/utils',
    loadResources: '{/}/js/loadResources',
    componentBase: '{/}/js/componentBase',
    action: '{/}/mod.tpl/action/action' // 开头特定符 {/} 即代表采用单独路径
});
