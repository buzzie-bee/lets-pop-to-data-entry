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
  setImages(updatedImages);
  setGatheringImages(false);
};
