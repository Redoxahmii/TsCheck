import express from "express";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import firebaseApp from "../utils/firebase";
const router = express.Router();

const db = getFirestore(firebaseApp);
router.post("/", async (req, res) => {
  try {
    const { param } = req.body;
    console.log(param);
    const collectionRef = collection(db, `tribune-${param}`);
    const querySnapshot = await getDocs(collectionRef);
    const docs = querySnapshot.docs.map((doc) => doc.data());
    res.json({ message: "success", data: docs });
  } catch (error) {
    console.error("Error in fetching", error);
  }
});
export default router;
