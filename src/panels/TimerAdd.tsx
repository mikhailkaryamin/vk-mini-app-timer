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
  PanelHeaderBack,
} from "@vkontakte/vkui/dist";

import { ValuesPanelId, CurrentEventData } from "../shared/types";
import { PanelId, EMPTY_EVENT_DATA } from "../shared/consts";
import { getStringDate } from "../shared/utils";

type Props = {
  currentEventData: CurrentEventData;
  id: ValuesPanelId;
  go: (id: ValuesPanelId) => void;
  timeId: number;
  onFetch: (arg1: string) => void;
  setCurrentEventData: (arg1: CurrentEventData) => void;
};

const getDefaultValue = (dateTime: CurrentEventData) => {
  const dateISO = new Date(+dateTime.time).toISOString();
  const date = dateISO.substring(0, 10);
  const time = dateISO.substring(12, 19);

  return ({
    date,
    time,
  });
};

const TimerAdd: React.FC<Props> = ({ id, go, timeId, onFetch, currentEventData, setCurrentEventData }: Props) => {
  const [date, setDate] = useState(0);
  const [time, setTime] = useState(0);
  const [nameEvent, setNameEvent] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [nameDateValue, setNameDateValue] = useState("");
  const [isVisibilityTime, setVisibilityTime] = useState(false);
  const [newTimeData, setNewTimeData] = useState("");

  if (isNaN(time)) {
    setTime(0);
  }

  const onSubmitForm = () => {
    if (date && nameEvent) {
      const dataString = `${isBeforeDate ? "-" : "+"}${
        date + time
      },${nameEvent}`;
      setNewTimeData(dataString);
      setCurrentEventData(EMPTY_EVENT_DATA);
    }
  };

  const onClickBackButton = () => {
    go(PanelId.TIMERS_LIST);
    setCurrentEventData(EMPTY_EVENT_DATA);
  };

  const onChangeDate = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setDate(evt.target.valueAsNumber);
    setDateValue(evt.target.value);
  };

  const onChangeTime = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTime(evt.target.valueAsNumber);
    setTimeValue(evt.target.value);
  };

  const onChangeNameDate = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setNameEvent(evt.target.value);
    setNameDateValue(evt.target.value);
  };

  useEffect(() => {
    if (currentEventData.time) {
      const defaultValue = getDefaultValue(currentEventData);

      setDateValue(defaultValue.date);
      setTimeValue(defaultValue.time);
      setNameDateValue(currentEventData.nameDate);

      setCurrentEventData({
        time: "",
        nameDate: "",
      });
    }
  }, []);

  useEffect(() => {
    async function sendTimeData() {
      if (newTimeData) {
        await bridge.send("VKWebAppStorageSet", {
          key: `${timeId}`,
          value: newTimeData,
        });

        go(PanelId.TIMERS_LIST);
        onFetch(newTimeData);
      }
    }

    sendTimeData();
  }, [newTimeData]);

  const isBeforeDate = date + time < Date.now();
  const stringDate = getStringDate(date + time);

  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={onClickBackButton}></PanelHeaderBack>}>
        Таймер
      </PanelHeader>
      <Group>
        <FormLayout>
          <Input
            type="date"
            top="Дата"
            name="date"
            value={dateValue}
            onChange={onChangeDate}
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
              value={timeValue}
              onChange={onChangeTime}
            />
          )}
          <Input
            placeholder="Название события"
            onChange={onChangeNameDate}
            value={nameDateValue}
            required
          ></Input>
          <Button
            size="xl"
            type="submit"
            onClick={onSubmitForm}
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

export default TimerAdd;
