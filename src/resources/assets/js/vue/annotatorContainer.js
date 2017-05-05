/**
 * View model for the annotator container
 */
biigle.$viewModel('annotator-container', function (element) {
    var events = biigle.$require('biigle.events');
    var imagesIds = biigle.$require('annotations.imagesIds');
    var imagesStore = biigle.$require('annotations.stores.images');
    var urlParams = biigle.$require('volumes.urlParams');

    new Vue({
        el: element,
        mixins: [biigle.$require('core.mixins.loader')],
        components: {
            sidebar: biigle.$require('annotations.components.sidebar'),
            sidebarTab: biigle.$require('core.components.sidebarTab'),
            labelsTab: biigle.$require('annotations.components.labelsTab'),
            annotationCanvas: biigle.$require('annotations.components.annotationCanvas'),
        },
        data: {
            currentImageIndex: null,
            currentImage: null,
            // Initial map viewport.
            mapCenter: undefined,
            mapResolution: undefined,
        },
        computed: {
            currentImageId: function () {
                return imagesIds[this.currentImageIndex];
            },
            currentImagePromise: function () {
                return imagesStore.fetchImage(this.currentImageId);
            },
        },
        methods: {
            setCurrentImage: function (image) {
                this.currentImage = image;
            },
            getNextIndex: function (index) {
                return (index + 1) % imagesIds.length;
            },
            getPreviousIndex: function (index) {
                return (index + imagesIds.length - 1) % imagesIds.length;
            },
            nextImage: function () {
                if (!this.loading) {
                    this.currentImageIndex = this.getNextIndex(this.currentImageIndex);
                }
            },
            previousImage: function () {
                if (!this.loading) {
                    this.currentImageIndex = this.getPreviousIndex(this.currentImageIndex);
                }
            },
            handleMapMoveend: function (viewport) {
                this.mapCenter = viewport.center;
                this.mapResolution = viewport.resolution;
                urlParams.set({
                    r: Math.round(viewport.resolution * 100),
                    x: Math.round(viewport.center[0]),
                    y: Math.round(viewport.center[1]),
                });
            },
        },
        watch: {
            currentImageIndex: function (index) {
                var previousId = imagesIds[this.getPreviousIndex(index)];
                var nextId = imagesIds[this.getNextIndex(index)];
                events.$emit('images.change', this.currentImageId, previousId, nextId);
                this.startLoading();
                this.currentImagePromise.then(this.setCurrentImage);
                Vue.Promise.all([this.currentImagePromise]).then(this.finishLoading);
            },
        },
        created: function () {
            this.startLoading();
            var keyboard = biigle.$require('labelTrees.stores.keyboard');

            keyboard.on(37, this.previousImage);
            keyboard.on(32, this.nextImage);
            keyboard.on(39, this.nextImage);

            this.currentImageIndex = imagesIds.indexOf(biigle.$require('annotations.imageId'));

            if (urlParams.get('r') !== undefined) {
                this.mapResolution = parseInt(urlParams.get('r'), 10) / 100;
            }

            if (urlParams.get('x') !== undefined && urlParams.get('y') !== undefined) {
                this.mapCenter = [
                    parseInt(urlParams.get('x'), 10),
                    parseInt(urlParams.get('y'), 10),
                ];
            }
        },
    });
});
