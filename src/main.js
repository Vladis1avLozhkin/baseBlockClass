class Block {
    /**
     * @param blockId {string} Используется если на странице несколько блоков
     */
    constructor(blockId = null) {
        this.blockName = "";
        this.blockId = blockId;
        this.elementSeparator = "__";
        this.modSeparator = "_";

        this._block = null;
    }

    /**
     * Добавить к ноде дополнительные свойтва и методы
     * @param name    {string}  Имя элемента
     * @param element {object}  DOM node object
     * @param isBlock {boolean} true для блока, чтобы имена селекторов другие чем для элементов формировались
     */
    addMethodsAndProperties(name, element, isBlock = false) {
        element.name = name;
        element.addMod = this.addMod;
        element.removeMod = this.removeMod;
        element.toggleMod = this.toggleMod;
        element.hasMod = this.hasMod;
        element.blockCtx = this;
        element.isBlock = isBlock;

        return element;
    }

    /**
     * Формирует полный селектор модификатора (вместе с именем блока или элемента)
     *
     * @param element {node}   this конетекст элемента
     * @param modName {string} Имя модификатора
     * @param value   {string} значение модификатора
     * @return  {string}
     */
    getFullModClassName(element, modName, value = null) {
        let modFullClassName = "";

        if (element.isBlock) {
            modFullClassName += this.blockName;
        } else {
            modFullClassName += this.blockName + this.elementSeparator + element.name;
        }

        modFullClassName += this.modSeparator + modName;

        if (value) {
            modFullClassName += '_' + value;
        }

        return modFullClassName;
    }

    /**
     * Формирует полный селектор элемента
     * @param name {string} имя элемента
     * @return {string}
     */
    getFullElementClassName(name) {
        let className = '.' +  this.blockName + this.elementSeparator + name;
        return className;
    }

    /**
     * Служебный метод возвращает NodeList
     * Это просто ноды, у них нет методов из этого класса, addMod и т.п...
     * @param name   {string}
     * @return {NodeList}
     */
    _getElements(name) {
        let selector = this.getFullElementClassName(name);
        let nodeList = this.block.querySelectorAll(selector);

        return nodeList;
    }

    /**
     * Получить ноду блока
     */
    get block() {
        if (this._block) {
            return this._block;
        }

        let node = null;
        let block = null;

        if (this.blockId) {
            node = document.getElementById(this.blockId);
            block = this.addMethodsAndProperties(this.blockName, node, true);
        } else {
            node = document.querySelector('.' + this.blockName);
            block = this.addMethodsAndProperties(this.blockName, node, true);
        }

        this._block = block;

        return this._block;
    }

    /**
     * Получить элемент по имени
     * @param name {string} имя блока
     */
    element(name) {
        let selector = this.getFullElementClassName(name);
        let node = this.block.querySelector(selector);
        let element = this.addMethodsAndProperties(name, node);

        return element;
    }

    /**
     * Добавить к модификатор к блоку/элементу
     * @param name  {string} имя модификатора
     * @param value {string} значение модификатора
     */
    addMod(name, value) {
        let modFullName = this.blockCtx.getFullModClassName(this, name, value);
        this.classList.add(modFullName);
    }

    /**
     * Удалить модификатор у блока/элемента
     * @param name  {string} имя модификатора
     * @param value {string} значение модификатора
     */
    removeMod(name, value) {
        let modFullName = this.blockCtx.getFullModClassName(this, name, value);
        this.classList.remove(modFullName);
    }

    /**
     * Переключатель модификатора блока.
     * Добавит мод если его нет и удалит в противном случае
     * @param param name  {string} имя модификатора
     * @param param value {string} значение модификатора
     */
    toggleMod(name, value) {
        let modFullName = this.blockCtx.getFullModClassName(this, name, value);
        this.classList.toggle(modFullName);
    }

    /**
     * Проверка - есть ли у блока модификатор
     * @param name   {string}  имя модификатора
     * @param value  {string}  значение модификатора
     * @return {boolean}
     */
    hasMod(name, value = null) {
        let modFullName = this.blockCtx.getFullModClassName(this, name, value);
        return this.classList.contains(modFullName);
    }

    /**
     * Применить функцию к каждому элементу
     * @param name     {string} имя элемента
     * @param callback {func}   функция получающая элемет в качестве аргумента
     */
    eachElements(name, callback) {
        let elements = this._getElements(name);

        Array.prototype.forEach.call(elements, (elementNode, i, arr) => {
            let element = this.addMethodsAndProperties(name, elementNode);
            callback(element, i, arr);
        });
    }

    pub(eventName, data = null) {
        var event = new CustomEvent(eventName, {
            bubbles: false,
            cancelable: false,
            detail: data
        });

        document.dispatchEvent(event);
    }

    sub(eventName, callback) {
        document.addEventListener(eventName, (event) => {
            callback(event.detail);
        });
    }
}

class Form extends Block {
    constructor() {
        super();
        this.blockName = "form";

        this.sub('test-event', (data) => {
            console.log(data);
        });
    }
}

class Nav extends Block {
    constructor(blockId) {
        super(blockId);
        this.modSeparator = "--";
        this.blockName = "nav";

        this.pub('test-event', {choiceLink: '/news'});
    }
}

let form = new Form;
let nav = new Nav('main-nav');
