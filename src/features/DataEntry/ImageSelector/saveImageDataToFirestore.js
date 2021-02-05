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
  resetOverlay,
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
        .orderBy('occurances', 'desc')
        .limit(1)
        .get();
      snapshot.forEach((doc) => {
        setImages([]);
        setSelectedImages([]);
        setLoading(true);
        setGatheringImages(false);
        setPage(0);
        setTotalResults(0);
        setDialogOpen(false);
        resetOverlay();
        setTimeout(() => {
          const nextDoc = doc.data();
          history.push(`/entry/${nextDoc.query}`);
        }, 2000);
        setTimeout(() => {
          setPage(1);
        }, 3000);
      });
    }
  } catch (e) {
    console.log(e);
  }
};
