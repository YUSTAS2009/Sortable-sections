/*-----------------------------------------------------------------------------

		Sortable sections

version:   	1.0
date:      	25/09/17
author:		Yurii Tkachyk
email:     	info@themepunch.com
website:   	https://www.linkedin.com/in/yuriy-tkachyk-abb09237/
-----------------------------------------------------------------------------*/



var DropSections = (function ($) {

    //Tree constructor
    var ElementsTree = function(parent, children, id, dataItem) {
        this.parent = parent;
        this.children = children;
        this.id = id;
        this.dataItem = dataItem;
    };

    //DOM elements
    var bodyEl = $('body');
    var dragContainer = $(".drag-container");
    var sortableElements = $('.sortable-item');
    var toggleButton = $('.toggle-sortable');
    var sortableTree = $(".sortable-tree");
    var treeElements;

    var globalOptions = {
        //Switch sortable mode
        switchMode: true,
        //State
        domState: [],
        //Position to drop the element
        diff: null,
        switchEditing: function() {
            if (this.switchMode) {
                bodyEl.addClass('show-tree-block');
                dragContainer.sortable("enable");
                sortableTree.sortable("enable");
                this.switchMode = !this.switchMode;
            }else {
                bodyEl.removeClass('show-tree-block');
                dragContainer.sortable("disable");
                sortableTree.sortable("disable");
                this.switchMode = !this.switchMode;
            }
        },
        createDomState: function() {
            sortableElements.map(function(index) {
                return globalOptions.createElementsObjects(this, index);
            });
        },
        createElementsObjects: function(element, id) {
            var dataElem = $(element).data('item');
            var elId = $(element).attr('id');
            this.domState.push(new ElementsTree(element, [], elId, dataElem));
        },
        //Searching for position to drop
        findDifference: function(old_pos, treeOption) {
            //Searching for old position
            if (treeOption === undefined) {
                this.domState.map(function(element, i) {
                    if (element.id === old_pos) {
                        return globalOptions.diff = i;
                    }
                });
            }else {
                treeOption.map(function(i, element) {
                    if ($(element).attr('dataId') === old_pos) {
                        return globalOptions.diff = i;
                    }
                });
            }
        },
        //Init mini Tree
        createMiniTree: function() {
            this.domState.forEach(function(item, i) {
                return $('<div/>', { id: 'tree' + item.id, dataId: i, 'data-sort': i, class: 'sortable-item-2' , text: item.dataItem }).appendTo('.sortable-tree');
            });
        },
        //Sort data-sort after updating
        createSortId: function(domEl) {
            domEl.map(function(index) {
                return this.dataset.sort = index;
            });
        },
        //Update DOM
        updateTree: function(currElement, elementsArray) {
            var self = this;
            var currentEl = Number(currElement);
            // console.log(currElement);
            // console.log(this.diff);
            var curEl = $(elementsArray.eq(currentEl));
            if (self.diff !== 0 && currentEl < self.diff) {
                curEl.insertAfter(elementsArray.eq(self.diff));
            }else {
                curEl.insertBefore(elementsArray.eq(self.diff));
            }
            sortableElements = $('.sortable-item');
            treeElements = $('.sortable-item-2');
            globalOptions.createSortId(sortableElements);
            globalOptions.createSortId(treeElements);
        },
        init: function () {
            this.createDomState();
            this.createMiniTree();
        }
    };

    //Event handlers

    //Dom sortable listener
    dragContainer.sortable({
        item: '.sortable-item',
        opacity: 0.9,
        start: function() {
            bodyEl.addClass('move');
        },
        stop: function() {
            bodyEl.removeClass('move');
        },
        update: function(event, ui) {
            sortableElements = $('.sortable-item');
            treeElements = $('.sortable-item-2');
            var dragItem = ui.item.attr('id');
            var dragItemData = ui.item.attr('data-sort');
            globalOptions.domState = [];
            globalOptions.diff = '';
            globalOptions.createDomState();
            globalOptions.findDifference(dragItem);
            globalOptions.updateTree(dragItemData, treeElements);
        },
        out: function() {
            $(document).trigger("mouseup");
        }
    });

    //Tree sortable listener
    sortableTree.sortable({
        item: '.sortable-item-2',
        opacity: 0.9,
        start: function() {
            bodyEl.addClass('move');
        },
        stop: function() {
            bodyEl.removeClass('move');
        },
        update: function(event, ui) {
            sortableElements = $('.sortable-item');
            treeElements = $('.sortable-item-2');
            var dragItem = ui.item.attr('dataId');
            var dragItemData = ui.item.attr('data-sort');
            globalOptions.domState = [];
            globalOptions.diff = '';
            globalOptions.createDomState();
            globalOptions.findDifference(dragItem, treeElements);
            globalOptions.updateTree(dragItemData, sortableElements);
        },
        out: function() {
            $(document).trigger("mouseup");
        }
    });
    //Disable editing
    dragContainer.sortable("disable");
    sortableTree.sortable("disable");

    //Trigger button (switch mode)
    toggleButton.on('click', globalOptions.switchEditing.bind(globalOptions));

    return {
        init: globalOptions.init.bind(globalOptions)
    };

})(jQuery);

DropSections.init();