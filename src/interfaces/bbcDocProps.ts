export interface NewsArticle {
  title: string;
  desc: string;
  items: NewsItem[];
}

export interface NewsItem {
  title: string;
  url: string;
  desc: string;
  content: string;
  time: string;
}
