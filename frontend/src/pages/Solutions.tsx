import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlashAutoIcon from "@mui/icons-material/FlashAuto";
import GavelIcon from "@mui/icons-material/Gavel";
import GroupsIcon from "@mui/icons-material/Groups";
import HearingIcon from "@mui/icons-material/Hearing";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import SendIcon from "@mui/icons-material/Send";
import VideocamIcon from "@mui/icons-material/Videocam";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";

function Solutions() {
  return (
    <div className="mt-8 mb-12 flex flex-col gap-8 px-4 xl:mx-12 xl:flex-row xl:px-0">
      <div className="flex-shrink-0 xl:w-[50%]">
        <h1 className="mb-4 text-2xl font-bold">
          Smart solutions to minimize crime
        </h1>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="murder-content"
            id="murder-header">
            Murder, Manslaughter, Road homicide, Attempted murder
          </AccordionSummary>
          <AccordionDetails>
            <List
              dense={true}
              sx={{
                py: 0,
                ".MuiListItem-root": {
                  py: 0
                }
              }}>
              <ListItem>
                <ListItemIcon>
                  <VideocamIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Smart Surveillance Systems"
                  secondary="Use CCTV cameras equipped with facial recognition and behavioral analysis. These systems are useful to identify unusual movements and send real-time alerts to law enforcement. Disclaimer: remember to respect privacy laws."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HearingIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Acoustic detection"
                  secondary="Use IoT-enalbed acoustic sensors to detect gunshots, screams or sounds of distress. These sensors, using machine learning, are able to identify an unusual sound from a typical sound and notify authorities."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CameraAltIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Traffic monitoring systems"
                  secondary="These systems are particularly useful to take a photo or recognize a license plate to identify murderers who flee the scene of a road homicide."
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="theft-robbery-content"
            id="theft-robbery-header">
            Theft and Robbery
          </AccordionSummary>
          <AccordionDetails>
            <List
              dense={true}
              sx={{
                py: 0,
                ".MuiListItem-root": {
                  py: 0
                }
              }}>
              <ListItem>
                <ListItemIcon>
                  <NotificationsActiveIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Smart anti-theft systems"
                  secondary="Promote the installation of IoT-enabled alarm systems in residential and commercial spaces to automatically alert authorities in case of unauthorized entry."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FlashAutoIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Intelligent street lighting"
                  secondary="Install motion-sensitive LED lighting systems which illuminate when movement is detected, deterring criminal activities and making public spaces safer."
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="sexual-assault-content"
            id="sexual-assault-header">
            Sexual Violence and Assault
          </AccordionSummary>
          <AccordionDetails>
            <List
              dense={true}
              sx={{
                py: 0,
                ".MuiListItem-root": {
                  py: 0
                }
              }}>
              <ListItem>
                <ListItemIcon>
                  <RadioButtonCheckedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Emergency panic buttons"
                  secondary="Install panic buttons in strategic locations like bus stops, parks and public restrooms which, when activated, these buttons allert nearby patrol units and the city's emergency center, providing precise GPS coordinates."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <GroupsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Crowd flow monitoring"
                  secondary="Utilize anonymized mobile device data to monitor crowd movements and identify irregular patterns that could indicate potential assaults. Heat maps can assist in preemptively addressing risky zones."
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="drug-fraud-content"
            id="drug-fraud-header">
            Drug Trafficking and Fraud
          </AccordionSummary>
          <AccordionDetails>
            <List
              dense={true}
              sx={{
                py: 0,
                ".MuiListItem-root": {
                  py: 0
                }
              }}>
              <ListItem>
                <ListItemIcon>
                  <SendIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Digital Communication monitoring"
                  secondary="Deploy AI-driven tools to analyze social media, messaging platforms and the dark web to identify patterns associated with drug trafficking or fraudulent schemes."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <GavelIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Blockchain technology"
                  secondary="Encourage the use of blockchain for secure digital transactions to reduce financial fraud. Smart contracts can provide transparency and accountability in financial dealings."
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="extortion-smuggling-mafia-content"
            id="extortion-smuggling-mafia-header">
            Extortion, Smuggling and Mafia-Related Activities
          </AccordionSummary>
          <AccordionDetails>
            <List
              dense={true}
              sx={{
                py: 0,
                ".MuiListItem-root": {
                  py: 0
                }
              }}>
              <ListItem>
                <ListItemIcon>
                  <AccountBalanceIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Transaction anomaly detection"
                  secondary="Use financial analytics software to monitor unusual patterns in transactions, such as large cash withdrawals, frequent small deposits or suspicious money transfers that may indicate extortion or laundering"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WebAssetIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Collaborative platforms"
                  secondary="Implement platforms where law enforcement, local governments and private companies can share intelligence securely in order to facilitate coordinated efforts to dismantle organized crime networks"
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </div>
      <img
        src="/img/smart_city.jpg"
        alt="Smart city"
        className="xl:h-fit xl:w-[50%]"
      />
    </div>
  );
}
export default Solutions;
