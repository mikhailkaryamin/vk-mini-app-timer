import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  Panel,
  PanelHeader,
  FormLayout,
  Input,
  Button,
  Group,
  List,
  Header,
  Cell,
} from "@vkontakte/vkui/dist";

import { ValuesPanelId } from "../shared/types";
import { PanelId } from "../shared/consts";
import { getStringDate } from "../shared/utils";

type Props = {
  id: ValuesPanelId;
  go: (id: ValuesPanelId) => void;
  nextTimeId: number;
};

const Timer: React.FC<Props> = ({ id, go, nextTimeId }: Props) => {
  const [date, setDate] = useState(0);
  const [time, setTime] = useState(0);
  const [nameEvent, setNameEvent] = useState("");
  const [isVisibilityTime, setVisibilityTime] = useState(false);
  const [newTimeData, setNewTimeData] = useState("");

  if (isNaN(time)) {
    setTime(0);
  }

  useEffect(() => {
    async function sendTimeData() {
      if (newTimeData) {
        await bridge.send("VKWebAppStorageSet", {
          key: `${nextTimeId}`,
          value: newTimeData,
        });

        go(PanelId.TIMERS_LIST);
      }
    }

    sendTimeData();
  }, [newTimeData]);

  const isBeforeDate = date + time < Date.now();
  const stringDate = getStringDate(date + time);

  return (
    <Panel id={id}>
      <PanelHeader>Таймер</PanelHeader>
      <Group>
        <FormLayout>
          <Input
            type="date"
            top="Дата"
            name="date"
            onChange={(evt) => setDate(evt.target.valueAsNumber)}
            required
          />

          <Button onClick={() => setVisibilityTime(!isVisibilityTime)}>
            {isVisibilityTime ? "Убрать время" : "Добавить время"}
          </Button>

          {isVisibilityTime && (
            <Input
              type="time"
              top="Время"
              name="time"
              onChange={(evt) => setTime(evt.target.valueAsNumber)}
            />
          )}
          <Input
            placeholder="Название события"
            onChange={(evt) => setNameEvent(evt.target.value)}
            status="default"
            required
          ></Input>
          <Button
            size="xl"
            onClick={(evt) => {
              console.log(evt);
              setNewTimeData(
                  `${isBeforeDate ? "-" : "+"}${date + time},${nameEvent}`
              );
            }}
          >
            {"Сохранить событие"}
          </Button>
        </FormLayout>
      </Group>

      <Group>
        {!!stringDate && isBeforeDate && (
          <Header mode="secondary">Прошло с даты:</Header>
        )}
        {!!stringDate && !isBeforeDate && (
          <Header mode="secondary">До даты осталось:</Header>
        )}
        <List>
          <Cell>{getStringDate(date + time)}</Cell>
        </List>
      </Group>
    </Panel>
  );
};

export default Timer;
