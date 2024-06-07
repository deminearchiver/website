import { graphql } from "@octokit/graphql";
import { For, Show, createEffect, createMemo, createResource, createSignal, untrack, type Accessor, type Component, type Resource } from "solid-js";
import { textFieldStyle, formStyle, weeksStyle, dayStyle, calendarStyle, wrapperStyle, datePickerStyle } from "./github-calendar.css";
import { Button } from "@material/solid/components/button";
import type { graphql as GraphQL } from "@octokit/graphql/types";
import { access, type MaybeAccessor } from "@solid-primitives/utils";

import ManufacturingIcon from "~icons/material-symbols-rounded/manufacturing:filled";

const client = graphql.defaults({
  headers: {
    authorization: ``
  }
});

type Query = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        months: { firstDay: string; name: string; }[];
        weeks: {
          contributionDays: {
            date: string;
            contributionCount: number;
            contributionLevel: ContributionLevel;
            weekday: number;
          }[];
        }[];
      };
    };
  };
}
type ContributionMonth = {
  firstDay: Date;
  name: string;
}
type ContributionDay ={
  date: Date;
  contributions: number;
  level: ContributionLevel;
  weekday: number;
}
type ContributionsData = {
  total: number;
  months: ContributionMonth[];
  weeks: ContributionDay[][];
}

type CreateCalendarOptions = {
  token: MaybeAccessor<string>;
  username: MaybeAccessor<string>;
  range?: MaybeAccessor<[from: Date, to: Date]>;
}

type ContributionLevel = "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";

const createCalendar = (options: CreateCalendarOptions): Resource<ContributionsData> => {
  const [client, setClient] = createSignal<GraphQL>();
  const [username, setUsername] = createSignal("");

  createEffect(() => {
    const token = access(options.token);
    const username = access(options.username);

    if(!token || !username) {
      return void setClient();
    }

    const newClient = graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    });

    setClient(() => newClient);
  })

  const [response] = createResource(
    client,
    async client => {
      const range = access(options.range);
      let args: string = "";
      if(range) {
        const [from, to] = range;
        args = `(from: "${from.toISOString()}", to: "${to.toISOString()}")`;
      }
      const response = await client<Query>(`
        {
          user(login: "deminearchiver") {
            contributionsCollection${args} {
              contributionCalendar {
                totalContributions
                months {
                  firstDay
                  name
                }
                weeks {
                  contributionDays {
                    color
                    date
                    contributionCount
                    contributionLevel
                    weekday
                  }
                }
              }
            }
          }
        }
      `);
      const calendar = response.user.contributionsCollection.contributionCalendar;
      return {
        total: calendar.totalContributions,
        months: calendar.months.map(
          month => ({
            firstDay: new Date(month.firstDay),
            name: month.name
          })
        ),
        weeks: calendar.weeks.map(
          week => week.contributionDays.map(
            ({
              date,
              weekday,
              contributionCount: contributions,
              contributionLevel: level
            }) => ({ date: new Date(date), weekday, contributions, level })
          )
        ),
      } as ContributionsData;
    }
  );
  return response;
}
type ResolvedMonth = {
  days: ContributionDay[];
} & ContributionMonth;

