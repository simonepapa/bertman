import { getCrimeName } from "../helpers/utils";
import { Article, LabeledArticle } from "../types/global";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";

function LabelArticles() {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [labeledArticles, setLabeledArticles] = useState<
    LabeledArticle[] | null
  >(null);
  const [currentArticle, setCurrentArticle] = useState<number>(0);
  const [quartiere, setQuartiere] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleChangeQuartiere = (event: SelectChangeEvent) => {
    if (!isLoading) {
      setQuartiere(event.target.value as string);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isLoading) {
      if (!event.target.files) {
        setError("Please upload a valid JSON file.");
      } else {
        setError("");

        const file = event.target.files[0];
        if (file && file.type === "application/json") {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              if (!reader.result) {
                setError("Error reading the file");
              } else {
                const data: Article[] = (JSON.parse(reader.result as string) ||
                  "[{}]") as Article[];

                setArticles(data);
              }
            } catch (error) {
              setError("Failed to parse JSON: " + error);
            }
          };
          reader.readAsText(file);
        } else {
          setError("Please upload a valid JSON file.");
        }
      }
    }
  };

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!isLoading) {
        setIsLoading(true);

        try {
          const response = await fetch(`http://127.0.0.1:5000/label-articles`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              jsonFile: articles,
              quartiere: quartiere
            })
          });

          if (response.ok) {
            const labeledArticles = await response.json();
            setLabeledArticles(labeledArticles);
          } else {
            console.error("Response error", response.status);
          }
        } catch (error) {
          console.error("Request error", error);
        }

        setIsLoading(false);
      }
    },
    [articles, isLoading, quartiere]
  );

  const handlePrevArticle = () => {
    if (currentArticle > 0) {
      setCurrentArticle(currentArticle - 1);
    }
  };
  const handleNextArticle = () => {
    if (labeledArticles && currentArticle < labeledArticles.length - 1) {
      setCurrentArticle(currentArticle + 1);
    }
  };
  const handleUploadToDatabase = useCallback(async () => {
    if (!isLoading && !isUploading) {
      setIsUploading(true);

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/upload-to-database`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              jsonFile: labeledArticles
            })
          }
        );

        if (response.ok) {
          setArticles(null);
          setLabeledArticles(null);
          setCurrentArticle(0);
          setQuartiere("");
          enqueueSnackbar("Articles uploaded succesfully", {
            variant: "success"
          });
        } else {
          enqueueSnackbar(
            "Something went wrong while uploading articles to database",
            {
              variant: "error"
            }
          );
          console.error("Response error", response.status);
        }
      } catch (error) {
        console.error("Request error", error);
      }

      setIsUploading(false);
    }
  }, [isLoading, isUploading, labeledArticles]);

  const handleChangeLabel = (
    event: ChangeEvent<HTMLInputElement>,
    cat: string
  ) => {
    const categories = [
      "omicidio",
      "omicidio_colposo",
      "omicidio_stradale",
      "tentato_omicidio",
      "furto",
      "rapina",
      "violenza_sessuale",
      "aggressione",
      "spaccio",
      "truffa",
      "estorsione",
      "contrabbando",
      "associazione_di_tipo_mafioso"
    ];

    if (labeledArticles && categories.includes(cat)) {
      const copyLabeled = [...labeledArticles];
      const value = copyLabeled[currentArticle][cat].value;
      copyLabeled[currentArticle][cat].value = value === 0 ? 1 : 0;

      setLabeledArticles(copyLabeled);
    }
  };

  return (
    <>
      <div className="mt-8 mb-12 flex flex-col gap-8 px-4 xl:mx-12 xl:flex-row xl:px-0">
        <div className="w-full xl:w-1/4">
          <div>
            <h1 className="text-2xl font-bold">Label articles</h1>
            <h2 className="text-lg">
              Automatically label articles using a BERT model, then revise them
              and upload them to the database
              <br />
              <span className="font-medium">IMPORTANT</span>: this function
              works the best by using a dedicated GPU. It is possible to label
              articles with a CPU, but it will require much more time
            </h2>
            <p className="mt-4">
              Upload a JSON file with an array of objects like the following:
            </p>
            <div>
              <Box
                component="section"
                sx={{
                  p: 1,
                  border: "1px solid grey",
                  mt: 2,
                  width: "fit-content"
                }}>
                <p>
                  {`{`}
                  <br />
                  &nbsp;&nbsp;&nbsp;link: string, <br />
                  &nbsp;&nbsp;&nbsp;title: string, <br />
                  &nbsp;&nbsp;&nbsp;date: string ("YYYY-MM-dd HH:mm:ss"), <br />
                  &nbsp;&nbsp;&nbsp;content: string
                  <br />
                  {`}`}
                </p>
              </Box>
              <Divider className="!my-8" />
            </div>
          </div>
          <div>
            <FormControl
              component="form"
              fullWidth={true}
              method="POST"
              onSubmit={handleSubmit}
              className="flex max-w-[400px] flex-col gap-4">
              <InputLabel id="demo-simple-select-label">
                Neighborhood
              </InputLabel>
              <Select
                disabled={isLoading}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={quartiere}
                label="Neighborhood"
                onChange={handleChangeQuartiere}
                required={true}>
                <MenuItem value={"bari-vecchia_san-nicola"}>
                  Bari Vecchia - San Nicola
                </MenuItem>
                <MenuItem value={"carbonara"}>Carbonara</MenuItem>
                <MenuItem value={"carrassi"}>Carrassi</MenuItem>
                <MenuItem value={"ceglie-del-campo"}>Ceglie del Campo</MenuItem>
                <MenuItem value={"japigia"}>Japigia</MenuItem>
                <MenuItem value={"liberta"}>Libertà</MenuItem>
                <MenuItem value={"loseto"}>Loseto</MenuItem>
                <MenuItem value={"madonnella"}>Madonnella</MenuItem>
                <MenuItem value={"murat"}>Murat</MenuItem>
                <MenuItem value={"palese-macchie"}>Palese - Macchie</MenuItem>
                <MenuItem value={"picone"}>Picone</MenuItem>
                <MenuItem value={"san-girolamo_fesca"}>
                  San Girolamo - Fesca
                </MenuItem>
                <MenuItem value={"san-paolo"}>San Paolo</MenuItem>
                <MenuItem value={"san-pasquale"}>San Pasquale</MenuItem>
                <MenuItem value={"santo-spirito"}>Santo Spirito</MenuItem>
                <MenuItem value={"stanic"}>Stanic</MenuItem>
                <MenuItem value={"torre-a-mare"}>Torre a mare</MenuItem>
              </Select>
              <Button
                disabled={isLoading}
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}>
                Upload JSON file
                <input
                  className="hidden-input"
                  type="file"
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleFileChange(event)
                  }
                  multiple={false}
                  required={true}
                />
              </Button>
              <Divider />
              <Button
                disabled={isLoading}
                loading={isLoading}
                variant="contained"
                type="submit"
                color={error === "" ? "primary" : "error"}>
                Submit
              </Button>
              {error !== "" && <p>{error}</p>}
            </FormControl>
          </div>
        </div>
        <div className="w-full xl:w-3/4">
          {labeledArticles && (
            <>
              <div className="mb-8 flex justify-between">
                {currentArticle > 0 && (
                  <Button
                    disabled={currentArticle === 0 || isUploading}
                    variant="contained"
                    startIcon={<ArrowBackIosOutlinedIcon />}
                    onClick={handlePrevArticle}
                    className="!w-fit">
                    Previous article
                  </Button>
                )}
                {currentArticle < labeledArticles.length - 1 ? (
                  <Button
                    disabled={
                      currentArticle === labeledArticles.length - 1 ||
                      isUploading
                    }
                    variant="contained"
                    endIcon={<ArrowForwardIosOutlinedIcon />}
                    onClick={handleNextArticle}
                    className="!ml-auto !w-fit">
                    Next article
                  </Button>
                ) : (
                  <Button
                    disabled={
                      currentArticle !== labeledArticles.length - 1 ||
                      isUploading
                    }
                    variant="contained"
                    endIcon={<StorageOutlinedIcon />}
                    onClick={handleUploadToDatabase}
                    className="!ml-auto !w-fit">
                    Upload to database
                  </Button>
                )}
              </div>
              <p className="text-text-secondary text-sm">
                Article {currentArticle + 1} of {labeledArticles.length}
              </p>
              <h2 className="text-xl font-bold">
                {labeledArticles[currentArticle].title}
              </h2>
              <p className="text-text-secondary">
                {labeledArticles[currentArticle].date}
              </p>
              <p className="mt-2">
                {labeledArticles[currentArticle].content
                  .split("\n")
                  .map((str: string, index: number) => (
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
                <span className="text-text-secondary italic">xx%</span> likely
                to be true and has nothing to do with the prediction being
                correct.
                <br />
                The threshold for a category to be true is set to 75%.
              </p>
              <List dense={true} className="!flex !flex-wrap">
                <ListItem className="flex w-full items-center gap-2 sm:max-w-1/2 xl:max-w-1/4">
                  <Switch
                    checked={
                      labeledArticles[currentArticle]?.aggressione.value === 1
                    }
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeLabel(event, "aggressione")
                    }
                  />
                  <ListItemText
                    primary={
                      <p>
                        <span className="font-semibold">
                          {getCrimeName("aggressione")}
                        </span>
                        :{" "}
                        {labeledArticles[currentArticle]?.aggressione.value ===
                        0
                          ? "false"
                          : "true"}
                      </p>
                    }
                    secondary={`${((labeledArticles[currentArticle]?.aggressione.prob || 0) * 100).toFixed(2)}% probability of this label being true`}
                  />
                </ListItem>
                <ListItem className="items-cente rgap-2 flex w-full sm:max-w-1/2 xl:max-w-1/4">
                  <Switch
                    checked={
                      labeledArticles[currentArticle]
                        ?.associazione_di_tipo_mafioso.value === 1
                    }
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeLabel(event, "associazione_di_tipo_mafioso")
                    }
                  />
                  <ListItemText
                    primary={
                      <p>
                        <span className="font-semibold">
                          {getCrimeName("associazione_di_tipo_mafioso")}
                        </span>
                        :{" "}
                        {labeledArticles[currentArticle]
                          ?.associazione_di_tipo_mafioso.value === 0
                          ? "false"
                          : "true"}
                      </p>
                    }
                    secondary={`${((labeledArticles[currentArticle]?.associazione_di_tipo_mafioso.prob || 0) * 100).toFixed(2)}% probability of this label being true`}
                  />
                </ListItem>
                <ListItem className="items-cente rgap-2 flex w-full sm:max-w-1/2 xl:max-w-1/4">
                  <Switch
                    checked={
                      labeledArticles[currentArticle]?.contrabbando.value === 1
                    }
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeLabel(event, "contrabbando")
                    }
                  />
                  <ListItemText
                    primary={
                      <p>
                        <span className="font-semibold">
                          {getCrimeName("contrabbando")}
                        </span>
                        :{" "}
                        {labeledArticles[currentArticle]?.contrabbando.value ===
                        0
                          ? "false"
                          : "true"}
                      </p>
                    }
                    secondary={`${((labeledArticles[currentArticle]?.contrabbando.prob || 0) * 100).toFixed(2)}% probability of this label being true`}
                  />
                </ListItem>
                <ListItem className="items-cente rgap-2 flex w-full sm:max-w-1/2 xl:max-w-1/4">
                  <Switch
                    checked={
                      labeledArticles[currentArticle]?.estorsione.value === 1
                    }
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeLabel(event, "estorsione")
                    }
                  />
                  <ListItemText
                    primary={
                      <p>
                        <span className="font-semibold">
                          {getCrimeName("estorsione")}
                        </span>
                        :{" "}
                        {labeledArticles[currentArticle]?.estorsione.value === 0
                          ? "false"
                          : "true"}
                      </p>
                    }
                    secondary={`${((labeledArticles[currentArticle]?.estorsione.prob || 0) * 100).toFixed(2)}% probability of this label being true`}
                  />
                </ListItem>
                <ListItem className="items-cente rgap-2 flex w-full sm:max-w-1/2 xl:max-w-1/4">
                  <Switch
                    checked={labeledArticles[currentArticle]?.furto.value === 1}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeLabel(event, "furto")
                    }
                  />
                  <ListItemText
                    primary={
                      <p>
                        <span className="font-semibold">
                          {getCrimeName("furto")}
                        </span>
                        :{" "}
                        {labeledArticles[currentArticle]?.furto.value === 0
                          ? "false"
                          : "true"}
                      </p>
                    }
                    secondary={`${((labeledArticles[currentArticle]?.furto.prob || 0) * 100).toFixed(2)}% probability of this label being true`}
                  />
                </ListItem>
                <ListItem className="items-cente rgap-2 flex w-full sm:max-w-1/2 xl:max-w-1/4">
                  <Switch
                    checked={
                      labeledArticles[currentArticle]?.omicidio.value === 1
                    }
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeLabel(event, "omicidio")
                    }
                  />
                  <ListItemText
                    primary={
                      <p>
                        <span className="font-semibold">
                          {getCrimeName("omicidio")}
                        </span>
                        :{" "}
                        {labeledArticles[currentArticle]?.omicidio.value === 0
                          ? "false"
                          : "true"}
                      </p>
                    }
                    secondary={`${((labeledArticles[currentArticle]?.omicidio.prob || 0) * 100).toFixed(2)}% probability of this label being true`}
                  />
                </ListItem>
                <ListItem className="items-cente rgap-2 flex w-full sm:max-w-1/2 xl:max-w-1/4">
                  <Switch
                    checked={
                      labeledArticles[currentArticle]?.omicidio_colposo
                        .value === 1
                    }
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeLabel(event, "omicidio_colposo")
                    }
                  />
                  <ListItemText
                    primary={
                      <p>
                        <span className="font-semibold">
                          {getCrimeName("omicidio_colposo")}
                        </span>
                        :{" "}
                        {labeledArticles[currentArticle]?.omicidio_colposo
                          .value === 0
                          ? "false"
                          : "true"}
                      </p>
                    }
                    secondary={`${((labeledArticles[currentArticle]?.omicidio_colposo.prob || 0) * 100).toFixed(2)}% probability of this label being true`}
                  />
                </ListItem>
                <ListItem className="items-cente rgap-2 flex w-full sm:max-w-1/2 xl:max-w-1/4">
                  <Switch
                    checked={
                      labeledArticles[currentArticle]?.omicidio_stradale
                        .value === 1
                    }
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeLabel(event, "omicidio_stradale")
                    }
                  />
                  <ListItemText
                    primary={
                      <p>
                        <span className="font-semibold">
                          {getCrimeName("omicidio_stradale")}
                        </span>
                        :{" "}
                        {labeledArticles[currentArticle]?.omicidio_stradale
                          .value === 0
                          ? "false"
                          : "true"}
                      </p>
                    }
                    secondary={`${((labeledArticles[currentArticle]?.omicidio_stradale.prob || 0) * 100).toFixed(2)}% probability of this label being true`}
                  />
                </ListItem>
                <ListItem className="items-cente rgap-2 flex w-full sm:max-w-1/2 xl:max-w-1/4">
                  <Switch
                    checked={
                      labeledArticles[currentArticle]?.rapina.value === 1
                    }
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeLabel(event, "rapina")
                    }
                  />
                  <ListItemText
                    primary={
                      <p>
                        <span className="font-semibold">
                          {getCrimeName("rapina")}
                        </span>
                        :{" "}
                        {labeledArticles[currentArticle]?.rapina.value === 0
                          ? "false"
                          : "true"}
                      </p>
                    }
                    secondary={`${((labeledArticles[currentArticle]?.rapina.prob || 0) * 100).toFixed(2)}% probability of this label being true`}
                  />
                </ListItem>
                <ListItem className="items-cente rgap-2 flex w-full sm:max-w-1/2 xl:max-w-1/4">
                  <Switch
                    checked={
                      labeledArticles[currentArticle]?.spaccio.value === 1
                    }
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeLabel(event, "spaccio")
                    }
                  />
                  <ListItemText
                    primary={
                      <p>
                        <span className="font-semibold">
                          {getCrimeName("spaccio")}
                        </span>
                        :{" "}
                        {labeledArticles[currentArticle]?.spaccio.value === 0
                          ? "false"
                          : "true"}
                      </p>
                    }
                    secondary={`${((labeledArticles[currentArticle]?.spaccio.prob || 0) * 100).toFixed(2)}% probability of this label being true`}
                  />
                </ListItem>
                <ListItem className="items-cente rgap-2 flex w-full sm:max-w-1/2 xl:max-w-1/4">
                  <Switch
                    checked={
                      labeledArticles[currentArticle]?.tentato_omicidio
                        .value === 1
                    }
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeLabel(event, "tentato_omicidio")
                    }
                  />
                  <ListItemText
                    primary={
                      <p>
                        <span className="font-semibold">
                          {getCrimeName("tentato_omicidio")}
                        </span>
                        :{" "}
                        {labeledArticles[currentArticle]?.tentato_omicidio
                          .value === 0
                          ? "false"
                          : "true"}
                      </p>
                    }
                    secondary={`${((labeledArticles[currentArticle]?.tentato_omicidio.prob || 0) * 100).toFixed(2)}% probability of this label being true`}
                  />
                </ListItem>
                <ListItem className="items-cente rgap-2 flex w-full sm:max-w-1/2 xl:max-w-1/4">
                  <Switch
                    checked={
                      labeledArticles[currentArticle]?.truffa.value === 1
                    }
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeLabel(event, "truffa")
                    }
                  />
                  <ListItemText
                    primary={
                      <p>
                        <span className="font-semibold">
                          {getCrimeName("truffa")}
                        </span>
                        :{" "}
                        {labeledArticles[currentArticle]?.truffa.value === 0
                          ? "false"
                          : "true"}
                      </p>
                    }
                    secondary={`${((labeledArticles[currentArticle]?.truffa.prob || 0) * 100).toFixed(2)}% probability of this label being true`}
                  />
                </ListItem>
                <ListItem className="items-cente rgap-2 flex w-full sm:max-w-1/2 xl:max-w-1/4">
                  <Switch
                    checked={
                      labeledArticles[currentArticle]?.violenza_sessuale
                        .value === 1
                    }
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChangeLabel(event, "violenza_sessuale")
                    }
                  />
                  <ListItemText
                    primary={
                      <p>
                        <span className="font-semibold">
                          {getCrimeName("violenza_sessuale")}
                        </span>
                        :{" "}
                        {labeledArticles[currentArticle]?.violenza_sessuale
                          .value === 0
                          ? "false"
                          : "true"}
                      </p>
                    }
                    secondary={`${((labeledArticles[currentArticle]?.violenza_sessuale.prob || 0) * 100).toFixed(2)}% probability of this label being true`}
                  />
                </ListItem>
              </List>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default LabelArticles;
