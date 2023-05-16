import { FC, useCallback, useState, useEffect } from "react";
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
  const dateWithTimeZone = useCallback(
    (currentDate?: Date) => {
      if (value) {
        return utilDate.getDateWithTimezone({
          date: value,
          timezone: String(timezone),
        });
      }
      return utilDate.getDateWithTimezone({
        date: currentDate || new Date(),
        timezone: String(timezone),
      });
    },
    [timezone, value]
  );

  const startDateWithTimeZone = useCallback(() => {
    if (startValue) {
      return moment(startValue);
    }
    return undefined;
  }, [startValue]);

  const endDateWithTimeZone = useCallback(() => {
    if (endValue) {
      return moment(endValue);
    }
    return undefined;
  }, [endValue]);

  const [date, setDate] = useState<Moment>(dateWithTimeZone());
  const [startDate, setStartDate] = useState<Moment | undefined>(
    startValue ? moment(startValue) : undefined
  );
  const [endDate, setEndDate] = useState<Moment | undefined>(
    endValue ? moment(endValue) : undefined
  );

  const handleResetDate = () => {
    setDate(dateWithTimeZone());
  };

  const handleChangeMonth = (month: number) => {
    setDate((prev) => moment(prev).month(month));
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
    if (onChangeMonth) {
      onChangeMonth(date.month() + 1);
    }
  }, [date, onChangeMonth]);

  useEffect(() => {
    if (dateWithTimeZone()) {
      setDate(dateWithTimeZone(new Date()));
    }
  }, [dateWithTimeZone]);

  useEffect(() => {
    if (startDateWithTimeZone() || endDateWithTimeZone()) {
      setStartDate(startDateWithTimeZone() || undefined);
      setEndDate(endDateWithTimeZone() || undefined);
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [startDateWithTimeZone, endDateWithTimeZone]);

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
