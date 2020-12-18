import React, { useState } from "react";
import {
  Panel,
  PanelHeader,
  FormLayout,
  Input,
  Button,
  Group,
  List,
  Header,
} from "@vkontakte/vkui/dist";

import { getStringDate } from "../shared/utils";

type Props = {
  id: string;
};

const Timer: React.FC<Props> = ({ id }: Props) => {
  const [date, setDate] = useState(0);
  const [time, setTime] = useState(0);
  const [isVisibilityTime, setVisibilityTime] = useState(false);

  if (isNaN(time)) {
    setTime(0);
  }

  const isBeforeDate = (date + time) < Date.now();
  const stringDate = getStringDate(date, time);

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
        </FormLayout>
      </Group>

      <Group>
        {(!!stringDate && isBeforeDate) && <Header mode="secondary">Прошло с даты:</Header>}
        {(!!stringDate && !isBeforeDate) && <Header mode="secondary">До даты осталось:</Header>}
        <List>
          {getStringDate(date, time)}
        </List>
      </Group>
    </Panel>
  );
};

export default Timer;
