
import { Book } from "../types";

export type PriceRange = "lt100" | "100to300" | "gt300" | null;

export interface BookFilter {
  keyword: string;
  categoryId: number | null;
  priceRange: PriceRange;
}

export const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();

export function filterBooks(
  books: Book[],
  filter: BookFilter
): Book[] {
  const keyword = normalize(filter.keyword);

  return books.filter((book) => {
    const matchesKeyword =
      keyword === "" ||
      normalize(book.title).includes(keyword) ||
      normalize(book.author).includes(keyword);

    const matchesCategory =
      filter.categoryId === null ||
      book.categoryId === filter.categoryId;

    const matchesPrice =
      filter.priceRange === null ||
      (filter.priceRange === "lt100" && book.price < 100000) ||
      (filter.priceRange === "100to300" &&
        book.price >= 100000 &&
        book.price <= 300000) ||
      (filter.priceRange === "gt300" && book.price > 300000);

    return matchesKeyword && matchesCategory && matchesPrice;
  });
}
