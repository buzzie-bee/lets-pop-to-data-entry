const { db } = require('../../../../firebase/firebase');

export const checkExistsInFirestore = async (searchQuery) => {
  try {
    const doc = await db.collection('locations').doc(searchQuery).get();
    if (doc.exists) {
      return true;
    }
    console.log('doc doesnt exist', searchQuery);
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};
