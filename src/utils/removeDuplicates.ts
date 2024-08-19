import {
  collection,
  getDocs,
  getFirestore,
  deleteDoc,
  doc,
} from "firebase/firestore";

import firebaseApp from "./firebase";
import { tribuneTypes } from "../interfaces/tribuneResponse";

async function removeDuplicates(type: string) {
  try {
    const db = getFirestore(firebaseApp);
    const collectionRef = collection(db, `tribune-${type}`);
    const querySnapshot = await getDocs(collectionRef);

    // Extracting data from documents
    const docs = querySnapshot.docs.map((doc1) => ({
      id: doc1.id,
      data: doc1.data(),
    }));

    // Check for duplicates based on a specific property (e.g., "title")
    const seenTitles = new Set();
    const duplicateIds: any[] = [];

    docs.forEach((doc2) => {
      if (seenTitles.has(doc2.data.title)) {
        // Duplicate found
        console.log("Duplicate found:", doc2.data.title);
        duplicateIds.push(doc2.id);
      } else {
        // Add the current title to the set
        seenTitles.add(doc2.data.title);
      }
    });

    // Remove duplicates from Firestore
    let removedCount = 0;
    const removalPromises = duplicateIds.map(async (id) => {
      const docRef = doc(collectionRef, id);
      await deleteDoc(docRef);
      console.log(`Duplicate with ID ${id} removed.`);
      removedCount++;
    });

    await Promise.all(removalPromises);

    console.log(
      `Duplicates removed successfully. Total removed: ${removedCount}`,
    );
  } catch (error) {
    console.error("Error in removing duplicates", error);
  }
}

tribuneTypes.forEach((type) => removeDuplicates(type.param));
// removeDuplicates("latest");
