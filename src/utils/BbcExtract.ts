import {
  collection,
  getFirestore,
  setDoc,
  getDocs,
  addDoc,
  doc,
} from "firebase/firestore";
import firebaseApp from "./firebase";
import { Mailer } from "./nodemailer";
import * as cheerio from "cheerio";
import { NewsItem } from "../interfaces/bbcDocResponse";
async function imgExtract(htmlContent: string) {
  try {
    const $ = cheerio.load(htmlContent);

    const imgTags = $("img").first();

    const src = imgTags.attr("src");
    return src;
  } catch (error) {
    console.log(error);
  }
}

export async function HTMLextract() {
  try {
    const collectionName = "htmlwithImg";
    const url =
      "https://morss.it/:format=json:cors/feeds.bbci.co.uk/news/rss.xml";
    const json = await fetch(url).then((res) => res.json());
    const db = getFirestore(firebaseApp);
    const collectionRef = collection(db, collectionName);

    const existingTitles = new Set(
      (await getDocs(collectionRef)).docs.map((_doc) => _doc.data().title),
    );

    const docsConvert = json.items.map(async (item: NewsItem) => {
      // Check if content is present and the entry doesn't exist
      if (item.content && !existingTitles.has(item.title)) {
        const img = await imgExtract(item.content);
        const imgFieldValue = img !== undefined ? img : null;
        const docRef = await addDoc(collectionRef, {
          title: item.title,
          description: item.desc,
          article: item.content,
          time: item.time,
          url: item.url,
          img: imgFieldValue,
        });

        const docId = docRef.id;

        // Update the document with the ID
        await setDoc(doc(collectionRef, docId), { docId }, { merge: true });
      }
    });

    const titlesWithContent = json.items
      .filter(
        (item: NewsItem) => item.content && !existingTitles.has(item.title),
      )
      .map((item: NewsItem) => item.title);

    if (titlesWithContent.length > 0) {
      await Promise.all(docsConvert).then(() => {
        Mailer(
          "Items with content were successfully added!",
          titlesWithContent,
        );
      });
    } else {
      console.log("No new items with content to add.Exiting program");
      return;
    }
  } catch (error) {
    console.log(error);
  }
}
