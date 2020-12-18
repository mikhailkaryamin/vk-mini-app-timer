import React, { useState } from "react";
import {
  Panel,
  PanelHeader,
  Group,
  Header,
  List,
  Cell,
  Subhead,
  Title,
  Button,
  Div,
} from "@vkontakte/vkui";

import { DataTimer } from "../shared/types";
import { getStringDate } from "../shared/utils";

type Props = {
  id: string;
};

const ANCHOR_TIME = ",";

const emptyDataMock = [];

const timerDataMock = [
  {
    key: "1",
    value: "1234567891245,День рождения",
  },
  {
    key: "2",
    value: "7891245123456,Супер дата",
  },
  {
    key: "3",
    value: "4512378912456,Отпуск",
  },
];

const getModelTimersList = (dataTimer: DataTimer[]) => {
  const timerList = [];

  let currentLengthTime;
  let time;
  let dateName;

  for (const date of dataTimer) {
    currentLengthTime = date.value.indexOf(ANCHOR_TIME);
    time = date.value.substring(1, currentLengthTime);
    dateName = date.value.substring(currentLengthTime + 1);
    timerList.push({
      time,
      dateName,
      isBefore: date.value.charAt(0) === "-",
    });
  }

  return timerList;
};

const TimerList: React.FC<Props> = ({ id }: Props) => {
  const mockData = [
    {
      key: "1",
      value: "+1608299342708,День рождение",
    },
    {
      key: "2",
      value: "-1504295342708,Отпуск",
    },
    {
      key: "3",
      value: "-1608399342708,Выборы",
    },
  ];
  const isEmptyData = !mockData.length || !mockData[0].value;

  return (
    <Panel id={id}>
      <PanelHeader>Cобытия</PanelHeader>
      <Group header={<Header mode="secondary">Список событий</Header>}>
        <List>
          {isEmptyData && (
            <Cell>
              <Subhead weight="regular">
                У вас еще нет добавленных событий
              </Subhead>
            </Cell>
          )}
          {isEmptyData ||
            getModelTimersList(mockData).map((el) => {
              return (
                <Cell
                  key="id"
                  size="l"
                  multiline={true}
                  description={getStringDate(+el.time)}
                  bottomContent={
                    <div style={{ display: "flex" }}>
                      <Button size="m" mode="outline">Редактировать</Button>
                      <Button
                        size="m"
                        mode="destructive"
                        style={{ marginLeft: 8 }}
                      >
                        Удалить
                      </Button>
                    </div>
                  }
                >
                  <Title level="2" weight="regular">
                    {el.dateName}
                  </Title>
                  {el.isBefore ? `C события прошло:` : `До события осталось:`}
                </Cell>
              );
            })}
        </List>
        <Div>
          <Button size="xl">{"Добавить событие"}</Button>
        </Div>
      </Group>
    </Panel>
  );
};

export default TimerList;
