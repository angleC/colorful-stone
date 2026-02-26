/**
 * 按照layui define规范封装的动态脚本加载模块
 * 模块名：dynamicScriptLoader
 */
layui.define(function(exports) {
  "use strict";

  // 核心功能对象
  var scriptLoader = {
    // 已加载的脚本缓存，避免重复加载
    loadedScripts: {},

    /**
     * 动态加载外部JS脚本
     * @param {string} url - 脚本的URL地址
     * @returns {Promise} - 返回Promise对象
     */
    loadScript: function(url) {
      // 如果已加载过，直接返回成功的Promise
      if (this.loadedScripts[url]) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;

        // 标记为加载中
        this.loadedScripts[url] = 'loading';

        // 加载成功回调
        script.onload = () => {
          this.loadedScripts[url] = 'loaded'; // 标记为已加载
          resolve();
        };

        // 加载失败回调
        script.onerror = (error) => {
          delete this.loadedScripts[url]; // 移除加载失败的记录
          reject(new Error(`加载脚本失败: ${url}`));
        };

        document.head.appendChild(script);
      });
    },

    /**
     * 加载脚本并调用指定方法
     * @param {string} scriptUrl - 脚本URL
     * @param {string} methodName - 要调用的方法名
     * @param {Array} [args=[]] - 传递给方法的参数数组
     * @returns {Promise<any>} - 返回方法执行结果
     */
    loadScriptsAndCall: function(scriptUrl, methodName, args = []) {
      var that = this;

      return new Promise(async (resolve, reject) => {
        try {
          // 加载脚本
          await that.loadScript(scriptUrl);

          // 检查方法是否存在
          const targetMethod = window[methodName];
          if (typeof targetMethod !== 'function') {
            throw new Error(`方法 ${methodName} 不存在`);
          }

          // 调用方法并传递参数
          const result = targetMethod(...args);
          resolve(result);

        } catch (error) {
          layui.hint().error(`动态脚本调用失败: ${error.message}`);
          reject(error);
        }
      });
    },

    /**
     * 加载多个脚本后调用方法（批量加载）
     * @param {Array} scriptUrls - 脚本URL数组
     * @param {string} methodName - 要调用的方法名
     * @param {Array} [args=[]] - 传递给方法的参数数组
     * @returns {Promise<any>}
     */
    loadMultiScriptsAndCall: function(scriptUrls, methodName, args = []) {
      var that = this;

      return new Promise(async (resolve, reject) => {
        try {
          // 批量加载所有脚本
          await Promise.all(
            scriptUrls.map(url => that.loadScript(url))
          );

          // 调用指定方法
          const targetMethod = window[methodName];
          if (typeof targetMethod !== 'function') {
            throw new Error(`方法 ${methodName} 不存在`);
          }

          const result = targetMethod(...args);
          resolve(result);

        } catch (error) {
          layui.hint().error(`批量加载脚本并调用方法失败: ${error.message}`);
          reject(error);
        }
      });
    }
  };

  // 暴露模块，供layui.use调用
  exports('scriptLoader', scriptLoader);
});