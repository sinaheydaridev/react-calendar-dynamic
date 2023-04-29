![Logo](https://s29.picofile.com/file/8462687268/2023_04_29_02_05_49_Window.png)

# react-calendar-dynamic

A useful calendar for React app.

### key Features

- Timezone
- Available date
- Loading
- Range selection

## Installation

`npm install react-calendar-dynamic`

## Usage

```js
import { useState } from "react";
import { DynamicCalendar } from "react-calendar-dynamic";
import "react-calendar-dynamic/dist/styles.css";

const MyComponent = () => {
  const [date, setDate] = useState({ start: new Date(), end: new Date() });

  const handleChangeDate = (date) => setDate(date);

  return <DynamicCalendar mode="range" onChange={handleChangeDate} />;
};
```

## Props

timezone: string

```js
<DynamicCalendar mode="single" timezone="Chile/EasterIsland" />
```

loading: boolean

```js
<DynamicCalendar mode="single" loading />
```

availableDateRange: Date[]

```js
<DynamicCalendar
  mode="single"
  availableDateRange={[
    new Date(),
    new Date(new Date().setDate(new Date().getDate() + 1)),
    new Date(new Date().setDate(new Date().getDate() + 3)),
    new Date(new Date().setDate(new Date().getDate() + 6)),
    new Date(new Date().setDate(new Date().getDate() + 12)),
  ]}
/>
```

mode: "single" | "range"

```js
<DynamicCalendar mode="single" />
```

onChange: ({ start, end }: { start: Date; end: Date }) => void

```js
<DynamicCalendar mode="single" onChange={handleChangeDate} />
```

value: Date

```js
<DynamicCalendar mode="single" value={new Date(new Date().setMonth(5))} />
```

startValue: Date

endValue: Date

```js
<DynamicCalendar
  mode="range"
  startValue={new Date()}
  endValue={new Date(new Date().setDate(new Date().getDate() + 12))}
/>
```

onChangeMonth: (month: number) => void

```js
<DynamicCalendar mode="single" onChangeMonth={handleChangeMonth} />
```

minValue: Date | null // When it is null, the limit is not applied

maxValue: Date | null // When it is null, the limit is not applied

```js
<DynamicCalendar mode="single" minValue={null} maxValue={new Date()} />
```
