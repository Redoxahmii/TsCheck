import {
  collection,
  addDoc,
  getFirestore,
  where,
  query,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { parse } from "rss-to-json";
import firebaseApp from "./firebase";
import * as cheerio from "cheerio";

export async function FetchHamariWeb() {
  try {
    // Fetch RSS data
    const rss = await parse("https://enews.hamariweb.com/feed/");
    const json = rss.items;

    // Firestore setup
    const collectionName = "hamariweb";
    const db = getFirestore(firebaseApp);
    const collectionRef = collection(db, collectionName);

    // Loop through each item and check if title exists before adding
    for (const item of json) {
      const titleExistsQuery = query(
        collectionRef,
        where("title", "==", item.title),
      );
      const titleExistsSnapshot = await getDocs(titleExistsQuery);

      if (titleExistsSnapshot.empty) {
        // Title doesn't exist, add the document to Firestore
        const dataToAdd = {
          title: item.title,
          link: item.link,
          description: item.description,
          content: item.content,
          content_encoded: item.content_encoded,
          author: item.author,
          published: item.published,
          category: item.category,
          media: item.media,
          imgSrc: null,
          // Add other fields as needed
        };

        try {
          // Add document to Firestore collection and get the document reference
          const docRef = await addDoc(collectionRef, dataToAdd);
          const docId = docRef.id;
          const pageResponse = await fetch(item.link);
          const pageText = await pageResponse.text();
          const $ = cheerio.load(pageText);
          const imgSrc = $("img.entry-thumb").attr("src");

          // Update the document with its ID
          await setDoc(
            doc(collectionRef, docId),
            { docId, imgSrc },
            { merge: true },
          );

          console.log(
            "Document written with ID: ",
            docRef.id,
            " and image added ",
            imgSrc,
          );
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      } else {
        console.log(
          `Document with title '${item.title}' already exists. Skipping.`,
        );
      }
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}
FetchHamariWeb();
