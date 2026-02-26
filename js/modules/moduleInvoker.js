layui.define(function(exports) {
  "use strict";
    var $ = layui.jquery;

    var moduleInvoker = {
        /**
         * 动态调用layui模块的方法
         * @param {string|Array} moduleNames - 要加载的模块名（单个字符串或多个模块数组）
         * @param {string} methodName - 要调用的方法名
         * @param {Array} args - 传递给方法的参数数组
         * @returns {Promise<any>} 返回方法执行结果
         */
        callModuleMethod: function(moduleNames, methodName, args = []) {
            return new Promise((resolve, reject) => {
                // 统一处理模块名格式（转为数组）
                const modules = Array.isArray(moduleNames) ? moduleNames : [moduleNames];
                
                // 使用layui.use加载指定模块
                layui.use(modules, function() {
                    try {
                        // 1. 获取目标模块实例
                        // 如果是单个模块，直接取第一个；如果是多个，返回模块对象集合
                        let targetModule;
                        if (modules.length === 1) {
                            targetModule = layui[modules[0]];
                        } else {
                            targetModule = {};
                            modules.forEach(name => {
                                targetModule[name] = layui[name];
                            });
                        }

                        // 2. 检查模块是否存在
                        if (!targetModule) {
                            throw new Error(`模块 ${modules.join(',')} 不存在`);
                        }

                        // 3. 检查方法是否存在（单个模块时）
                        if (modules.length === 1) {
                            if (typeof targetModule[methodName] !== 'function') {
                                throw new Error(`模块 ${modules[0]} 中不存在方法 ${methodName}`);
                            }
                             // 3. 确保 args 是可迭代对象（数组/类数组）
                            const validArgs = Array.isArray(args) ? args : [args];
                            // 4. 调用方法并传递参数
                            const result = targetModule[methodName](validArgs);
                            resolve(result);
                        } else {
                            // 多模块时返回模块集合，由调用方自行处理
                            resolve(targetModule);
                        }
                    } catch (error) {
                        layui.hint().error(`调用模块方法失败: ${error.message}`);
                        reject(error);
                    }
                });
            });
        },

        /**
         * 结合动态脚本加载 + 调用layui模块方法
         * @param {string} scriptUrl - 外部脚本URL
         * @param {string} moduleName - layui模块名
         * @param {string} methodName - 要调用的方法名
         * @param {Array} args - 方法参数
         * @returns {Promise<any>}
         */
        loadScriptAndCallModule: function(scriptUrl, moduleName, methodName, args = []) {
            // 先加载外部脚本，再调用模块方法
            return new Promise(async (resolve, reject) => {
                try {
                    // 加载外部脚本（复用之前封装的loadScript方法）
                    await this.loadScript(scriptUrl);
                    let extModule = {};
                    extModule[moduleName]=`{/}/mod.tpl/${moduleName}/${moduleName}`;
                    layui.extend(extModule);
                    // 调用模块方法
                    const result = await this.callModuleMethod(moduleName, methodName, args);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        },

        // 复用之前的脚本加载方法（保持完整性）
        loadScript: function(url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(`加载脚本失败: ${url}`));
                document.head.appendChild(script);
            });
        }
    };

    exports('moduleInvoker', moduleInvoker);
});