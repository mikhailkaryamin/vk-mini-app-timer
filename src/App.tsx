import React, { useState } from "react";
import { View } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import TimerAdd from "./panels/TimerAdd";
import TimersList from "./panels/TimersList";

const PanelId = {
  TIMER_ADD: "timer-add",
  TIMERS_LIST: "timers-list",
};

const App: React.FC = () => {
  const [activePanel, setActivePanel] = useState(PanelId.TIMERS_LIST);

  return (
    <View activePanel={activePanel}>
      <TimersList id={PanelId.TIMERS_LIST} />
      <TimerAdd id={PanelId.TIMER_ADD} />
    </View>
  );
};

export default App;
