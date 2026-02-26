layui.define(['loadResources', 'laytpl'], function (exports) {
    var $ = layui.jquery,
        laytpl = layui.laytpl,
        loadResources = layui.loadResources;

    var componentBase = {
        MOD_NAME: 'componentBase',
        render: function (configs) {
            var that = this;
            var options = configs[0];
            var ctr = options.control;
            var tag = ctr.key;
            let url = ctr.url;

            let htmltplurl = url + `/${tag}.html`;
            let propertiesurl = url + `/${tag}.json`;

            loadResources.loadAll({
                htmlUrls: [
                    htmltplurl
                ],
                jsonUrls: [
                    propertiesurl
                ]
            }, (results) => {
                var properties = {};
                var htmltpl = '';
                results.forEach(function (r) {
                    if (r.url === propertiesurl) {
                        properties = r.data;
                    } else if (r.url === htmltplurl) {
                        htmltpl = r.content;
                    }
                });

                var tpl = laytpl(htmltpl);

                typeof options.updateProperty === 'function' && options.updateProperty(properties);

                var _html = tpl.render(properties);

                typeof options.success === 'function' && options.success(_html, properties);
            }, (errors) => {
                console.info(errors);
            });
        }
    }

    exports(componentBase.MOD_NAME, componentBase);
});