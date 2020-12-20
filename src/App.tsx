import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import { ScreenSpinner, View } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import TimerAdd from "./panels/TimerAdd";
import TimersList from "./panels/TimersList";

import { DataTimer, ValuesPanelId } from "./shared/types";
import { PanelId, EMPTY_EVENT_DATA } from "./shared/consts";

const KEYS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const App: React.FC = () => {
  const [activePanel, setActivePanel] = useState<ValuesPanelId>(
      PanelId.TIMERS_LIST
  );
  const [timeData, setTimeData] = useState<DataTimer[]>([]);
  const [popout, setPopout] = useState<React.ReactNode>(<ScreenSpinner />);
  const [timeId, setTimeId] = useState<number>(0);
  const [isFetchData, setFetchData] = useState("");
  const [currentEventData, setCurrentEventData] = useState(EMPTY_EVENT_DATA);

  useEffect(() => {
    async function fetchDataTime() {
      const fetchedDataTime = await bridge.send("VKWebAppStorageGet", {
        keys: KEYS,
      });

      setTimeData(fetchedDataTime.keys);
      setTimeId(fetchedDataTime.keys.findIndex((el) => el.value === ""));
      setPopout(null);
      console.log("save");
    }

    fetchDataTime();
  }, [isFetchData]);

  const go = (id: ValuesPanelId) => {
    setActivePanel(id);
  };

  return (
    <View activePanel={activePanel} popout={popout}>
      <TimersList
        id={PanelId.TIMERS_LIST}
        timeData={timeData}
        go={go}
        onFetch={setFetchData}
        setCurrentEventData={setCurrentEventData}
        setTimeId={setTimeId}
      />
      <TimerAdd
        id={PanelId.TIMER_ADD}
        go={go}
        timeId={timeId}
        onFetch={setFetchData}
        currentEventData={currentEventData}
        setCurrentEventData={setCurrentEventData}
      />
    </View>
  );
};

export default App;
