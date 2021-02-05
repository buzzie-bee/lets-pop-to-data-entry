import { db } from '../../../../firebase/firebase';

export const saveImageDataToFirestore = async ({
  saveNotFoundValue,
  searchQuery,
  selectedImages,
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
        const nextDoc = doc.data();
        history.push(`/loading/${nextDoc.query}`);
      });
    }
  } catch (e) {
    console.log(e);
  }
};
