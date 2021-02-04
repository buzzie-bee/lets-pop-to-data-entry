import { db } from '../../../firebase/firebase';

export const saveImageDataToFirestore = async ({
  saveNotFoundValue,
  searchQuery,
  selectedImages,
  setImages,
  setSelectedImages,
  setLoading,
  setGatheringImages,
  setPage,
  setTotalResults,
  setDialogOpen,
  history,
}) => {
  try {
    const locationsRef = db.collection('locations');
    const dataPayload = saveNotFoundValue
      ? {
          imgUrl: 'NoValidImg',
        }
      : {
          images: selectedImages,
          imgUrl: selectedImages[0].imageData.url,
        };
    const result = await locationsRef
      .doc(searchQuery)
      .set(dataPayload, { merge: true });

    if (result === undefined) {
      const snapshot = await locationsRef
        .where('imgUrl', '==', '')
        .limit(1)
        .get();
      snapshot.forEach((doc) => {
        setImages([]);
        setSelectedImages([]);
        setLoading(true);
        setGatheringImages(false);
        setPage(1);
        setTotalResults(0);
        setDialogOpen(false);
        setTimeout(() => {
          const nextDoc = doc.data();
          history.push(`/entry/${nextDoc.query}`);
        }, 2000);
      });
    }
  } catch (e) {
    console.log(e);
  }
};
