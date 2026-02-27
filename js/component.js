// 定义自定义元素
class CustomComponent extends HTMLElement {
    // 1. 声明需要监听的属性（仅这些属性变化会触发attributeChangedCallback）
    static get observedAttributes() {
        return ['title', 'id']; // 监听title和count属性
    }

    // 2. 构造函数：元素创建时执行（最早触发）
    constructor() {
        super(); // 必须先调用super()
        // console.log('1. 构造函数：元素被创建');
        // 可创建Shadow DOM（可选）
        // this.shadow = this.attachShadow({ mode: 'open' });
        // this.shadow.innerHTML = `<slot></slot>`;

        // this.innerHTML = `<slot></slot>`;
    }

    // 3. 挂载到DOM时执行（最常用）
    connectedCallback() {
        // 可操作DOM、绑定事件、发请求
        // this.addEventListener('click', () => this.handleClick());
        const displayValue = window.getComputedStyle(this).display;
        if (!displayValue) {
            this.style.display = 'block';
        }
        console.log('2. 挂载回调：元素已加入DOM');
    }

    // 4. 从DOM移除时执行（清理资源）
    disconnectedCallback() {
        // console.log('3. 移除回调：元素已离开DOM');
        // 清理事件、定时器等
        this.removeEventListener('click', this.handleClick);
        clearInterval(this.timer); // 示例：清理定时器
    }

    // 5. 元素被移动到其他文档时执行（极少用）
    adoptedCallback() {
        // console.log('4. 文档迁移回调：元素被移动到新文档');
    }

    // 6. 监听的属性变化时执行
    attributeChangedCallback(name, oldVal, newVal) {
        // console.log(`5. 属性变化回调：${name}从${oldVal}变为${newVal}`);
    }
}

// 注册自定义元素，名称必须包含短横线（Web Components规范要求）
// 这里注册为 "x-component"，同时兼容直接用<component>（靠CSS兜底）
customElements.define('x-component', CustomComponent);

// // 兼容：如果想直接用<component>（无短横线），可通过DOM操作映射（非规范，但实用）
// document.addEventListener('DOMContentLoaded', () => {
//     const components = document.querySelectorAll('component');
//     components.forEach(el => {
//         // 保留原属性和内容，仅修改标签名（可选方案）
//         const newEl = document.createElement('x-component');
//         newEl.innerHTML = el.innerHTML;
//         // 复制所有属性
//         Array.from(el.attributes).forEach(attr => {
//             newEl.setAttribute(attr.name, attr.value);
//         });
//         el.parentNode.replaceChild(newEl, el);
//     });
// });