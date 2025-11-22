import { getCrimeName } from "../helpers/utils";
import { Article, LabeledArticle } from "../types/global";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Upload,
  Loader2,
  Sparkles,
  AlertCircle,
  RotateCcw
} from "lucide-react";
import { enqueueSnackbar } from "notistack";
import { ChangeEvent, SyntheticEvent, useCallback, useState } from "react";

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

  const handleChangeQuartiere = (value: string) => {
    if (!isLoading) {
      setQuartiere(value);
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
                setLabeledArticles(null); // Clear previous results
                setCurrentArticle(0); // Reset pagination
              }
            } catch (error) {
              setError("Failed to parse JSON: " + error);
            }
          };
          reader.readAsText(file);
        } else {
          setError("Please upload a valid JSON file.");
        }

        // Reset input value to allow selecting the same file again
        event.target.value = "";
      }
    }
  };

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();

      if (!isLoading) {
        setIsLoading(true);

        try {
          const response = await fetch(
            `http://127.0.0.1:5000/classifier/label-articles`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                jsonFile: articles,
                quartiere: quartiere
              })
            }
          );

          if (response.ok) {
            const labeledArticles = await response.json();
            setLabeledArticles(labeledArticles);
          } else {
            enqueueSnackbar(`Response error: ${response.status}`, {
              variant: "error"
            });
          }
        } catch (error) {
          enqueueSnackbar(`Request error: ${error}`, { variant: "error" });
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
          `http://127.0.0.1:3000/api/upload-to-database`,
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
          enqueueSnackbar(`Response error: ${response.status}`, {
            variant: "error"
          });
        }
      } catch (error) {
        enqueueSnackbar(`Request error: ${error}`, { variant: "error" });
      }

      setIsUploading(false);
    }
  }, [isLoading, isUploading, labeledArticles]);

  const handleChangeLabel = (checked: boolean, cat: string) => {
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
      // const value = copyLabeled[currentArticle][cat].value;
      copyLabeled[currentArticle][cat].value = checked ? 1 : 0;

      setLabeledArticles(copyLabeled);
    }
  };

  const handleReset = useCallback(() => {
    setArticles(null);
    setLabeledArticles(null);
    setCurrentArticle(0);
    setQuartiere("");
    setError("");
    setIsLoading(false);
    setIsUploading(false);
  }, []);

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

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Label Articles</h1>
          <p className="text-muted-foreground mt-2">
            Automatically label articles using a BERT model, then revise them
            and upload them to the database
          </p>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-1">
              <span className="font-medium">IMPORTANT:</span> This function
              works best with a dedicated GPU. CPU labeling is possible but
              requires significantly more time.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload & Analyze</CardTitle>
              <CardDescription>
                Follow these steps to label your articles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Badge variant="default">Step 1</Badge>
                  Upload JSON File
                </Label>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled={isLoading}
                  asChild={true}>
                  <label className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    {articles
                      ? `${articles.length} articles loaded`
                      : "Choose File"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="application/json"
                    />
                  </label>
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Badge variant="default">Step 2</Badge>
                  Select Neighborhood
                </Label>
                <Select
                  value={quartiere}
                  onValueChange={handleChangeQuartiere}
                  disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a neighborhood..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bari-vecchia_san-nicola">
                      Bari Vecchia - San Nicola
                    </SelectItem>
                    <SelectItem value="carbonara">Carbonara</SelectItem>
                    <SelectItem value="carrassi">Carrassi</SelectItem>
                    <SelectItem value="ceglie-del-campo">
                      Ceglie del Campo
                    </SelectItem>
                    <SelectItem value="japigia">Japigia</SelectItem>
                    <SelectItem value="liberta">Libertà</SelectItem>
                    <SelectItem value="loseto">Loseto</SelectItem>
                    <SelectItem value="madonnella">Madonnella</SelectItem>
                    <SelectItem value="murat">Murat</SelectItem>
                    <SelectItem value="palese-macchie">
                      Palese - Macchie
                    </SelectItem>
                    <SelectItem value="picone">Picone</SelectItem>
                    <SelectItem value="san-girolamo_fesca">
                      San Girolamo - Fesca
                    </SelectItem>
                    <SelectItem value="san-paolo">San Paolo</SelectItem>
                    <SelectItem value="san-pasquale">San Pasquale</SelectItem>
                    <SelectItem value="santo-spirito">Santo Spirito</SelectItem>
                    <SelectItem value="stanic">Stanic</SelectItem>
                    <SelectItem value="torre-a-mare">Torre a mare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <Button
                className="w-full"
                disabled={!articles || !quartiere || isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Analysis
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  handleReset();
                }}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expected JSON Format</CardTitle>
              <CardDescription>
                Upload a JSON array with objects in this format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
                <code>{`{
    "link": "https://example.com/article",
    "title": "Article Title",
    "date": "YYYY-MM-DD HH:mm:ss",
    "content": "Article content here..."
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {labeledArticles && (
          <>
            <div className="mb-8 flex justify-between">
              <Button
                disabled={currentArticle === 0 || isUploading}
                variant="outline"
                onClick={handlePrevArticle}
                className={currentArticle === 0 ? "invisible" : ""}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous article
              </Button>

              {currentArticle < labeledArticles.length - 1 ? (
                <Button
                  disabled={
                    currentArticle === labeledArticles.length - 1 || isUploading
                  }
                  variant="outline"
                  onClick={handleNextArticle}>
                  Next article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  disabled={
                    currentArticle !== labeledArticles.length - 1 || isUploading
                  }
                  variant="default"
                  onClick={handleUploadToDatabase}>
                  Upload to database
                  <Database className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">
                      {labeledArticles[currentArticle].title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {labeledArticles[currentArticle].date}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    Article {currentArticle + 1} of {labeledArticles.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert mb-6 max-w-none">
                  {labeledArticles[currentArticle].content
                    .split("\n")
                    .map((str: string, index: number) => (
                      <p key={index} className="mb-2">
                        {str}
                      </p>
                    ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Categories</h3>
                    <p className="text-muted-foreground text-sm">
                      Toggle categories to correct the labels. The percentage
                      indicates the model's confidence.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {categories.map((cat) => (
                      <div
                        key={cat}
                        className="flex items-center space-x-4 rounded-lg border p-4">
                        <Switch
                          checked={
                            labeledArticles[currentArticle][cat]?.value === 1
                          }
                          onCheckedChange={(checked) =>
                            handleChangeLabel(checked, cat)
                          }
                        />
                        <div className="flex-1 space-y-1">
                          <Label className="cursor-pointer text-sm leading-none font-medium">
                            {getCrimeName(cat)}
                          </Label>
                          <p className="text-muted-foreground text-xs">
                            {(
                              (labeledArticles[currentArticle][cat]?.prob ||
                                0) * 100
                            ).toFixed(2)}
                            % probability
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
export default LabelArticles;
