import PaletteDisplay from "./PaletteDisplay";
import TileDisplay from "./TileDisplay";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup
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

  const handleApplyFilters = () => {
    fetchData();
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Map style</h2>
        <FormControl>
          <label id="tiles-palette-label" className="text-lg font-medium">
            Tiles palette
          </label>
          <RadioGroup
            row={true}
            aria-labelledby="tiles-palette-label"
            name="row-radio-buttons-group">
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
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold">Data filters</h2>
          <Button variant="contained" size="small" onClick={handleApplyFilters}>
            Apply
          </Button>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <label className="text-lg font-medium">Filter by date range</label>
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
                  />
                  <DatePicker
                    label="To"
                    disableFuture={true}
                    value={endDate}
                    disabled={startDate === null}
                    minDate={startDate !== null ? startDate : undefined}
                    onChange={(newDate) => setEndDate(newDate)}
                  />
                </DemoContainer>
              </LocalizationProvider>

              <Button
                variant="contained"
                size="small"
                onClick={handleResetDate}
                className="!mt-2 w-fit self-end">
                Reset date
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-lg font-medium">Filter by crimes</label>
            <FormGroup className="flex !flex-row flex-wrap gap-3">
              <FormControlLabel
                control={
                  <Checkbox
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
            <label className="text-lg font-medium">
              Filter by neighborhood
            </label>
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
        </div>
      </div>
    </div>
  );
}
export default DashboardLeft;
