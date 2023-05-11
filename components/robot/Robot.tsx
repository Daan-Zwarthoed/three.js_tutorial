import Link from "next/link";
import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { stepList } from "../../pages/tutorial";
import Router from "next/router";
import gsap from "gsap";
import AppContext from "../../contexts/AppContextProvider";
type InputProps = {
  next?: true;
};
let animating: gsap.core.Tween[] = [];
const complimentOptions = [
  "Well done!",
  "You're the best!",
  "Nice!",
  "Great job!",
  "Good!",
  ":))))",
];
const randomCompliment = () =>
  complimentOptions[Math.floor(Math.random() * complimentOptions.length)];

const Robot: React.FC<InputProps> = ({ next }) => {
  const { showRobot, setShowRobot } = useContext(AppContext);
  const [text, setText] = useState<{ compliment: boolean; text: string }>({
    compliment: true,
    text: complimentOptions[0],
  });
  const robot = createRef<HTMLDivElement>();
  const robotSelf = createRef<HTMLDivElement>();
  const eyeDisplay = createRef<HTMLDivElement>();
  const thruster = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!eyeDisplay.current || !thruster.current || !robotSelf.current) return;
    gsap.to(robotSelf.current.style, {
      transform: "translate(24.5px, 2px)",
      repeat: -1,
      duration: 2,
      ease: "bounce",
      yoyoEase: "bounce",
    });

    [...eyeDisplay.current.children].forEach((element) => {
      const eyeAnimation = gsap.to((element as HTMLDivElement).style, {
        height: "20px",
        transform: "translateY(10px)",
        repeat: -1,
        repeatDelay: 2,
        duration: 0.4,
        yoyoEase: "power1",
      });
      animating.push(eyeAnimation);
    });
    const thrusterAnimation = gsap.to(thruster.current.style, {
      transform: `scale(1, 1.1)`,
      repeat: -1,
      duration: 0.2,
      yoyoEase: "back",
    });
    animating.push(thrusterAnimation);
  }, []);

  const hideRobot = (tl: gsap.core.Timeline | typeof gsap) => {
    if (!robot.current) return;
    const dissappearXSide = Boolean(Math.round(Math.random()));
    const topOrLeft = Boolean(Math.round(Math.random()));
    const topOrLeftAmount = topOrLeft ? "0%" : "100%";
    const translateAmount = topOrLeft ? "-120%" : "0%";

    tl.to(robot.current.style, {
      left: dissappearXSide ? topOrLeftAmount : Math.random() * 100 + "%",
      top: !dissappearXSide ? topOrLeftAmount : Math.random() * 100 + "%",
      transform: `translate(${translateAmount}, ${translateAmount})`,
      duration: 1.5,
      ease: "power1",
    }).eventCallback("onComplete", () => setShowRobot(false));
  };

  useEffect(() => {
    if (!showRobot || !robot.current) {
      animating.forEach((animation) => animation.pause());
      return;
    }
    const compliment = typeof showRobot !== "string";
    setText({
      compliment: compliment,
      text: compliment ? randomCompliment() : showRobot,
    });
    animating.forEach((animation) => animation.play());

    const tl = gsap.timeline();
    tl.to(robot.current.style, {
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      duration: 3,
      ease: "elastic",
    });

    if (compliment) hideRobot(tl);
  }, [showRobot]);

  return (
    <div
      ref={robot}
      id="robot"
      className="robot absolute z-40 flex flex-col max-w-full"
      style={{
        left: "0%",
        top: "0%",
        transform: "translate(-100%, -100%)",
      }}
    >
      <div className="relative w-max max-w-[800px] p-3 text-center min-w-[150px] rounded-xl border-2 border-accent bg-background mb-3">
        {text.compliment && <h2>{text.text}</h2>}
        {!text.compliment && (
          <>
            <p className="mb-8">{text.text}</p>{" "}
            <button
              className="absolute -bottom-0.5 -right-0.5 p-1 rounded-xl border-2 border-solid border-accent"
              onClick={() => hideRobot(gsap)}
            >
              Got it
            </button>
          </>
        )}
      </div>
      <div
        ref={robotSelf}
        className="flex flex-col"
        style={{ transform: "translate(25px, 0px)" }}
      >
        <div className="relative z-10 w-32 h-20 p-3 rounded-xl bg-[#D9D9D9] mx-auto">
          <div className="absolute bottom-[50%] left-0 z-50 w-4 h-16 rounded-xl origin-bottom -rotate-[30deg] bg-[#D9D9D9]"></div>
          <div
            className="relative w-full h-full rounded-xl bg-background"
            ref={eyeDisplay}
          >
            <div
              className="absolute left-[10%] top-[30%] w-[35%] border-4 border-transparent origin-bottom border-t-accent border-solid"
              style={{
                borderRadius: "100% 100% 0 0",
                height: "100px",
                transform: "translateY(0px)",
              }}
            ></div>
            <div
              className="absolute right-[10%] top-[30%] w-[35%] border-4 border-transparent border-t-accent border-solid"
              style={{
                borderRadius: "100% 100% 0 0",
                height: "100px",
                transform: "translateY(0px)",
              }}
            ></div>
          </div>
          <div className="absolute bottom-[50%] right-0 z-50 w-4 h-16 rounded-xl origin-bottom -rotate-[30deg] bg-[#D9D9D9]"></div>
        </div>
        <div
          className="relative -top-[1px] z-0 w-32 bg-accent mx-auto flex justify-center origin-top"
          style={{
            height: "80px",
            clipPath:
              "polygon(80% 0, 70% 50%, 65% 29%, 58% 83%, 54% 53%, 46% 100%, 35% 51%, 31% 14%, 28% 43%, 20% 0)",
            transform: "scale(1, 1)",
          }}
          ref={thruster}
        >
          <div
            className="h-full w-full bg-white"
            style={{
              clipPath:
                "polygon(75% 0, 70% 30%, 65% 9%, 58% 63%, 54% 33%, 46% 80%, 35% 31%, 31% 1%, 28% 23%, 25% 0)",
            }}
          >
            <div
              className="h-full w-full bg-accent"
              style={{
                clipPath:
                  "polygon(72% 0, 70% 10%, 65% 0%, 58% 33%, 54% 7%, 46% 50%, 35% 0%, 31% 0%, 28% 0%, 25% 0)",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Robot;
