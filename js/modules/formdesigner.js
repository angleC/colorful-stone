layui.define(['utils', 'htmlLoader', 'tplLoader', 'scriptLoader', 'moduleInvoker', 'loadResources', 'controls'], function (exports) {
    var $ = layui.jquery,
        utils = layui.utils,
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
        that.initialize();

        that.render();
    }
    /**
     * 初始化
     */
    Class.prototype.initialize = function () {
        var that = this;

        that.config.viewModel = $.extend(true, {
            fromId: that.generateId(),
            description: 'colorful stone form designer, a low-code form design tool.',
            widgets: []
        }, that.config.viewModel);

    }

    Class.prototype.render = function () {
        let that = this;
        let options = that.config;

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
        var designerContainer = controls.getControl('designer', 'container');

        that.renderComponent(designerContainer, null, $('#' + options.mainBodyId));
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
                    that.renderDragComponent(evt);
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
    /**
     * 渲染拖动组件
     * @param {拖拽组件事件参数} evt 
     * @param {组件配置} ctrConfig 
     */
    Class.prototype.renderDragComponent = function (evt) {
        var that = this;

        const item = evt.item;
        const tarItem = evt.to;
        var groupid = evt.from.id;
        var tag = item.dataset.key;
        var control = controls.getControl(tag, groupid);
        if (undefined == control) {
            return;
        }
        const $item = $(item);
        const $tarItem = $(tarItem);

        that.renderComponent(control, $item, $tarItem);
    }
    /**
     * 渲染组件
     * @param {组件配置} ctrConfig 
     * @param {组件dom元素} $item 
     * @param {目标容器dom元素} $tarItem 
     */
    Class.prototype.renderComponent = function (ctrConfig, $item, $tarItem) {
        var that = this;
        if (undefined == ctrConfig || null == ctrConfig) {
            return;
        }
        var key = ctrConfig.key.value || ctrConfig.key || '';
        var options = {
            control: ctrConfig,
            updateProperty: function (properties) {
                var _id = that.generateId(key);
                properties.id.value = _id;
            },
            success: function (_html, properties) {
                const $tag = $(_html);
                const $prevSibling = $item === undefined || null == $item ? null : $item.prev();
                if ($prevSibling && $prevSibling.length > 0) {
                    // 有上一个元素：插入到上一个元素之后
                    $tag.insertAfter($prevSibling);
                } else {
                    // 无上一个元素（第一个位置）：插入到容器最前面
                    $tag.prependTo($tarItem);
                }

                if (undefined != $item && null != $item) {
                    $item.remove();
                }

                that.updateViewModel(properties, key === 'designer');

                that.selectItem($tag, true);

                that.bindXComponentClick();//绑定按钮事件

                that.initAllTargetSortable();
            }
        }
        let scripturl = ctrConfig.url + `/${key}.js`;
        moduleInvoker.loadScriptAndCallModule(scripturl, key, 'render', options).then((result) => {
            console.log('组件渲染完成', result);
        });
    }
    /**
     * 渲染控件属性配置面板
     */
    Class.prototype.renderCtrlComponentProperty = function (property) {
        var that = this;
        if (undefined == property || null == property) {
            return;
        }
        var ctrlType = property.ctrlType;
        var ctrConfig = controls.getControl(ctrlType);
        if (undefined == ctrConfig) {
            return;
        }
        var options = {
            control: ctrConfig,
            updateProperty: function (properties) {
                var _id = that.generateId(ctrlType);
                _id = `properties_${_id}`;
                properties.id.value = _id;
                properties.label.value = property.label;
                properties.componentStyle.value = 'display: block;';
            },
            success: function (_html, properties) {
                const $tag = $(_html);
                const $tarItem = $('#' + that.config.ctrlPropertyPannelId);
                $tag.prependTo($tarItem);
            }
        }
        let scripturl = ctrConfig.url + `/${ctrlType}.js`;
        moduleInvoker.loadScriptAndCallModule(scripturl, ctrlType, 'render', options).then(() => {
            // console.log('组件属性渲染完成：' + property.label);
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

        $.each(selItems, function (i, $item) {
            that.addActive($item);
        });
    }
    /**
     * 添加选中样式
     */
    Class.prototype.addActive = function ($item) {
        var that = this;
        $item.addClass('active');

        var key = $item.data('key');
        var control = controls.getControl(key);

        var pCmp = that.getNearestNode($item, that.config.cmpNodeName);
        var isRoot = that.isRootXComponentNode(pCmp);
        if (isRoot) {
            that.loadControlProperty($item);

            return;
        }
        const tActionUrl = (control.topAction || false) ? `/mod.tpl/action/topaction.html` : '';
        const bActionUrl = (control.bottomAction || false) ? `/mod.tpl/action/bottomaction.html` : '';
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

            that.loadControlProperty($item);
        });
    }
    /**
     * 加载组件控件属性配置信息
     * @param {当前选中DOM元素} $item 
     */
    Class.prototype.loadControlProperty = function ($item) {
        var that = this;
        if (null == $item || undefined === $item) {
            return;
        }
        var id = $item.data('id');
        var ctrlProperty = that.getViewModelProperty(id);
        if (undefined == ctrlProperty) {
            var key = $item.data('key');
            ctrlProperty = controls.getControl(key);
        }

        const $tarItem = $('#' + that.config.ctrlPropertyPannelId);
        $tarItem.empty();
        $.each(ctrlProperty, function (key, value) {
            that.renderCtrlComponentProperty(value);
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
        var that = this;
        $cmp.remove();

        that.deleteViewModel($cmp.data('id'));//删除对应组件
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
    Class.prototype.bindXComponentClick = function () {
        var that = this
        var options = that.config;
        const cls = that.config.cmpNodeName;

        $(cls).on('click', function (e) {
            //当 div 为嵌套关系的时候 阻止事件冒泡
            e.preventDefault();
            e.stopPropagation();
            if (e.handled) return;
            e.handled = true;
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

        var genId = utils.generateId();
        while (options.generateIds.indexOf(genId) !== -1) {
            genId = utils.generateId();
        }
        options.generateIds.push(genId);

        return genId;
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
    /**
     * 获取视图的控件属性
     * @param {组件控件id} ctrId 
     * @returns 
     */
    Class.prototype.getViewModelProperty = function (ctrId) {
        var that = this;
        var options = that.config;
        var viewModel = options.viewModel;
        var widgets = viewModel.widgets || [];

        for (var i = 0; i < widgets.length; i++) {
            if (widgets[i].id.value === ctrId) {
                return widgets[i];
            }
        }
    }
    /**
     * 更新视图模型
     * @param {组件属性} ctrProperties 
     */
    Class.prototype.updateViewModel = function (ctrProperties, isRoot) {
        var that = this;
        var options = that.config;
        var viewModel = options.viewModel;
        var isRoot = isRoot || false;

        // if (isRoot) {
        //     that.config.viewModel = $.extend(true, {}, viewModel, ctrProperties);

        //     console.log('更新视图模型', that.config.viewModel);
        //     return;
        // }

        var widgets = viewModel.widgets || [];
        const isExist = false;
        if (widgets.length > 0) {
            widgets.forEach(function (w) {
                if (w.id === ctrProperties.id) {
                    w = $.extend(true, {}, w, ctrProperties);
                    isExist = true;
                    return false;
                }
            });
        }

        if (!isExist) {
            widgets.push(ctrProperties);

            that.config.viewModel.widgets = widgets;
        }

        console.log('更新视图模型', that.config.viewModel);
    }
    /**
     * 从视图模型中删除组件
     * @param {组件id} ctrId 
     */
    Class.prototype.deleteViewModel = function (ctrId) {
        var that = this;
        var options = that.config;
        var viewModel = options.viewModel;
        var widgets = viewModel.widgets || [];
        if (widgets.length > 0) {
            widgets.forEach(function (w) {
                if (w.id.value === ctrId) {
                    widgets.splice(widgets.indexOf(w), 1);
                    return false;
                }
            });
        }

        var generateIds = options.generateIds || [];
        if (generateIds.length > 0) {
            generateIds.forEach(function (w) {
                if (w === ctrId) {
                    generateIds.splice(generateIds.indexOf(w), 1);
                    return false;
                }
            });
        }
    }

    Class.prototype.config = {
        version: '1.0.0',
        data: [],//记录数据信息
        viewModel: {},//记录视图模型
        generateIds: [],//组件id记录，避免重复
        selItems: [],//选中的元素项
        isview: false, //标记是否为视图模式还是设计模式
        cmpNodeName: 'x-component',
        sortableContainer: '.sortable-container',//拖拽容器标记
        mainBodyId: 'main-body',//设计区主体容器ID
        ctrlPropertyPannelId: 'columnProperty',//属性面板容器ID
    }

    formDesigner.render = function (options) {
        var ins = new Class(options);

        return instance.call(ins);
    }

    exports(MOD_NAME, formDesigner);
});