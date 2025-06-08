export interface Article {
  _id: string;
  title: string;
  slug: string;
  originalSource: string;
  summary: string;
  explanation: string;
  tags: string[];
  category: string;
  coverImage: string;
  createdAt: string;
  published: boolean;
} 