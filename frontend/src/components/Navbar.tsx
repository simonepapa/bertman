import MenuIcon from "@mui/icons-material/Menu";
import {
  Drawer,
  AppBar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  CssBaseline
} from "@mui/material";
import { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
  window?: () => Window;
};

function Navbar({ children, window }: Props) {
  const location = useLocation();
  const { pathname } = location;
  console.log(pathname);

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState: boolean) => !prevState);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar component="nav" position="static">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="mr-2 sm:!hidden">
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              className="!hidden sm:!block">
              BERTMAN
            </Typography>
            <Box className="!hidden sm:ml-4 sm:!block">
              <Button
                component={Link}
                to={"/dashboard"}
                className={`!text-white !normal-case ${pathname === "/dashboard" ? "!font-bold" : "!font-normal"}`}>
                Dashboard
              </Button>
              <Button
                component={Link}
                to={"/solutions"}
                className={`!text-white !normal-case ${pathname === "/solutions" ? "!font-bold" : "!font-normal"}`}>
                Solutions
              </Button>
              <Button
                component={Link}
                to={"/read-articles"}
                className={`!text-white !normal-case ${pathname === "/read-articles" ? "!font-bold" : "!font-normal"}`}>
                Read articles
              </Button>
              <Button
                component={Link}
                to={"/label-articles"}
                className={`!text-white !normal-case ${pathname === "/label-articles" ? "!font-bold" : "!font-normal"}`}>
                Label articles
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <nav>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: "240px"
              }
            }}>
            <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
              <Typography variant="h6" sx={{ my: 2 }}>
                MUI
              </Typography>
              <Divider />
              <List>
                <ListItem disablePadding={true}>
                  <ListItemButton
                    component={Link}
                    to={"/dashboard"}
                    sx={{ textAlign: "center" }}>
                    <ListItemText
                      primary={"Dashboard"}
                      sx={{
                        textTransform: "none",
                        span: {
                          fontWeight: pathname === "/dashboard" ? "700" : "400"
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding={true}>
                  <ListItemButton
                    component={Link}
                    to={"/solutions"}
                    sx={{ textAlign: "center" }}>
                    <ListItemText
                      primary={"Solutions"}
                      sx={{
                        textTransform: "none",
                        span: {
                          fontWeight: pathname === "/solutions" ? "700" : "400"
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding={true}>
                  <ListItemButton
                    component={Link}
                    to={"/read-articles"}
                    sx={{ textAlign: "center" }}>
                    <ListItemText
                      primary={"Read articles"}
                      sx={{
                        textTransform: "none",
                        span: {
                          fontWeight:
                            pathname === "/read-articles" ? "700" : "400"
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding={true}>
                  <ListItemButton
                    component={Link}
                    to={"/label-articles"}
                    sx={{ textAlign: "center" }}>
                    <ListItemText
                      primary={"Label articles"}
                      sx={{
                        textTransform: "none",
                        span: {
                          fontWeight:
                            pathname === "/label-articles" ? "700" : "400"
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </nav>
      </Box>
      {children}
    </>
  );
}

export default Navbar;
