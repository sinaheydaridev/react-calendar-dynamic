import { FC } from "react";
import { Moment } from "moment";

import * as utilDate from "./utils";

export type HeaderProps = {
  loading: boolean;
  date: Moment;
  onReset: () => void;
  onChangeMonth: (month: number) => void;
};

const Header: FC<HeaderProps> = ({ loading, date, onReset, onChangeMonth }) => {
  return (
    <header className="dynamic_calendar__header">
      <div className="dynamic_calendar__header__change_month_container">
        {!loading ? (
          <button
            onClick={() => onChangeMonth(date.month() - 1)}
            className="dynamic_calendar__header__change_month_button"
          >
            <span>&#8249;</span>
          </button>
        ) : (
          <div className="dynamic_calendar__change_month_skeleton"></div>
        )}
        <button className="dynamic_calendar__header__text" onClick={onReset}>
          <span>{utilDate.monthNameFormat(date)}</span>
          <span className="dynamic_calendar__header__year">
            {utilDate.yearFormat(date)}
          </span>
        </button>
        {!loading ? (
          <button
            onClick={() => onChangeMonth(date.month() + 1)}
            className="dynamic_calendar__header__change_month_button"
          >
            <span>&#8250;</span>
          </button>
        ) : (
          <div className="dynamic_calendar__change_month_skeleton"></div>
        )}
      </div>
    </header>
  );
};

export default Header;
