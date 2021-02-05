import { db } from '../../../../firebase/firebase';

export const setAsPendingInFirestore = async ({ searchQuery }) => {
  if (!searchQuery) {
    return;
  }
  try {
    const locationsRef = db.collection('locations');
    const result = await locationsRef
      .doc(searchQuery)
      .set({ url: 'pending' }, { merge: true });
    if (result === undefined) {
      return;
    }
  } catch (e) {
    console.log(e);
  }
};
