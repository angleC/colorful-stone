layui.define(['htmlLoader', 'tplLoader', 'scriptLoader', 'moduleInvoker', 'loadResources', 'controls'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element,
        htmlLoader = layui.htmlLoader,
        controls = layui.controls,
        tplLoader = layui.tplLoader,
        scriptLoader = layui.scriptLoader,
        loadResources = layui.loadResources
    moduleInvoker = layui.moduleInvoker;

    let MOD_NAME = 'formDesigner';
    var formDesigner = {
        index: layui.formDesigner ? (layui.formDesigner.index + 100) : 0,
        //设置全局参数
        set: function (options) {
            var that = this;
            that.config = $.extend(true, {}, that.config, options);
        },
        //监听事件
        on: function (events, callback) {
            return layui.onenvent.call(this, MOD_NAME, events, callback);
        }
    };
    let instance = function () {
        let that = this;
        let options = that.config;

        var inst = {
            config: options,
            id: options.id,
            index: that.index,
            reload: function (options) {
                that.reload.call(that, options);
            }
        };

        // // 扩展实例对象的回调
        // if (typeof settings.extendsInstance === 'function') {
        //     $.extend(true, inst, settings.extendsInstance.call(that));
        // }

        return inst;
    };

    var Class = function (options) {
        var that = this;
        that.index = ++formDesigner.index;
        that.config = $.extend(true, {}, that.config, formDesigner.config, options);

        that.render();
    }

    Class.prototype.render = function () {
        let that = this;
        let options = that.config;

        console.log(that, options);

        options.elem = $(options.elem);
        options.id = options.id || options.elem.attr('id') || that.index;
        //视图模式
        if (options.isview) {
            return that;
        }

        //设计模式
        let tplOpts = {
            tplUrl: './mod.tpl/formdesigner.html',
            data: {},
            showLoading: true,
            success: function (html) {
                options.elem.html(html);

                that.loadControlList(() => {
                    that.bindSortable();
                });

                that.loadDesignerContainer();
            }
        }

        tplLoader.render(tplOpts);
    }
    /**
     * 加载设计区容器
     */
    Class.prototype.loadDesignerContainer = function () {
        var that = this;
        var options = that.config;
        var designerContainer = controls.getControl('container', 'designerContainer');
        var tplOpts = {
            tplUrl: options.designerContainerTpl,
            data: designerContainer,
            showLoading: true,
            success: function (html) {
                var $html = $(html);
                $('#' + options.mainBodyId).append($html);

                that.initTargetSortable($html[0]);
            }
        }
        tplLoader.render(tplOpts);
    }

    Class.prototype.bindSortable = function () {
        var that = this;
        var options = that.options;
        var groups = controls.groups;

        //排序事件注册
        $.each(groups, function (index, item) {
            var srcControlGroup = Sortable.create(document.getElementById(item.id), {
                group: {
                    name: 'formgroup',
                    pull: 'clone', //克隆本区域元素到其他区域
                    put: false, //禁止本区域实现拖动或拖入
                },
                // ghostClass: "ghost",
                dragClass: 'drag',
                ghostClass: 'ghost',
                sort: false,
                animation: 150,
                onEnd: function (evt) {
                    console.log('srcControlGroup::onEnd', evt);
                    var itemEl = evt.item;
                }
            });
        });

        that.initAllTargetSortable();
    }
    /**
     * 初始化目标可接收信息的容器
     */
    Class.prototype.initAllTargetSortable = function () {
        var that = this;
        var clsName = that.config.sortableContainer;
        var conDraggables = document.querySelectorAll(clsName);;

        conDraggables.forEach((container, index) => {
            that.initTargetSortable(container);
        });
    }

    Class.prototype.initTargetSortable = function (container) {
        var that = this;
        //表单事件注册
        var tarFormDesigner = Sortable.create(container, {
            group: {
                name: 'formgroup'
            },
            // handle: '.widget-view-drag',
            draggable: 'x-component',
            ghostClass: "ghost",
            animation: 200,
            onAdd: function (evt) {
                console.log('tarFormDesigner::onAdd', evt);

                var groupid = evt.from.id;
                var tag = evt.item.dataset.tag;
                var id = evt.item.dataset.id;
                var tmp = evt.item;
                // if (options.data === undefined) {
                //     return;
                // }
                // if (typeof (options.data) === 'string') {
                //     options.data = JSON.parse(options.data);
                // }
                // //注意这里的一个bug，newIndex 第一次拖动也是1 第二次拖动也是1
                // if (options.data.length === 0) {
                //     evt.newIndex = 0;
                // }
                if (id) {
                    // /*根据id的新算法 复制一份副本 删除json中的节点 再插入节点*/
                    // var _item = that.findJsonItem(options.data, evt.item.dataset.id);
                    // options.selectItem = _item;
                    // that.deleteJsonItem(options.data, evt.item.dataset.id);
                    // options.data.splice(evt.newIndex + 1, 0, _item);
                } else {
                    var control = controls.getControl(groupid, tag);
                    if (undefined == control) {
                        return;
                    }

                    that.renderComponent(evt, control);
                    // /* 向现有的表单数据中增加新的数组元素 splice */
                    // var _newitem = that.components[evt.item.dataset.tag].jsonData(_id, evt.newIndex, that);
                    // //如果是 grid 呢，需要知道几列
                    // options.selectItem = _newitem;
                    // options.data.splice(evt.newIndex, 0, _newitem);
                }
                // //局部更新 只要更新 designer 设计区部分
                // that.renderForm();
            },
            onEnd: function (evt) {
                console.log('tarFormDesigner::onEnd', evt);
                // var newIndex = evt.newIndex;
                // var oldIndex = evt.oldIndex;
                // //只有当to的目标容器是 formDesignerForm
                // if (evt.to.id === 'formDesignerForm') {
                //     that.moveItem(evt.oldIndex, evt.newIndex);
                // }
            }
        });
    }

    Class.prototype.renderComponent = function (evt, ctrConfig) {
        var that = this;
        var tag = ctrConfig.key;
        const item = evt.item;
        const tarItem = evt.to;
        var options = {
            control: ctrConfig,
            updateProperty: function (properties) {
                var _id = that.generateId(tag);
                properties.id = _id;
            },
            success: function (_html, properties) {
                console.info(properties);
                const $item = $(item);
                const $tarItem = $(tarItem);
                const $html = $(_html);
                // var _id = that.generateId(tag);
                // $html.attr({
                //     'id': _id
                // });
                // const $tag = $(`<div class="select-drag" data-ctrl="${tag}"></>`);
                // $tag.append($html);
                const $tag = $html;
                const $prevSibling = $item.prev();
                if ($prevSibling.length > 0) {
                    // 有上一个元素：插入到上一个元素之后
                    $tag.insertAfter($prevSibling);
                } else {
                    // 无上一个元素（第一个位置）：插入到容器最前面
                    $tag.prependTo($tarItem);
                }

                $item.remove();

                that.selectItem($tag, true);

                that.config.viewModel.push(properties);

                that.bindClick();//绑定按钮事件

                that.initAllTargetSortable();
            }
        }
        let scripturl = ctrConfig.url + `/${tag}.js`;
        moduleInvoker.loadScriptAndCallModule(scripturl, tag, 'render', options).then((result) => {
            console.log('组件渲染完成', result);
        });
    }
    /**
     * 设置选中元素
     */
    Class.prototype.selectItem = function ($tag, isClear) {
        var that = this;
        var isClear = isClear || true;
        if (isClear) {
            that.clearAllActive();
        }
        if ($tag != undefined && $tag != null) {
            that.config.selItems.push($tag);
        }
        var selItems = that.config.selItems;

        if (selItems.length <= 0) {
            return;
        }

        $.each(selItems, function (i, item) {
            that.addActive(item);
        });
    }
    /**
     * 添加选中样式
     */
    Class.prototype.addActive = function ($item) {
        var that = this;
        $item.addClass('active');

        var pCmp = that.getNearestNode($item, that.config.cmpNodeName);
        var isRoot = that.isRootXComponentNode(pCmp);
        if (isRoot) {
            return;
        }

        const tActionUrl = (that.config.topAction || false) ? `/mod.tpl/action/topaction.html` : '';
        const bActionUrl = (that.config.bottomAction || false) ? `/mod.tpl/action/bottomaction.html` : '';
        var options = {
            htmlUrls: [
                tActionUrl,
                bActionUrl
            ]
        }

        loadResources.loadAll(options, function (results) {
            let tActionTplHtml = '';
            let bActionTplHtml = '';
            results.forEach(function (r) {
                if (r.url === tActionUrl) {
                    tActionTplHtml = r.content;
                } else if (r.url === bActionUrl) {
                    bActionTplHtml = r.content;
                }
            });

            let $tAction = $(tActionTplHtml);
            let $bAction = $(bActionTplHtml);

            $item.prepend($tAction);
            $item.append($bAction);

            that.bindActionClick($item);
        });
    }
    /**
     * 添加Action点击事件
     * @param {指定对应标记} $tag 
     */
    Class.prototype.bindActionClick = function ($tag) {
        var that = this;
        const $actionEle = $tag.find('[data-action]');
        $actionEle.on('click', function (e) {
            const $this = $(this);

            e.preventDefault();
            e.stopPropagation();
            const actionName = $this.data('action');
            var cmpNodeName = that.config.cmpNodeName;

            // layui.use('action', function () {
            //     var action = layui.action;
            //     var cmpNodeName = that.config.cmpNodeName;
            //     var result = action.invokeAction(actionName, that.getNearestNode($this, cmpNodeName));

            //     console.info(result);
            // });
            const $cmp = that.getNearestNode($this, cmpNodeName);
            switch (actionName) {
                case "copy":
                    that.copyComponent($cmp);
                    break;
                case "delete":
                    that.deleteComponent($cmp);
                    break;
            }
        });
    }
    /**
     * 复制dom节点
     * @param {组件dom元素} $cmp 
     */
    Class.prototype.copyComponent = function ($cmp) {
        var that = this;
        const $original = $cmp;
        if ($original.length === 0) {
            alert('原节点不存在');
            return;
        }

        // 1. 复制节点（clone(true) 表示深复制，含事件；clone() 仅复制结构）
        const $cloned = $original.clone(true);

        // 2. 重置唯一标识和内容
        const newId = `originalXComponent_${Date.now()}`;
        $cloned.attr('id', newId);

        that.clearActive($cloned);

        // 3. 插入到原节点后面（jQuery的after方法直接实现）
        $original.after($cloned);
    }
    /**
     * 删除dom节点
     * @param {组件dom元素} $cmp 
     */
    Class.prototype.deleteComponent = function ($cmp) {
        $cmp.remove();
    }
    /**
     * 清除所有选中样式
     */
    Class.prototype.clearAllActive = function () {
        var that = this;
        var selItems = that.config.selItems;
        if (selItems.length > 0) {
            $.each(selItems, function (i, item) {
                that.clearActive(item);
            });

            that.config.selItems = [];
        }
    }
    /**
     * 清除选中样式
     */
    Class.prototype.clearActive = function ($item) {
        $item.removeClass('active');

        const $tarDrag = $item.find('.widget-view-drag');
        const $tarAction = $item.find('.widget-view-action');

        if ($tarDrag.length !== 0) {
            $tarDrag.remove();
        }
        if ($tarAction.length !== 0) {
            $tarAction.remove();
        }
    }
    /**
     * 绑定点击事件
     */
    Class.prototype.bindClick = function () {
        var that = this
        var options = that.config;
        const cls = that.config.cmpNodeName;

        $(cls).on('click', function (e) {
            //当 div 为嵌套关系的时候 阻止事件冒泡
            e.preventDefault();
            e.stopPropagation();
            console.info(e);

            var $tar = $(this);
            // var clsName = cls.replace('.', '');
            // if (!$tar.hasClass(clsName)) {
            //     $tar = that.getNearestByClass($tar, cls);
            // }

            if (!$tar) {
                return;
            }
            if (!e.ctrlKey) {
                that.clearAllActive();
            }
            that.config.selItems.push($tar);
            that.addActive($tar);
        });
    }
    /**
     * 根据当前节点查找最近的指定样式节点
     * @param {样式} cls 
     */
    Class.prototype.getNearestNode = function ($current, cls) {
        // 2. 查找最近的含 select-drag 类的父节点
        const $closestNode = $current.closest(cls);

        return $closestNode;
    }
    /**
     * 判断是否为根节点（即没有外层同类组件）
     * @param {组件dom元素} $xComponent 
     * @returns 
     */
    Class.prototype.isRootXComponentNode = function ($xComponent) {
        var that = this;
        const nodeName = that.config.cmpNodeName;
        // 边界处理：如果没找到x-component，直接返回false
        if (!$xComponent.length) return false;

        // 检查该x-component的所有祖先节点中是否还有x-component
        const $parentXComponent = $xComponent.parents(nodeName);

        // 没有外层x-component祖先 → 是根节点
        return $parentXComponent.length === 0;
    }
    /**
     * 生成 id
     * @param {标记} tag 
     * @returns 
     */
    Class.prototype.generateId = function (tag) {
        var that = this;
        let options = that.config;
        options.generateId = options.generateId + 1;

        return tag + '_' + options.generateId;
    }

    Class.prototype.loadControlList = function (complete) {
        var that = this;
        var groups = controls.groups;
        let count = 1;

        $.each(groups, function (index, item) {
            //设计模式
            let tplOpts = {
                tplUrl: './mod.tpl/cmpgroup.html',
                data: item,
                showLoading: true,
                success: function (html) {
                    $('#components-form-list').append(html);

                    if (groups.length === count) {
                        typeof complete === 'function' && complete();
                    }

                    count++;
                }
            }

            tplLoader.render(tplOpts);
        });
    }

    Class.prototype.config = {
        version: '1.0.0',
        data: [],//记录数据信息
        viewModel: [],//记录视图模型
        generateId: 0,//组件自增加id
        selItems: [],//选中的元素项
        isview: false, //标记是否为视图模式还是设计模式
        topAction: false,//是否加载顶部操作模板
        bottomAction: true,//是否加载底部操作模板
        cmpNodeName: 'x-component',
        sortableContainer: '.sortable-container',//拖拽容器标记
        designerContainerTpl: './mod.tpl/desingerContainer/desingerContainer.html',//设计区容器模板
        mainBodyId: 'main-body',//设计区主体容器ID
    }

    formDesigner.render = function (options) {
        var ins = new Class(options);

        return instance.call(ins);
    }

    exports(MOD_NAME, formDesigner);
});