export const GitHubCalendar: Component = () => {
  const [token, setToken] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [date, setDate] = createSignal(new Date());

  const range = createMemo(() => {
    const from = new Date(date());
    from.setFullYear(from.getFullYear() - 1);
    return [from, date()] satisfies [Date, Date];
  });

  const calendar = createCalendar({
    token,
    username,
    range,
  });

  const rows = createMemo(() => {
    if(calendar.state !== "ready") return;
    const months = calendar().months.sort((a, b) => a.firstDay.valueOf() - b.firstDay.valueOf());
    console.log(months);
    const raw = calendar().weeks.flat();
    const grouped = Object.groupBy(raw, day => day.weekday);
    const rows = Object.values(grouped).map(value => value ?? []);
    return rows.map(row => {
      const newRow: ResolvedMonth[] = [];
      let j = 0;
      for(let i = 0; i < row.length; i++) {
        const day = row[i];
        if(day.date.valueOf() >= months[j + 1].firstDay.valueOf()) {
          const month = months[++j] as ResolvedMonth;
          month.days = [day];
          newRow.push(month);
        } else {
          if(newRow.length > 0) newRow.at(-1)!.days.push(day);
          else {
            const month = months[j] as ResolvedMonth;
            month.days = [day];
            newRow.push(month);
          }
        }
      }
      return newRow;
    });
  });

  createEffect(() => {
    console.log(rows());
  })

  return (
    <div class={wrapperStyle}>
      <Form onSubmit={data => {}} />
      {/* <form
        class={formStyle}
        onSubmit={event => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setToken(data.get("token") as string);
          setUsername(data.get("username") as string);
          setDate(
            data.has("date")
              ? new Date(data.get("date") as string)
              : new Date()
          );
        }}>
        <input
          class={textFieldStyle}
          name="token"
          type="password"
          placeholder="Personal access token"
          required />
        <input
          class={textFieldStyle}
          name="username"
          type="text"
          placeholder="Username"
          value="deminearchiver"
          required />
        <input
          class={textFieldStyle}
          name="date"
          type="date"
          min="2008-03-08"
          value={date().toISOString().split("T")[0]} />
        <Button
          variant="filled"
          type="submit"
          leading={<ManufacturingIcon width={18} height={18} />}>
          Generate
        </Button>
      </form> */}
      <Show when={rows()}>
        <div class={calendarStyle}>
          <table>
            {/* <thead>
              <tr>
                <th colSpan={5}>Jan</th>
                <th colSpan={5}>Feb</th>
                <th colSpan={5}>Mar</th>
                <th colSpan={5}>Apr</th>
                <th colSpan={5}>May</th>
                <th colSpan={5}>Jun</th>
                <th colSpan={5}>Jul</th>
                <th colSpan={5}>Aug</th>
                <th colSpan={5}>Sep</th>
                <th colSpan={5}>Oct</th>
                <th colSpan={5}>Nov</th>
                <th colSpan={5}>Dec</th>
              </tr>
            </thead> */}
            <tbody>
              <For each={rows()}>{
                row => (
                  <tr>
                    <For each={row}>{
                      (month, monthIndex) => (
                        <For each={month.days}>{
                          (day, dayIndex) => (
                            <>
                              <td
                                class={dayStyle({
                                  level: day.level
                                })}
                                classList={{
                                  [month.name]: true
                                }} />
                            </>
                          )
                        }</For>
                      )
                    }</For>
                  </tr>
                )
              }</For>
            </tbody>
          </table>
          {/* <ul class={weeksStyle}>
            <For each={calendar()!.weeks.flat()}>{
              day => (
                <li
                  class={dayStyle({ level: day.level })}
                  style={{
                    "grid-row": day.weekday,
                  }} />
              )
            }</For>
          </ul> */}
        </div>
      </Show>
    </div>
  );
}

type FormSubmitData = {
  token: string;
  username: string;
  date: string;
}
type FormProps = {
  onSubmit?: (data: FormSubmitData) => void;
}
const Form: Component<FormProps> = (props) => {
  const [token, setToken] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [date, setDate] = createSignal("");
  return (
    <form
      class={formStyle}
      onSubmit={event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
      }}>
        <input
          class={textFieldStyle}
          style={{ "grid-column": 1 }}
          name="token"
          type="password"
          placeholder="Personal access token"
          required
          pattern="[a-zA-Z0-9_]+"
          value={token()}
          onInput={event => setToken(event.currentTarget.value)} />
        <input
          class={textFieldStyle}
          style={{ "grid-column": 2, }}
          name="username"
          type="text"
          placeholder="Username"
          required
          max={39}
          pattern="^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$"
          value={username()}
          onInput={event => setUsername(event.currentTarget.value)} />
        <input
          class={datePickerStyle}
          name="date"
          type="date"
          required
          min="2008-03-08"
          value={date()}
          onInput={event => setDate(event.currentTarget.value)} />
        <Button
          style={{ "grid-column": "span 2" }}
          variant="filled"
          type="submit"
          leading={<ManufacturingIcon width={18} height={18} />}>
            Generate
        </Button>
    </form>
  );
}
