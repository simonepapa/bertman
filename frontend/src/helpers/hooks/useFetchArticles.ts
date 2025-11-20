import { Article, CustomTreeItem } from "../../types/global";
import { getQuartiereName } from "../utils";
import { useState, useEffect, useCallback } from "react";

const mesi = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const reverseMonths = [...mesi].reverse();

const useFetchArticles = (
  setIsLoading: (loading: boolean) => void,
  isTree: boolean = false
) => {
  const [treeArticles, setTreeArticles] = useState<Article[] | null>(null);
  const [articles, setArticles] = useState<CustomTreeItem[] | null>([]);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:3000/api/get-articles");
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const jsonData = await response.json();

      if (isTree) {
        // Set articles to later retrieve one of them
        setTreeArticles(jsonData);
        setArticles(null); // reset items to later fill them
      }

      let monthIndex = 0;
      let yearIndex = 0;

      const quartieri: string[] = Array.from(
        new Set(jsonData.map((article: Article) => article.quartiere))
      );
      const struttura: CustomTreeItem[] = quartieri.map(
        (quartiere: string, index: number) => ({
          id: `quartiere_${index + 1}`,
          label: getQuartiereName(quartiere),
          children: []
        })
      );

      const getMonthLabel = (
        dateString: string
      ): { id: string; label: string } => {
        const date = new Date(dateString);
        const month = date.getMonth();
        return { id: `month_${monthIndex++}`, label: mesi[month] };
      };

      jsonData.forEach((article: Article) => {
        const quartiere = struttura.find(
          (q) => q.label === getQuartiereName(article.quartiere || "")
        );
        if (!quartiere) return;

        const dateObj = new Date(article?.date.replace(" ", "T"));
        const year = dateObj.getFullYear().toString();
        const { id: monthId, label: monthLabel } = getMonthLabel(article.date);

        let yearNode = quartiere.children?.find((y) => y.label === year);
        if (!yearNode) {
          yearNode = { id: `year_${yearIndex++}`, label: year, children: [] };
          quartiere.children?.push(yearNode);
        }

        let month = yearNode.children?.find((m) => m.label === monthLabel);
        if (!month) {
          month = { id: monthId, label: monthLabel, children: [] };
          yearNode.children?.push(month);
        }

        if (!month.children?.find((m) => m.id === article.id.toString())) {
          month.children?.push({
            id: article.id.toString(),
            label: article.title || "",
            url: article.link,
            date: article.date,
            isLastChild: true
          });
        }

        month.children?.sort(
          (a: CustomTreeItem, b: CustomTreeItem) =>
            new Date(b.date as string).getTime() -
            new Date(a.date as string).getTime()
        );
        yearNode.children?.sort(
          (a: CustomTreeItem, b: CustomTreeItem) =>
            reverseMonths.indexOf(a.label) - reverseMonths.indexOf(b.label)
        );
        quartiere.children?.sort(
          (a: CustomTreeItem, b: CustomTreeItem) =>
            parseInt(b.label) - parseInt(a.label)
        );
      });

      setArticles(struttura);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Request error", error);
    }

    setIsLoading(false);
  }, [isTree, setIsLoading, setTreeArticles]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, treeArticles };
};

export default useFetchArticles;
