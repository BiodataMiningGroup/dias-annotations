/**
 * The labels tab of the annotator
 *
 * @type {Object}
 */
biigle.$component('annotations.components.labelsTab', {
    components: {
        labelTrees: biigle.$require('labelTrees.components.labelTrees'),
    },
    data: function () {
        return {
            labelTrees: biigle.$require('annotations.labelTrees'),
            selectedLabel: null,
        };
    },
    computed: {
        plugins: function () {
            return biigle.$require('annotations.components.labelsTabPlugins');
        },
    },
    methods: {
        handleSelectedLabel: function (label) {
            this.selectedLabel = label;
            this.$emit('select', label);
        },
        handleDeselectedLabel: function (label) {
            this.selectedLabel = null;
            this.$emit('select', null);
        },
    }
});

/**
 * Additional components that can be dynamically added by other Biigle modules via
 * view mixins. These components are meant for the "annotationsLabelsTab" view mixin
 * mount point.
 *
 * @type {Object}
 */
biigle.$declare('annotations.components.labelsTabPlugins', {});
