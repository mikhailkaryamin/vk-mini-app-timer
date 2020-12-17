import React, { useState } from "react";
import { View } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import Home from "./panels/Home";

const App: React.FC = () => {
  const [activePanel, setActivePanel] = useState("home");

  return (
    <View activePanel={activePanel}>
      <Home id="home" />
    </View>
  );
};

export default App;
