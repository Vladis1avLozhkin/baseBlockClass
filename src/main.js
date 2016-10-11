class Block {
    constructor() {
        this.blockName = "";
        this.elementSeparator = "__";
        this.modSeparator = "_";
    }

    element(name) {
        let selector = '.' +  this.blockName + this.elementSeparator + name;
        let node = document.querySelector(selector);

        node.name = name;
        node.addMod = this.addMod;
        node.removeMod = this.removeMod;
        node.toggleMod = this.toggleMod;
        node.isMod = this.isMod;
        node.blockCtx = this;

        return node;
    }

    elements(name) {
        console.log(name);
    }

    addMod(name, value = null) {
        let modFullName = this.blockCtx.blockName + this.blockCtx.elementSeparator + this.name + this.blockCtx.modSeparator + name;
        this.classList.add(modFullName);
    }

    removeMod(name, value = null) {
        let modFullName = this.blockCtx.blockName + this.blockCtx.elementSeparator + this.name + this.blockCtx.modSeparator + name;
        this.classList.remove(modFullName);
    }

    toggleMod(name, value = null) {
        let modFullName = this.blockCtx.blockName + this.blockCtx.elementSeparator + this.name + this.blockCtx.modSeparator + name;
        this.classList.toggle(modFullName);
    }

    isMod(name, value = null) {
        let modFullName = this.blockCtx.blockName + this.blockCtx.elementSeparator + this.name + this.blockCtx.modSeparator + name;
        console.log(modFullName);
        return this.classList.contains(modFullName);
    }
}

class MyBlock extends Block {
    constructor() {
        super();

        this.blockName = "form";
        let input = this.element('input');

        input.addMod('name');
        input.addMod('name_2');
        input.removeMod('name_2');
        console.log(input.isMod('name_2'));
        input.toggleMod('name_2');
        console.log(input.isMod('name_2'));
    }
}

let myBlock = new MyBlock;
