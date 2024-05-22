import { type Component, type JSX, createSignal, splitProps, createEffect } from "solid-js";
import { splashStyle, surfaceStyle } from "./splash.css";
import { createEventListenerMap } from "@solid-primitives/event-listener";
import { type MaybeAccessor } from "@solid-primitives/utils";
import { mergeRefs } from "@solid-primitives/refs";
import clsx from "clsx/lite";
import { createMediaQuery } from "@solid-primitives/media";

const wait = (timeout: number) => new Promise<void>(resolve => setTimeout(resolve, timeout));

const PRESS_GROW_MS = 450;
const MINIMUM_PRESS_MS = 225;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const PRESS_PSEUDO = "::after";
const ANIMATION_FILL = "forwards";
const TOUCH_DELAY_MS = 150;

type State = "inactive" | "touchDelay" | "holding" | "waitingForClick";

export type SplashProps = {
  for: MaybeAccessor<HTMLElement>;
  disabled?: boolean;
} & JSX.HTMLAttributes<HTMLElement>;

export const Splash: Component<SplashProps> = (props) => {
  const [localProps, otherProps] = splitProps(
    props,
    ["ref", "disabled", "for"],
  );

  let ref!: HTMLElement;
  let surfaceRef!: HTMLElement;

  const forcedColors = createMediaQuery("(forced-colors: active)");

  const [state, setState] = createSignal<State>("inactive");

  const [growAnimation, setGrowAnimation] = createSignal<Animation>();

  const [hovered, setHovered] = createSignal(false);
  const [pressed, setPressed] = createSignal(false);

  const [checkBoundsAfterContextMenu, setCheckBoundsAfterContextMenu] = createSignal(false);

  const [initialSize, setInitialSize] = createSignal(0);
  const [rippleScale, setRippleScale] = createSignal("");
  const [rippleSize, setRippleSize] = createSignal("");

  const [rippleStartEvent, setRippleStartEvent] = createSignal<PointerEvent>();

  const isTouch = ({ pointerType }: PointerEvent) => pointerType === "touch";

  const shouldReactToEvent = (event: PointerEvent) => {
    if (localProps.disabled || !event.isPrimary) return false;

    const startEvent = rippleStartEvent();
    if (
      startEvent &&
      startEvent.pointerId !== event.pointerId
    ) return false;

    if (event.type === "pointerenter" || event.type === "pointerleave") {
      return !isTouch(event);
    }

    const isPrimaryButton = event.buttons === 1;
    return isTouch(event) || isPrimaryButton;
  }

  const getNormalizedPointerEventCoords = (event: PointerEvent): {
    x: number;
    y: number;
  } => {
    const {scrollX, scrollY} = window;
    const {left, top} = ref.getBoundingClientRect();
    const documentX = scrollX + left;
    const documentY = scrollY + top;
    const {pageX, pageY} = event;
    return {x: pageX - documentX, y: pageY - documentY};
  }

  const getTranslationCoordinates = (event?: Event) => {
    const {height, width} = ref.getBoundingClientRect();
    // end in the center
    const endPoint = {
      x: (width - initialSize()) / 2,
      y: (height - initialSize()) / 2,
    };

    let startPoint;
    if (event instanceof PointerEvent) {
      startPoint = getNormalizedPointerEventCoords(event);
    } else {
      startPoint = {
        x: width / 2,
        y: height / 2,
      };
    }

    // center around start point
    startPoint = {
      x: startPoint.x - initialSize() / 2,
      y: startPoint.y - initialSize() / 2,
    };

    return {startPoint, endPoint};
  }

  const determineRippleSize = () => {
    const {height, width} = ref.getBoundingClientRect();
    const maxDim = Math.max(height, width);
    const softEdgeSize = Math.max(
      SOFT_EDGE_CONTAINER_RATIO * maxDim,
      SOFT_EDGE_MINIMUM_SIZE,
    );

    const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
    const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
    const maxRadius = hypotenuse + PADDING;

    setInitialSize(initialSize);
    setRippleScale(`${(maxRadius + softEdgeSize) / initialSize}`);
    setRippleSize(`${initialSize}px`);
  }
  const onContextmenu = () => {
    if (localProps.disabled) return;

    setCheckBoundsAfterContextMenu(true);
    endPressAnimation();
  }

  const startPressAnimation = (event?: Event) => {
    setPressed(true);
    growAnimation()?.cancel();
    determineRippleSize();
    const {startPoint, endPoint} =
      getTranslationCoordinates(event);
    const translateStart = `${startPoint.x}px, ${startPoint.y}px`;
    const translateEnd = `${endPoint.x}px, ${endPoint.y}px`;

    const position = [0, 0];
    const dimension = [rippleSize(), rippleSize()];

    setGrowAnimation(
      surfaceRef.animate(
        {
          top: position,
          left: position,
          height: dimension,
          width: dimension,
          transform: [
            `translate(${translateStart}) scale(1)`,
            `translate(${translateEnd}) scale(${rippleScale()})`,
          ],
        },
        {
          pseudoElement: PRESS_PSEUDO,
          duration: PRESS_GROW_MS,
          easing: "cubic-bezier(0.2, 0, 0, 1)",
          fill: ANIMATION_FILL,
        },
      )
    );
  }

  const endPressAnimation = async () => {
    setRippleStartEvent();
    setState("inactive");
    const animation = growAnimation();
    let pressAnimationPlayState = Infinity;
    if (typeof animation?.currentTime === "number") {
      pressAnimationPlayState = animation.currentTime;
    } else if (animation?.currentTime) {
      pressAnimationPlayState = animation.currentTime.to("ms").value;
    }

    if (pressAnimationPlayState >= MINIMUM_PRESS_MS) {
      setPressed(false);
      return;
    }

    await wait(MINIMUM_PRESS_MS - pressAnimationPlayState);

    if (growAnimation() !== animation) {
      // A new press animation was started. The old animation was canceled and
      // should not finish the pressed state.
      return;
    }

    setPressed(false);
  }

  const inBounds = ({x, y}: PointerEvent) => {
    const {top, left, bottom, right} = ref.getBoundingClientRect();
    return x >= left && x <= right && y >= top && y <= bottom;
  }


  const onClick = () => {
    if(localProps.disabled) return;

    if (state() === "waitingForClick") {
      void endPressAnimation();
    } else if (state() === "inactive") {
      startPressAnimation();
      void endPressAnimation();
    }
  }

  const onPointerDown = async (event: PointerEvent) => {
    if (!shouldReactToEvent(event)) return;

    setRippleStartEvent(event);
    if (!isTouch(event)) {
      setState("waitingForClick");
      startPressAnimation(event);
      return;
    }

    // after a longpress contextmenu event, an extra `pointerdown` can be
    // dispatched to the pressed element. Check that the down is within
    // bounds of the element in this case.
    if (checkBoundsAfterContextMenu() && !inBounds(event)) return;

    setCheckBoundsAfterContextMenu(false);

    // Wait for a hold after touch delay
    setState("touchDelay");
    await wait(TOUCH_DELAY_MS);

    if (state() !== "touchDelay") return;

    setState("holding");
    startPressAnimation(event);
  }

  const onPointerUp = (event: PointerEvent) => {
    if (!shouldReactToEvent(event)) return;

    if (state() === "holding") {
      setState("waitingForClick");
    } else if (state() === "touchDelay") {
      setState("waitingForClick");
      startPressAnimation(rippleStartEvent());
    }
  }

  const onPointerEnter = (event: PointerEvent) => {
    if (!shouldReactToEvent(event)) return;

    setHovered(true);
  }
  const onPointerLeave = (event: PointerEvent) => {
    if (!shouldReactToEvent(event)) return;

    setHovered(false);

    // release a held mouse or pen press that moves outside the element
    if (state() !== "inactive") {
      void endPressAnimation();
    }
  }

  const onPointerCancel = (event: PointerEvent) => {
    if (!shouldReactToEvent(event)) return;
    void endPressAnimation();
  }

  createEffect(() => {
    createEventListenerMap(
      props.for,
      forcedColors() ? {} : {
        click: onClick,
        pointerdown: onPointerDown,
        pointerup: onPointerUp,
        pointerenter: onPointerEnter,
        pointerleave: onPointerLeave,
        pointercancel: onPointerCancel,
        contextmenu: onContextmenu,
      },
    );
  });

  return (
    <div
      {...otherProps}
      ref={mergeRefs(localProps.ref, element => ref = element)}
      class={clsx(splashStyle, otherProps.class)}>
      <div
        ref={surfaceRef as HTMLDivElement}
        class={surfaceStyle({
          hovered: hovered(),
          pressed: pressed(),
        })} />
    </div>
  );
};

