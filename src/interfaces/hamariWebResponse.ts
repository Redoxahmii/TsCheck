export type HamariWebProps = {
  id: string;
  title: string;
  description: string;
  link: string;
  author: string;
  published: number;
  category: string[];
  content: string;
  content_encoded: string;
  media: Record<string, any>; // You may want to define a specific type for media
};
