import { List, ListItem, ListItemText } from "@mui/material";

function Methodology() {
  return (
    <div className="mt-8 mb-12 flex flex-col gap-2 px-4 xl:mx-12 xl:max-w-[1200px] xl:px-0">
      <h1 className="mb-4 text-2xl font-bold">Methodology</h1>
      <p>
        The Crime Risk Index (CRI) is given by the summatory of all the crimes
        multiplied by their frequency and weight <br />
        (CRI = sum(crime_frequency * crime_weight)).
        <br /> It is then scaled into a [0, 100] range.
      </p>
      <p>
        The crimes were given these weights based on the damage (physical and
        psychological) inflicted on the victims as well as the potential
        long-term consequences of each crime:
      </p>
      <List dense={true}>
        <ListItem>
          <ListItemText primary="1.0 Murder" />
        </ListItem>
        <ListItem>
          <ListItemText primary="0.7 Manslaughter" />
        </ListItem>
        <ListItem>
          <ListItemText primary="0.8 Road Homicide" />
        </ListItem>
        <ListItem>
          <ListItemText primary="0.9 Attempted Murder" />
        </ListItem>
        <ListItem>
          <ListItemText primary="0.2 Theft" />
        </ListItem>
        <ListItem>
          <ListItemText primary="0.7 Robbery" />
        </ListItem>
        <ListItem>
          <ListItemText primary="0.8 Sexual violence" />
        </ListItem>
        <ListItem>
          <ListItemText primary="0.6 Assault" />
        </ListItem>
        <ListItem>
          <ListItemText primary="0.5 Drug Trafficking" />
        </ListItem>
        <ListItem>
          <ListItemText primary="0.3 Fraud" />
        </ListItem>
        <ListItem>
          <ListItemText primary="0.6 Extortion" />
        </ListItem>
        <ListItem>
          <ListItemText primary="0.4 Smuggling" />
        </ListItem>
        <ListItem>
          <ListItemText primary="1.0 Mafia-type association" />
        </ListItem>
      </List>
      <p>
        Since the number of articles highly varies between neighborhoods and the
        since the neighborhoods have different population, the CRI can
        optionally be weighted for these two factors. If so, then it will be
        divided by the number of crime per neighborhood and/or by the number of
        people in the neighborhood.
      </p>
    </div>
  );
}
export default Methodology;
