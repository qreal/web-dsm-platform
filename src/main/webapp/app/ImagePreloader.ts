class ImagePreloader {

    static preloadImages(arrayOfImages: Array<string>): void {
        arrayOfImages.forEach( function (image: string) {
            new Image().src = image;
        });
    }
}