import { parse } from "rss-to-json";

export async function Foo() {
  try {
    const rss = await parse("https://enews.hamariweb.com/feed/");
    return rss.items;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
