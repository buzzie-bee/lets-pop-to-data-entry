import { db } from '../../../../firebase/firebase';
import { checkExistsInFirestore } from './checkExistsInFirestore';

export const setAsPendingInFirestore = async ({ searchQuery }) => {
  if (!searchQuery) {
    return;
  }
  if (!checkExistsInFirestore(searchQuery)) {
    return;
  }
  try {
    const locationsRef = db.collection('locations');
    const result = await locationsRef
      .doc(searchQuery)
      .set({ imgUrl: 'pending' }, { merge: true });
    if (result === undefined) {
      return;
    }
  } catch (e) {
    console.log(e);
  }
};
