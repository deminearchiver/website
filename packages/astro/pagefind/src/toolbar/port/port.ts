import { nanoid } from "nanoid/non-secure";
import { Logger } from "./logger";

type Payload<T extends unknown> = {
  readonly id: string;
  readonly data: T;
  readonly copy: <U extends unknown>(data: U) => Payload<U>;
  readonly empty: () => Payload<void>;
}
type EditablePayload<T extends unknown> =
  & Pick<Payload<T>, "id" | "data">
  & {
    -readonly [P in keyof Omit<Payload<T>, "id" | "data">]?: Payload<T>[P];
  };

type Messenger = {
  on: <T>(event: string, callback: (data: T) => void) => void;
  send: <T>(event: string, data: T) => void;
}

export abstract class MessagePort<M extends Messenger> extends Logger {
  private events:
    Record<string, ((payload: Payload<unknown>) => void)[]> = {};

  public constructor(
    private readonly messenger: M
  ) { super() }

  protected createPayload<T extends unknown>(data: T): Payload<T> {
    return this.populatePayload({
      id: nanoid(), data
    });
  }
  protected createEmptyPayload(): Payload<void> {
    return this.createPayload(void 0);
  }

  private populatePayload<T>({ id, data }: EditablePayload<T>): Payload<T> {
    const copy = <U extends unknown>(data: U): Payload<U> => (
      { id, data, copy, empty }
    );
    const empty = (): Payload<void> => (
      { id, data: void 0, copy, empty }
    );
    return { id, data, copy, empty };
  }
  private unpopulatePayload<T>({ id, data }: Payload<T>): EditablePayload<T> {
    return { id, data };
  }

  protected on<T>(event: string, callback: (payload: Payload<T>) => void) {
    const value = callback as (payload: Payload<unknown>) => void;
    if(event in this.events && !this.events[event].includes(value)) {
      this.events[event].push(value);
    } else {
      this.events[event] = new Array(value);
      this.messenger.on(
        event,
        (payload: EditablePayload<unknown>) => {
          if(event in this.events && this.events[event].length > 0) {
            this.events[event].forEach(
              callback => callback(this.populatePayload(payload))
            );
          }
        }
      );
    }
  }

  protected once<T>(event: string, payload: Payload<unknown>, callback: (payload: Payload<T>) => void) {
    const wrapper = (newPayload: Payload<T>) => {
      if(newPayload.id !== payload.id) return;
      callback(newPayload);
      this.off(event, wrapper);
    }
    this.on(event, wrapper);
  }

  protected off<T>(event: string, callback: (payload: Payload<T>) => void) {
    const value = callback as (payload: Payload<unknown>) => void;
    if(event in this.events) {
      const listeners = this.events[event];
      if(!listeners.includes(value)) return;

      listeners.splice(listeners.indexOf(value), 1);
    }
  }
  protected send<T>(event: string, payload: Payload<T>) {
    this.messenger.send(event, this.unpopulatePayload(payload));
  }
}

