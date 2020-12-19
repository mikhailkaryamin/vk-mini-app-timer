import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import { ScreenSpinner, View } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import TimerAdd from "./panels/TimerAdd";
import TimersList from "./panels/TimersList";

import { TimeData, ValuesPanelId } from "./shared/types";
import { PanelId } from "./shared/consts";

const KEYS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const App: React.FC = () => {
  const [activePanel, setActivePanel] = useState<ValuesPanelId>(PanelId.TIMERS_LIST);
  const [timeData, setTimeData] = useState<TimeData[]>([]);
  const [popout, setPopout] = useState<React.ReactNode>(<ScreenSpinner/>);
  const [nextTimeId, setNextTimeId] = useState<number>(0);

  useEffect(() => {
    async function fetchDataTime() {

      const fetchedDataTime = await bridge.send("VKWebAppStorageGet", {
        keys: KEYS,
      });

      setTimeData(fetchedDataTime.keys);

      setNextTimeId(fetchedDataTime.keys.findIndex((el) => el.value === ""));
      setPopout(null);

    }

    fetchDataTime();
  }, []);

  const go = (id: ValuesPanelId) => {
    setActivePanel(id);
  };

  return (
    <View activePanel={activePanel} popout={popout}>
      <TimersList id={PanelId.TIMERS_LIST} timeData={timeData} go={go}/>
      <TimerAdd id={PanelId.TIMER_ADD} go={go} nextTimeId={nextTimeId}/>
    </View>
  );
};

export default App;
