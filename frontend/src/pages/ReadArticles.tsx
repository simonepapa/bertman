import useFetchArticles from "../helpers/hooks/useFetchArticles";
import { getCrimeName } from "../helpers/utils";
import { Article } from "../types/global";
import {
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import dayjs from "dayjs";
import { MouseEvent, useState } from "react";

function ReadArticles() {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { articles: items, treeArticles: articles } = useFetchArticles(
    setIsLoading,
    true
  );

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

  const downloadJSON = () => {
    const updatedJson = JSON.stringify(items, null, 2);
    const blob = new Blob([updatedJson], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download =
      "articles_from_db-" + dayjs().format("YYYY-MM-DD_HH-mm-ss") + ".json";
    link.click();
  };

  return (
    <div className="mt-8 mb-12 flex flex-col gap-8 px-4 xl:mx-12 xl:flex-row xl:px-0">
      <div className="w-full xl:w-1/4">
        <h1 className="text-2xl font-bold">Read articles</h1>
        <p>Navigate the articles and click on a title to read it</p>
        <div className="mt-4">
          {isLoading || items === null ? (
            <CircularProgress />
          ) : (
            <>
              <RichTreeView
                items={items}
                onItemClick={(e: MouseEvent, item: string) =>
                  handleArticleClick(e, item)
                }
              />
              <Button
                variant="contained"
                onClick={downloadJSON}
                className="!mt-6">
                Download JSON
              </Button>
            </>
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
                  secondary={`${((article?.aggressione_prob || 0) * 100).toFixed(2)}% probability of this label being true`}
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
                  secondary={`${((article?.associazione_di_tipo_mafioso_prob || 0) * 100).toFixed(2)}% probability of this label being true`}
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
                  secondary={`${((article?.contrabbando_prob || 0) * 100).toFixed(2)}% probability of this label being true`}
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
                  secondary={`${((article?.estorsione_prob || 0) * 100).toFixed(2)}% probability of this label being true`}
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
                  secondary={`${((article?.furto_prob || 0) * 100).toFixed(2)}% probability of this label being true`}
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
                  secondary={`${((article?.omicidio_prob || 0) * 100).toFixed(2)}% probability of this label being true`}
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
                  secondary={`${((article?.omicidio_colposo_prob || 0) * 100).toFixed(2)}% probability of this label being true`}
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
                  secondary={`${((article?.omicidio_stradale_prob || 0) * 100).toFixed(2)}% probability of this label being true`}
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
                  secondary={`${((article?.rapina_prob || 0) * 100).toFixed(2)}% probability of this label being true`}
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
                  secondary={`${((article?.spaccio_prob || 0) * 100).toFixed(2)}% probability of this label being true`}
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
                  secondary={`${((article?.tentato_omicidio_prob || 0) * 100).toFixed(2)}% probability of this label being true`}
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
                  secondary={`${((article?.truffa_prob || 0) * 100).toFixed(2)}% probability of this label being true`}
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
                  secondary={`${((article?.violenza_sessuale_prob || 0) * 100).toFixed(2)}% probability of this label being true`}
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
