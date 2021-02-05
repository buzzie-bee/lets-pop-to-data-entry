const { db } = require('../../../../firebase/firebase');

export const checkExistsInFirestore = (searchQuery) => {
  try {
    const doc = db.collection('locations').document(searchQuery);
    if (doc.exists) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};
