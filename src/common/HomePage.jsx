import * as React from "react";
import MainTab from "./MainTabPanel";
import MainDrawer from "./MainDrawer";
import Loader from "./Loader";
import StoreContext from "./Store";

export default function HomePage() {
  const { loading } = React.useContext(StoreContext);
  return (
    <div className="absolute h-full w-full bg-bg">
      <div className="relative mt-16 h-full">
        {loading ? <Loader /> : null}
        <MainTab />
      </div>
      <MainDrawer />
    </div>
  );
}
