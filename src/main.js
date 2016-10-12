class Block {
    constructor() {
        this.blockName = "";
        this.elementSeparator = "__";
        this.modSeparator = "_";

        this._block = null;
    }

    /**
     * Добавить к ноде дополнительные свойтва и методы
     * @name    {string}  Имя элемента
     * @element {object}  DOM node object
     * @isBlock {boolean} true для блока, чтобы имена селекторов другие чем для элементов формировались
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
     * @element {node}   this конетекст элемента
     * @modName {string} Имя модификатора
     * @value   {string} значение модификатора
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
     * @name {string} имя элемента
     * @return {string}
     */
    getFullElementClassName(name) {
        let className = '.' +  this.blockName + this.elementSeparator + name;
        return className;
    }

    /**
     * Служебный метод возвращает NodeList
     * Это просто ноды, у них нет методов из этого класса, addMod и т.п...
     * @name   {string}
     * @return {NodeList}
     */
    _getElements(name) {
        let selector = this.getFullElementClassName(name);
        let nodeList = this.block.querySelectorAll(selector);

        return nodeList;
    }

    /**
     * Получить ноду блока
     * Можно вызвать один раз, а в дальшейшем получать блок через this.block
     * TODO а что если на странице несколько блоков?
     */
    get block() {
        console.log(this);
        if (! this._block) {
            let node = document.querySelector('.' + this.blockName);
            let block = this.addMethodsAndProperties(this.blockName, node, true);
            this._block = block;
        }

        return this._block;
    }

    /**
     * Получить элемент по имени
     * @name {string} имя блока
     */
    element(name) {
        let selector = this.getFullElementClassName(name);
        let node = this.block.querySelector(selector);
        let element = this.addMethodsAndProperties(name, node);

        return element;
    }

    /**
     * Добавить к модификатор к блоку/элементу
     * @name  {string} имя модификатора
     * @value {string} значение модификатора
     */
    addMod(name, value) {
        let modFullName = this.blockCtx.getFullModClassName(this, name, value);
        this.classList.add(modFullName);
    }

    /**
     * Удалить модификатор у блока/элемента
     * @name  {string} имя модификатора
     * @value {string} значение модификатора
     */
    removeMod(name, value) {
        let modFullName = this.blockCtx.getFullModClassName(this, name, value);
        this.classList.remove(modFullName);
    }

    /**
     * Переключатель модификатора блока.
     * Добавит мод если его нет и удалит в противном случае
     * @name  {string} имя модификатора
     * @value {string} значение модификатора
     */
    toggleMod(name, value) {
        let modFullName = this.blockCtx.getFullModClassName(this, name, value);
        this.classList.toggle(modFullName);
    }

    /**
     * Проверка - есть ли у блока модификатор
     * @name   {string}  имя модификатора
     * @value  {string}  значение модификатора
     * @return {boolean}
     */
    hasMod(name, value = null) {
        let modFullName = this.blockCtx.getFullModClassName(this, name, value);
        return this.classList.contains(modFullName);
    }

    /**
     * Применить функцию к каждому элементу
     * @name     {string} имя элемента
     * @callback {func}   функция получающая элемет в качестве аргумента
     */
    eachElements(name, callback) {
        let elements = this._getElements(name);

        Array.prototype.forEach.call(elements, (elementNode, i, arr) => {
            let element = this.addMethodsAndProperties(name, elementNode);
            callback(element, i, arr);
        });
    }
}

class Form extends Block {
    constructor() {
        super();
        this.blockName = "form";

        let input = this.element('input');

        input.addMod('mod');
        input.addMod('mod-2');
        input.removeMod('mod-2');
        console.log(input.hasMod('mod-2'));
        input.toggleMod('mod-2');
        console.log(input.hasMod('mod-2'));
        input.toggleMod('mod');
        console.log(input.hasMod('mod'));


        let btn = this.element('btn');
        btn.addMod('mod-name', 'value');
    }
}

class Nav extends Block {
    constructor() {
        super();
        this.modSeparator = "--";
        this.blockName = "nav";

        let links = this._getElements('link');
        this.eachElements('link', (link) => {
            link.addMod('state', 'active');
        });

        let block = this.block;
        block.addMod('orientation', 'horizontal');
        block.removeMod('orientation', 'horizontal');
        block.toggleMod('orientation', 'horizontal');
        console.info(block.hasMod('orientation', 'horizontal'));
    }
}

let form = new Form;
let nav = new Nav;
