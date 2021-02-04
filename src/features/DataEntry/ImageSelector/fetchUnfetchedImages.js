import { fetchImage } from './fetchImage';

export const fetchUnfetchedImages = async ({
  images,
  setGatheringImages,
  setLoading,
  setImages,
}) => {
  if (!images.length) {
    return;
  }
  setGatheringImages(true);
  console.log('imgs before adding data =>', images);
  const updatedImages = await Promise.all(
    images.map(async (img) => {
      if (!('imageData' in img)) {
        const imageData = await fetchImage({ id: img.id, setLoading });
        img.imageData = imageData;
        return img;
      }
      return img;
    })
  );
  console.log('imgs after adding data =>', updatedImages);
  setImages(updatedImages);
  setGatheringImages(false);
};
