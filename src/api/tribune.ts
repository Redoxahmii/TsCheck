import express from "express";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import firebaseApp from "../utils/firebase";
const router = express.Router();

const db = getFirestore(firebaseApp);
router.get("/", (_req, res) => {
  res.json({ message: "Tribune API" });
});

router.post("/", async (req, res) => {
  try {
    const { tribune } = req.body;
    console.log(tribune);
    const collectionRef = collection(db, `tribune-${tribune}`);
    const querySnapshot = await getDocs(collectionRef);
    const docs = querySnapshot.docs.map((doc) => doc.data());
    res.json({ message: "success", data: docs });
  } catch (error) {
    console.error("Error in fetching", error);
  }
});
export default router;
