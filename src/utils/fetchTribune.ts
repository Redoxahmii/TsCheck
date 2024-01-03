import { parse } from "rss-to-json";
import * as cheerio from "cheerio";
import { NewsArticle } from "../interfaces/tribuneResponse";
import firebaseApp from "./firebase";
import { tribuneTypes } from "../interfaces/tribuneResponse";
import {
  collection,
  addDoc,
  getFirestore,
  where,
  query,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import axios from "axios";

async function extractImg(url: string) {
  try {
    const response = await axios.get(url, {
      timeout: 20000,
    });
    const $ = cheerio.load(response.data);
    const container = $(".featured-image-global");
    const imgSrc = container.find("img").attr("src");
    if (!imgSrc) {
      console.log("No image found for: ", url);
      return null;
    } else {
      console.log("Image found for: ", imgSrc);
      return imgSrc;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function fetchTribune(type: string) {
  try {
    const db = getFirestore(firebaseApp);
    const collectionName = `tribune-${type}`;
    const collectionRef = collection(db, collectionName);
    const url = `https://tribune.com.pk/feed/${type}`;
    const response = await parse(url);
    const articles = response.items;

    const articlePromises = articles.map(async (item: NewsArticle) => {
      const imgSrc = await extractImg(item.link);
      const article = {
        title: item.title,
        imgSrc: imgSrc || null,
        description: item.description,
        link: item.link,
        published: item.published,
        created: item.created,
        category: item.category,
        content: item.content,
        content_encoded: item.content_encoded,
      };

      // Check if an article with the same title exists
      const titleQuery = query(collectionRef, where("link", "==", item.link));
      const titleSnapshot = await getDocs(titleQuery);

      if (titleSnapshot.empty) {
        // Add the article to Firestore
        try {
          const docRef = await addDoc(collectionRef, article);
          console.log(`TRIBUNE ${type}: Document written with ID: `, docRef.id);
          const docId = docRef.id;
          // Include docId in the article object
          await setDoc(doc(collectionRef, docId), { docId }, { merge: true });
        } catch (e) {
          console.error(`TRIBUNE ${type}: Error adding document: `, e);
        }
      } else {
        // Update the existing article if necessary
        titleSnapshot.forEach((_doc) => {
          const existingArticle = _doc.data();
          console.log(
            `TRIBUNE ${type}: Articles with these titles exist already :`,
            existingArticle.title,
          );
        });
      }
    });

    await Promise.all(articlePromises);
    return;
  } catch (error) {
    console.log(error);
  }
}
tribuneTypes.forEach((type) => fetchTribune(type.param));
// WARNING: try not to fetch all at the same time
// fetchTribune("home");
