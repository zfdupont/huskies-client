import * as React from "react";
import Drawer from "../ui/Drawer";
import DrawerLists from "./DrawerLists";
import ResetButtonGroup from "../TabPanels/mapPanel/ResetButtonGroup";
import useIsMobile from "../hooks/use-is-mobile.hook";

const drawerWidth = 200;

export default function ResponsiveDrawer() {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(!isMobile);

  const handleDrawerToggle = () => setOpen((o) => !o);

  return (
    <nav aria-label="controls">
      <div
        className="navbar fixed left-0 top-0 z-[10000] flex h-16 w-screen items-center bg-surface border-b border-border"
      >
        <div
          className="logo h-16"
          style={{
            width: `${drawerWidth - 1}px`,
            backgroundImage: `url(${process.env.PUBLIC_URL + "/Huskies3.png"})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "left",
          }}
          onClick={handleDrawerToggle}
        />
      </div>

      <Drawer
        variant={isMobile ? "overlay" : "docked"}
        open={isMobile ? open : true}
        onClose={handleDrawerToggle}
        width={drawerWidth}
        className="pt-16"
        data-testid="controls-drawer"
      >
        <DrawerLists />
        <div className="my-2 border-t border-border" />
        <ResetButtonGroup />
      </Drawer>
    </nav>
  );
}
