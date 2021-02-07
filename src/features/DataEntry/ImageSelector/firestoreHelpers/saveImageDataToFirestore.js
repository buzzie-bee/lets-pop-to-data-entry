import { db, FieldValue } from '../../../../firebase/firebase';
import { checkExistsInFirestore } from './checkExistsInFirestore';

export const saveImageDataToFirestore = async ({
  saveNotFoundValue,
  searchQuery,
  selectedImages,
  history,
}) => {
  try {
    const exists = await checkExistsInFirestore(searchQuery);
    if (!exists) {
      return;
    }
    const locationsRef = db.collection('locations');
    const dataPayload = saveNotFoundValue
      ? {
          imgUrl: 'NoValidImg',
        }
      : {
          images: selectedImages,
          imgUrl: selectedImages[0].url_l,
        };

    const result = await locationsRef
      .doc(searchQuery)
      .set(dataPayload, { merge: true });

    if (result === undefined) {
      const statRef = db.collection('stats').doc('stats');
      const statUpdate = await statRef.update({
        count: FieldValue.increment(1),
      });

      if (statUpdate === undefined) {
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
    }
  } catch (e) {
    console.log(e);
  }
};
