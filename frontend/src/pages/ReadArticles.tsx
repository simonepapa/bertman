import { getCrimeName, getQuartiereName } from "../helpers/utils";
import { Article, CustomTreeItem } from "../types/global";
import {
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { MouseEvent, useCallback, useEffect, useState } from "react";

function ReadArticles() {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [items, setItems] = useState<CustomTreeItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:5000/get-articles`);

      if (response.ok) {
        const jsonData = await response.json();

        // Set articles to later retrieve one of them
        setArticles(jsonData);
        setItems(null); // reset items to later fill them

        // Indices to have unique IDs for TreeView
        let monthIndex = 0;
        let yearIndex = 0;

        // Isolate neighborhoods
        const quartieri: string[] = Array.from(
          new Set(jsonData.map((article: Article) => article.quartiere))
        );

        // Create TreeView structure
        const struttura: CustomTreeItem[] = quartieri.map(
          (quartiere: string, index: number) => ({
            id: "quartiere_" + index + 1,
            label: getQuartiereName(quartiere),
            children: []
          })
        );

        const mesi: string[] = [
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

        const reverseMonths: string[] = [
          "December",
          "November",
          "October",
          "September",
          "August",
          "July",
          "June",
          "May",
          "April",
          "March",
          "February",
          "January"
        ];

        // Get month id and month name
        const getMonthLabel = (
          dateString: string
        ): { id: string; label: string } => {
          const date = new Date(dateString);
          const month = date.getMonth();
          const object = { id: "month_" + monthIndex, label: mesi[month] };
          monthIndex += 1;
          return object;
        };

        jsonData.forEach((article: Article) => {
          // Check if neighborhood exists
          const quartiere: CustomTreeItem | undefined = struttura.find(
            (q) => q.label === getQuartiereName(article.quartiere || "")
          );
          if (quartiere) {
            // Get year
            const dateObj = new Date(article?.date.replace(" ", "T"));
            const year = dateObj.getFullYear().toString();
            const { id: monthId, label: monthLabel } = getMonthLabel(
              article.date
            );

            // Push items into correct year
            let yearNode: CustomTreeItem | undefined =
              quartiere?.children?.find((y) => y.label === year);
            if (!yearNode) {
              yearNode = {
                id: "year_" + yearIndex,
                label: year,
                children: []
              };
              yearIndex += 1;
              quartiere?.children?.push(yearNode);
            }

            // Get month and push items into correct month
            let month: CustomTreeItem | undefined = yearNode?.children?.find(
              (m) => m.label === monthLabel
            );
            if (!month) {
              month = { id: monthId, label: monthLabel, children: [] };
              yearNode?.children?.push(month);
            }

            // Check if article already exists. This check is useful so that no duplicate articles can be found in the articles state
            const alreadyIn: CustomTreeItem | undefined = month?.children?.find(
              (m) => m.id === article.id.toString()
            );

            if (!alreadyIn) {
              month?.children?.push({
                id: article.id.toString(),
                label: article.title || "",
                url: article.link,
                date: article.date,
                isLastChild: true
              });
            }

            // Sort by day
            month?.children?.sort(
              (a: CustomTreeItem, b: CustomTreeItem) =>
                new Date(b?.date as string).getTime() -
                new Date(a?.date as string).getTime()
            );

            // Sort by month
            yearNode?.children?.sort((a: CustomTreeItem, b: CustomTreeItem) => {
              const monthAIndex = reverseMonths.indexOf(a.label);
              const monthBIndex = reverseMonths.indexOf(b.label);

              return monthAIndex - monthBIndex;
            });

            // Sort by year
            quartiere?.children?.sort(
              (a: CustomTreeItem, b: CustomTreeItem) =>
                parseInt(b.label) - parseInt(a.label)
            );
          }
        });

        setItems(struttura);
      } else {
        console.error("Response error", response.status);
      }
    } catch (error) {
      console.error("Request error", error);
    }

    setIsLoading(false);
  }, []);

  const handleArticleClick = (e: MouseEvent, item: string) => {
    // Check if the item id starts with one of the three strings that identify a neighborhood, a month or a year. If it does not, then check if the article exists in the articles state and set the article state to read it
    if (!/^quartiere_|^year_|^month_/.test(item)) {
      const found = articles?.find(
        (article: Article) => article.id.toString() === item
      );

      if (found) {
        setArticle(found);
      }
    }
  };

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-8 mb-12 flex flex-col gap-8 px-4 xl:mx-12 xl:flex-row xl:px-0">
      <div className="w-full xl:w-1/4">
        <h1 className="text-2xl font-bold">Read articles</h1>
        <p>Navigate the articles and click on a title to read it</p>
        <div className="mt-4">
          {isLoading || items === null ? (
            <CircularProgress />
          ) : (
            <RichTreeView
              items={items}
              onItemClick={(e: MouseEvent, item: string) =>
                handleArticleClick(e, item)
              }
            />
          )}
        </div>
      </div>
      <div className="w-full xl:w-3/4">
        {article && (
          <>
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p className="text-text-secondary">{article.date}</p>
            <p className="mt-2">
              {article.content.split("\n").map((str: string, index: number) => (
                <span key={index}>
                  {str}
                  <br />
                </span>
              ))}
            </p>
            <Divider className="!my-4" />
            <h3 className="text-lg font-semibold">Categories</h3>
            <p>
              Note that{" "}
              <span className="text-text-secondary italic">
                xx% of being true
              </span>{" "}
              means that the category is{" "}
              <span className="text-text-secondary italic">xx%</span> likely to
              be true and has nothing to do with the prediction being correct.
              <br />
              The threshold for a category to be true is set to 75%.
            </p>
            <List dense={true} className="!flex !flex-wrap">
              <ListItem className="w-full sm:max-w-1/2 xl:max-w-1/4">
                <ListItemText
                  primary={
                    <p>
                      <span className="font-semibold">
                        {getCrimeName("aggressione")}
                      </span>
                      : {article?.aggressione === 0 ? "false" : "true"}
                    </p>
                  }
                  secondary={`${(article?.aggressione_prob || 0 * 100).toFixed(2)}% probability of this label being true`}
                />
              </ListItem>
              <ListItem className="w-full sm:max-w-1/2 xl:max-w-1/4">
                <ListItemText
                  primary={
                    <p>
                      <span className="font-semibold">
                        {getCrimeName("associazione_di_tipo_mafioso")}
                      </span>
                      :{" "}
                      {article?.associazione_di_tipo_mafioso === 0
                        ? "false"
                        : "true"}
                    </p>
                  }
                  secondary={`${(article?.associazione_di_tipo_mafioso_prob || 0 * 100).toFixed(2)}% probability of this label being true`}
                />
              </ListItem>
              <ListItem className="w-full sm:max-w-1/2 xl:max-w-1/4">
                <ListItemText
                  primary={
                    <p>
                      <span className="font-semibold">
                        {getCrimeName("contrabbando")}
                      </span>
                      : {article?.contrabbando === 0 ? "false" : "true"}
                    </p>
                  }
                  secondary={`${(article?.contrabbando_prob || 0 * 100).toFixed(2)}% probability of this label being true`}
                />
              </ListItem>
              <ListItem className="w-full sm:max-w-1/2 xl:max-w-1/4">
                <ListItemText
                  primary={
                    <p>
                      <span className="font-semibold">
                        {getCrimeName("estorsione")}
                      </span>
                      : {article?.estorsione === 0 ? "false" : "true"}
                    </p>
                  }
                  secondary={`${(article?.estorsione_prob || 0 * 100).toFixed(2)}% probability of this label being true`}
                />
              </ListItem>
              <ListItem className="w-full sm:max-w-1/2 xl:max-w-1/4">
                <ListItemText
                  primary={
                    <p>
                      <span className="font-semibold">
                        {getCrimeName("furto")}
                      </span>
                      : {article?.furto === 0 ? "false" : "true"}
                    </p>
                  }
                  secondary={`${(article?.furto_prob || 0 * 100).toFixed(2)}% probability of this label being true`}
                />
              </ListItem>
              <ListItem className="w-full sm:max-w-1/2 xl:max-w-1/4">
                <ListItemText
                  primary={
                    <p>
                      <span className="font-semibold">
                        {getCrimeName("omicidio")}
                      </span>
                      : {article?.omicidio === 0 ? "false" : "true"}
                    </p>
                  }
                  secondary={`${(article?.omicidio_prob || 0 * 100).toFixed(2)}% probability of this label being true`}
                />
              </ListItem>
              <ListItem className="w-full sm:max-w-1/2 xl:max-w-1/4">
                <ListItemText
                  primary={
                    <p>
                      <span className="font-semibold">
                        {getCrimeName("omicidio_colposo")}
                      </span>
                      : {article?.omicidio_colposo === 0 ? "false" : "true"}
                    </p>
                  }
                  secondary={`${(article?.omicidio_colposo_prob || 0 * 100).toFixed(2)}% probability of this label being true`}
                />
              </ListItem>
              <ListItem className="w-full sm:max-w-1/2 xl:max-w-1/4">
                <ListItemText
                  primary={
                    <p>
                      <span className="font-semibold">
                        {getCrimeName("omicidio_stradale")}
                      </span>
                      : {article?.omicidio_stradale === 0 ? "false" : "true"}
                    </p>
                  }
                  secondary={`${(article?.omicidio_stradale_prob || 0 * 100).toFixed(2)}% probability of this label being true`}
                />
              </ListItem>
              <ListItem className="w-full sm:max-w-1/2 xl:max-w-1/4">
                <ListItemText
                  primary={
                    <p>
                      <span className="font-semibold">
                        {getCrimeName("rapina")}
                      </span>
                      : {article?.rapina === 0 ? "false" : "true"}
                    </p>
                  }
                  secondary={`${(article?.rapina_prob || 0 * 100).toFixed(2)}% probability of this label being true`}
                />
              </ListItem>
              <ListItem className="w-full sm:max-w-1/2 xl:max-w-1/4">
                <ListItemText
                  primary={
                    <p>
                      <span className="font-semibold">
                        {getCrimeName("spaccio")}
                      </span>
                      : {article?.spaccio === 0 ? "false" : "true"}
                    </p>
                  }
                  secondary={`${(article?.spaccio_prob || 0 * 100).toFixed(2)}% probability of this label being true`}
                />
              </ListItem>
              <ListItem className="w-full sm:max-w-1/2 xl:max-w-1/4">
                <ListItemText
                  primary={
                    <p>
                      <span className="font-semibold">
                        {getCrimeName("tentato_omicidio")}
                      </span>
                      : {article?.tentato_omicidio === 0 ? "false" : "true"}
                    </p>
                  }
                  secondary={`${(article?.tentato_omicidio_prob || 0 * 100).toFixed(2)}% probability of this label being true`}
                />
              </ListItem>
              <ListItem className="w-full sm:max-w-1/2 xl:max-w-1/4">
                <ListItemText
                  primary={
                    <p>
                      <span className="font-semibold">
                        {getCrimeName("truffa")}
                      </span>
                      : {article?.truffa === 0 ? "false" : "true"}
                    </p>
                  }
                  secondary={`${(article?.truffa_prob || 0 * 100).toFixed(2)}% probability of this label being true`}
                />
              </ListItem>
              <ListItem className="w-full sm:max-w-1/2 xl:max-w-1/4">
                <ListItemText
                  primary={
                    <p>
                      <span className="font-semibold">
                        {getCrimeName("violenza_sessuale")}
                      </span>
                      : {article?.violenza_sessuale === 0 ? "false" : "true"}
                    </p>
                  }
                  secondary={`${(article?.violenza_sessuale_prob || 0 * 100).toFixed(2)}% probability of this label being true`}
                />
              </ListItem>
            </List>
          </>
        )}
      </div>
    </div>
  );
}
export default ReadArticles;
