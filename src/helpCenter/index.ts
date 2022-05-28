import { articles as articlesIt } from "./articlesIt";
export interface HelpCenterArticle {
  id: string;
  title: string;
  content: string;
  tags: string[];
  related?: string[];
}

export const getArticles = (): HelpCenterArticle[] => articlesIt;
export const getArticle = (id: string): HelpCenterArticle | undefined =>
  articlesIt.find((a) => a.id === id);

export const getArticleAssetUrl = (filename: string) =>
  require.context("../assets/", false)(filename);
