import PaletteDisplay from "./PaletteDisplay";
import TileDisplay from "./TileDisplay";
import InfoIcon from "@mui/icons-material/Info";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";

type Props = {
  palette: string;
  setPalette: Dispatch<SetStateAction<string>>;
  tile: string;
  setTile: Dispatch<SetStateAction<string>>;
  filters: {
    [key: string]: { [key: string]: number };
  };
  setFilters: Dispatch<
    SetStateAction<{
      [key: string]: { [key: string]: number };
    }>
  >;
  fetchData: () => void;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  setEndDate: Dispatch<SetStateAction<Dayjs | null>>;
  handleChangeStartDate: (newDate: Dayjs | null) => void;
  handleResetDate: () => void;
};

function DashboardLeft({
  palette,
  setPalette,
  tile,
  setTile,
  filters,
  setFilters,
  fetchData,
  startDate,
  endDate,
  setEndDate,
  handleChangeStartDate,
  handleResetDate
}: Props) {
  const handleTileChange = (style: string) => {
    setTile(style);
  };

  const handlePaletteChange = (color: string) => {
    setPalette(color);
  };

  const handleFiltersChange = (crime: string, type: string) => {
    // State copy
    const filtersCopy = filters;

    filtersCopy[type][crime] = filtersCopy[type][crime] === 1 ? 0 : 1;

    setFilters({
      ...filters,
      [type]: filtersCopy[type]
    });
  };

  const handleResetFilters = () => {
    setFilters({
      crimes: {
        omicidio: 1,
        omicidio_colposo: 1,
        omicidio_stradale: 1,
        tentato_omicidio: 1,
        furto: 1,
        rapina: 1,
        violenza_sessuale: 1,
        aggressione: 1,
        spaccio: 1,
        truffa: 1,
        estorsione: 1,
        contrabbando: 1,
        associazione_di_tipo_mafioso: 1
      },
      quartieri: {
        "bari-vecchia_san-nicola": 1,
        carbonara: 1,
        carrassi: 1,
        "ceglie-del-campo": 1,
        japigia: 1,
        liberta: 1,
        loseto: 1,
        madonnella: 1,
        murat: 1,
        "palese-macchie": 1,
        picone: 1,
        "san-paolo": 1,
        "san-pasquale": 1,
        "santo-spirito": 1,
        stanic: 1,
        "torre-a-mare": 1,
        "san-girolamo_fesca": 1
      },
      weights: {
        num_of_articles: 1,
        num_of_people: 0
      }
    });
    handleResetDate();
  };

  return (
    <div className="dashboard-left flex flex-col gap-10 xl:pr-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold">Data filters</h2>
          <Button variant="contained" size="small" onClick={handleResetFilters}>
            Reset to default
          </Button>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <label className="text-lg font-medium">
                Filter by date range
              </label>
              <Tooltip
                title={
                  <p className="text-sm">
                    Select a range to limit the date range of the news. Note
                    that this filter only works if you select both dates
                  </p>
                }>
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </div>

            <div className="flex flex-col">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker", "DatePicker"]}>
                  <DatePicker
                    label="From"
                    disableFuture={true}
                    value={startDate}
                    onChange={(newDate: Dayjs | null) =>
                      handleChangeStartDate(newDate)
                    }
                    slotProps={{
                      field: {
                        clearable: true
                      }
                    }}
                  />
                  <DatePicker
                    label="To"
                    disableFuture={true}
                    value={endDate}
                    disabled={startDate === null}
                    minDate={startDate !== null ? startDate : undefined}
                    onChange={(newDate) => setEndDate(newDate)}
                    slotProps={{
                      field: { clearable: true }
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <label className="text-lg font-medium">Filter by crimes</label>
              <Tooltip
                title={
                  <p className="text-sm">
                    Select which crimes to show. Please note that this will
                    change the index's value
                  </p>
                }>
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </div>
            <FormGroup className="flex !flex-row flex-wrap gap-3">
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    onChange={() => handleFiltersChange("omicidio", "crimes")}
                    checked={filters.crimes.omicidio === 1}
                  />
                }
                label="Murder"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("omicidio_colposo", "crimes")
                    }
                    checked={filters.crimes.omicidio_colposo === 1}
                  />
                }
                label="Manslaughter"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("omicidio_stradale", "crimes")
                    }
                    checked={filters.crimes.omicidio_stradale === 1}
                  />
                }
                label="Road homicide"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("tentato_omicidio", "crimes")
                    }
                    checked={filters.crimes.tentato_omicidio === 1}
                  />
                }
                label="Attempted murder"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleFiltersChange("furto", "crimes")}
                    checked={filters.crimes.furto === 1}
                  />
                }
                label="Theft"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleFiltersChange("rapina", "crimes")}
                    checked={filters.crimes.rapina === 1}
                  />
                }
                label="Robber"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("violenza_sessuale", "crimes")
                    }
                    checked={filters.crimes.violenza_sessuale === 1}
                  />
                }
                label="Sexual violence"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("aggressione", "crimes")
                    }
                    checked={filters.crimes.aggressione === 1}
                  />
                }
                label="Assault"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleFiltersChange("spaccio", "crimes")}
                    checked={filters.crimes.spaccio === 1}
                  />
                }
                label="Drug trafficking"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleFiltersChange("truffa", "crimes")}
                    checked={filters.crimes.truffa === 1}
                  />
                }
                label="Fraud"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleFiltersChange("estorsione", "crimes")}
                    checked={filters.crimes.estorsione === 1}
                  />
                }
                label="Extortion"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("contrabbando", "crimes")
                    }
                    checked={filters.crimes.contrabbando === 1}
                  />
                }
                label="Smuggling"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange(
                        "associazione_di_tipo_mafioso",
                        "crimes"
                      )
                    }
                    checked={filters.crimes.associazione_di_tipo_mafioso === 1}
                  />
                }
                label="Mafia-type association"
              />
            </FormGroup>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <label className="text-lg font-medium">
                Filter by neighborhood
              </label>
              <Tooltip
                title={
                  <p className="text-sm">
                    Select which neighborhoods to show. Please note that this
                    will change the index's value
                  </p>
                }>
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </div>
            <FormGroup className="flex !flex-row flex-wrap gap-3">
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange(
                        "bari-vecchia_san-nicola",
                        "quartieri"
                      )
                    }
                    checked={filters.quartieri["bari-vecchia_san-nicola"] === 1}
                  />
                }
                label="Bari Vecchia - San Nicola"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("carbonara", "quartieri")
                    }
                    checked={filters.quartieri["carbonara"] === 1}
                  />
                }
                label="Carbonara"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("carrassi", "quartieri")
                    }
                    checked={filters.quartieri["carrassi"] === 1}
                  />
                }
                label="Carrassi"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("ceglie-del-campo", "quartieri")
                    }
                    checked={filters.quartieri["ceglie-del-campo"] === 1}
                  />
                }
                label="Ceglie del Campo"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleFiltersChange("japigia", "quartieri")}
                    checked={filters.quartieri["japigia"] === 1}
                  />
                }
                label="Japigia"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleFiltersChange("liberta", "quartieri")}
                    checked={filters.quartieri["liberta"] === 1}
                  />
                }
                label="Libertà"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleFiltersChange("loseto", "quartieri")}
                    checked={filters.quartieri["loseto"] === 1}
                  />
                }
                label="Loseto"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("madonnella", "quartieri")
                    }
                    checked={filters.quartieri["madonnella"] === 1}
                  />
                }
                label="Madonnella"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleFiltersChange("murat", "quartieri")}
                    checked={filters.quartieri["murat"] === 1}
                  />
                }
                label="Murat"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("palese-macchie", "quartieri")
                    }
                    checked={filters.quartieri["palese-macchie"] === 1}
                  />
                }
                label="Palese - Macchie"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleFiltersChange("picone", "quartieri")}
                    checked={filters.quartieri["picone"] === 1}
                  />
                }
                label="Picone"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("san-paolo", "quartieri")
                    }
                    checked={filters.quartieri["san-paolo"] === 1}
                  />
                }
                label="San Paolo"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("san-pasquale", "quartieri")
                    }
                    checked={filters.quartieri["san-pasquale"] === 1}
                  />
                }
                label="San Pasquale"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("santo-spirito", "quartieri")
                    }
                    checked={filters.quartieri["santo-spirito"] === 1}
                  />
                }
                label="Santo Spirito - San Pio - Catino"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleFiltersChange("stanic", "quartieri")}
                    checked={filters.quartieri["stanic"] === 1}
                  />
                }
                label="Stanic"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("torre-a-mare", "quartieri")
                    }
                    checked={filters.quartieri["torre-a-mare"] === 1}
                  />
                }
                label="Torre a mare"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() =>
                      handleFiltersChange("san-girolamo_fesca", "quartieri")
                    }
                    checked={filters.quartieri["san-girolamo_fesca"] === 1}
                  />
                }
                label="San Girolamo - Fesca"
              />
            </FormGroup>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <label className="text-lg font-medium">Weights</label>
              <Tooltip
                title={
                  <p className="text-sm">
                    Select the weights that will afflict the overall index score
                  </p>
                }>
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </div>
            <FormGroup className="flex !flex-row flex-wrap gap-3">
              <div className="flex items-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() =>
                        handleFiltersChange("num_of_articles", "weights")
                      }
                      checked={filters.weights["num_of_articles"] === 1}
                    />
                  }
                  label="Number of articles"
                  className="!mr-0"
                />
                <Tooltip
                  title={
                    <p className="text-sm">
                      Divides the crime index by the total number of articles
                      for that neighborhood in the database
                    </p>
                  }>
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <div className="flex items-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() =>
                        handleFiltersChange("num_of_people", "weights")
                      }
                      checked={filters.weights["num_of_people"] === 1}
                    />
                  }
                  label="Number of people"
                  className="!mr-0"
                />
                <Tooltip
                  title={
                    <p className="text-sm">
                      Divides the crime index by the number of people for that
                      neighborhood
                    </p>
                  }>
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </FormGroup>
          </div>
        </div>
        <Button
          variant="contained"
          className="!mx-auto !mt-4 w-full sm:!mr-0 sm:!ml-auto sm:w-fit"
          onClick={fetchData}>
          Apply
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Map style</h2>
        <FormControl>
          <label id="tiles-palette-label" className="text-lg font-medium">
            Layers palette
          </label>
          <RadioGroup
            row={true}
            aria-labelledby="tiles-palette-label"
            name="row-radio-buttons-group"
            className="gap-8">
            <FormControlLabel
              checked={palette === "red"}
              value="red"
              control={<Radio />}
              label={<PaletteDisplay palette="red" />}
              onClick={() => handlePaletteChange("red")}
            />
            <FormControlLabel
              checked={palette === "blue"}
              value="blue"
              control={<Radio />}
              label={<PaletteDisplay palette="blue" />}
              onClick={() => handlePaletteChange("blue")}
            />
            <FormControlLabel
              checked={palette === "green"}
              value="green"
              control={<Radio />}
              label={<PaletteDisplay palette="green" />}
              onClick={() => handlePaletteChange("green")}
            />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <label id="tiles-palette-label" className="mb-2 text-lg font-medium">
            Tile style
          </label>
          <RadioGroup
            row={true}
            aria-labelledby="tiles-palette-label"
            name="row-radio-buttons-group"
            className="gap-2">
            <FormControlLabel
              checked={
                tile === "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
              value="base"
              control={<Radio />}
              label={<TileDisplay style="base" />}
              onClick={() =>
                handleTileChange(
                  "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                )
              }
            />
            <FormControlLabel
              checked={
                tile ===
                "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              }
              value="dark"
              control={<Radio />}
              label={<TileDisplay style="dark" />}
              onClick={() =>
                handleTileChange(
                  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                )
              }
            />
            <FormControlLabel
              checked={
                tile ===
                "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              }
              value="light"
              control={<Radio />}
              label={<TileDisplay style="light" />}
              onClick={() =>
                handleTileChange(
                  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                )
              }
            />
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
}
export default DashboardLeft;
