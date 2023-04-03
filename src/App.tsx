import MapPage from "./components/MapPage/MapPage";
import AppState from "./service/appState";

const app = () => {
  return (
    <AppState>
      <MapPage />
    </AppState>
  );
};

export default app;
