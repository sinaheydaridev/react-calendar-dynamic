import { FC, useState, useEffect } from "react";
import moment, { Moment } from "moment";

import Days from "./Days";
import Header from "./Header";
import * as utilDate from "./utils";

import "./styles.css";

export type DateSelected = {
  start: Date;
  end: Date;
};

type DynamicCalendarAction = {
  onChange?: ({ start, end }: DateSelected) => void;
  onChangeMonth?: (month: number) => void;
};

type DynamicCalendarInfo = {
  mode: "single" | "range";
  loading?: boolean;
  value?: Date;
  startValue?: Date;
  endValue?: Date | null;
  timezone?: string;
} & DynamicCalendarAction;

type DynamicCalendarProps = {
  availableDateRange?: Date[];
  timezone?: string;
  maxValue?: Date | null;
  minValue?: Date | null;
} & DynamicCalendarInfo;

const DynamicCalendar: FC<DynamicCalendarProps> = ({
  mode,
  loading = false,
  value,
  startValue,
  endValue,
  availableDateRange,
  timezone = moment.tz.guess(),
  maxValue,
  minValue = new Date(),
  onChange,
  onChangeMonth,
}) => {
  const [date, setDate] = useState<Moment>(moment());
  const [startDate, setStartDate] = useState<Moment | undefined>(
    moment(startValue) || undefined
  );
  const [endDate, setEndDate] = useState<Moment | undefined>(
    moment(endValue) || undefined
  );

  const handleResetDate = () => {
    setDate(
      utilDate.getDateWithTimezone({
        date: new Date(),
        timezone: String(timezone),
      })
    );
  };

  const handleChangeMonth = (month: number) => {
    setDate((prev) => moment(prev).month(month));
    onChangeMonth && onChangeMonth(month);
  };

  const onChangeDate = (date: Moment) => {
    let s = startDate;
    let e = endDate;

    if (
      startDate === null ||
      date.isBefore(startDate, "day") ||
      !startDate?.isSame(endDate, "day")
    ) {
      s = moment(date);
      e = moment(date);
    } else if (date.isSame(startDate, "day") && date.isSame(endDate, "day")) {
      s = date;
      e = date;
    } else if (date.isAfter(startDate, "day")) {
      e = moment(date);
    }

    if (mode === "single") {
      onChange &&
        onChange({
          start: e?.startOf("day").startOf("day").toDate() as Date,
          end: e?.endOf("day").startOf("day").toDate() as Date,
        });
      setStartDate(e);
      setEndDate(e);
    } else if (mode === "range") {
      onChange &&
        onChange({
          start: s?.startOf("day").startOf("day").toDate() as Date,
          end: e?.endOf("day").startOf("day").toDate() as Date,
        });
      setStartDate(s);
      setEndDate(e);
    }
  };

  useEffect(() => {
    if (value) {
      setDate(moment(value));
    }
  }, [value]);

  useEffect(() => {
    if (timezone) {
      utilDate.getDateWithTimezone({
        date: new Date(),
        timezone: timezone,
      });
    }
  }, [timezone]);

  useEffect(() => {
    if (startValue || endValue) {
      setStartDate(moment(startValue) || undefined);
      setEndDate(moment(endValue) || undefined);
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [endValue, startValue]);

  return (
    <div className="dynamic_calendar">
      <div className="dynamic_calendar__wrapper">
        <Header
          date={date}
          loading={loading}
          onReset={handleResetDate}
          onChangeMonth={handleChangeMonth}
        />
        <Days
          onClick={(date) => onChangeDate(date)}
          date={date}
          startDate={startDate as Moment}
          endDate={endDate as Moment}
          mode={mode}
          loading={loading}
          availableDateRange={availableDateRange}
          maxValue={maxValue}
          minValue={minValue}
          timezone={timezone}
        />
      </div>
    </div>
  );
};

export default DynamicCalendar;
