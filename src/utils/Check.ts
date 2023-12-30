import firebaseApp from "./firebase";
import { getFirestore, collection } from "firebase/firestore";

async function Foo() {
  try {
    const db = getFirestore(firebaseApp);
  } catch (error) {
    console.log(error);
  }
}

Foo();
