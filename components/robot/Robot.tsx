import React, { createRef, useContext, useEffect, useState } from "react";
import gsap, { Elastic, Bounce, Power1, Back } from "gsap";
import AppContext from "../../contexts/AppContextProvider";
import StepButton from "../global/StepButton";

type text = {
  compliment: boolean;
  text: string;
  nextButton?: boolean;
};

const animating: gsap.core.Tween[] = [];
const complimentOptions = [
  "Well done!",
  "You're the best!",
  "Nice!",
  "Great job!",
  "Good!",
  "Doing great :)",
];

const randomCompliment = () =>
  complimentOptions[Math.floor(Math.random() * complimentOptions.length)];
let robotIsHidden = true;

const Robot: React.FC = () => {
  const { showRobot, setShowRobot, setFireConfettiPosition } =
    useContext(AppContext);
  const [text, setText] = useState<text>({
    compliment: true,
    text: complimentOptions[0],
  });
  const [confetti, setConfetti] = useState<boolean>(false);
  const robot = createRef<HTMLDivElement>();
  const robotSelf = createRef<HTMLDivElement>();
  const eyeDisplay = createRef<HTMLDivElement>();
  const thruster = createRef<HTMLDivElement>();

  // Default animations of the robot
  useEffect(() => {
    if (!eyeDisplay.current || !thruster.current || !robotSelf.current) return;
    const robotSelfAnimation = gsap.to(robotSelf.current.style, {
      transform: "translate(24.5px, 2px)",
      repeat: -1,
      duration: 2,
      yoyoEase: Bounce.easeInOut,
    });
    animating.push(robotSelfAnimation);
    [...eyeDisplay.current.children].forEach((element) => {
      const eyeAnimation = gsap.to((element as HTMLDivElement).style, {
        height: "20px",
        transform: "translateY(10px)",
        repeat: -1,
        repeatDelay: 2,
        duration: 0.4,
        yoyoEase: Power1.easeInOut,
      });
      animating.push(eyeAnimation);
    });
    const thrusterAnimation = gsap.fromTo(
      thruster.current.style,
      {
        transform: "scaleY(1)",
        repeat: -1,
        duration: 0.2,
        yoyoEase: Back.easeInOut,
      },
      {
        transform: "scaleY(1.1)",
        repeat: -1,
        duration: 0.2,
        yoyoEase: Back.easeInOut,
      }
    );
    animating.push(thrusterAnimation);
    animating.forEach((animation) => animation.pause());
  }, []);

  // Hide robot
  const hideRobot = () => {
    if (!robot.current) return;
    const dissappearXSide = Boolean(Math.round(Math.random()));
    const topOrLeft = Boolean(Math.round(Math.random()));
    const topOrLeftAmount = topOrLeft ? "0%" : "100%";
    const translateAmount = topOrLeft ? "-120%" : "0%";

    setFireConfettiPosition(null);
    gsap
      .to(robot.current.style, {
        left: dissappearXSide ? topOrLeftAmount : Math.random() * 100 + "%",
        top: !dissappearXSide ? topOrLeftAmount : Math.random() * 100 + "%",
        transform: `translate(${translateAmount}, ${translateAmount})`,
        duration: 1.5,
        ease: Power1.easeIn,
      })
      .eventCallback("onComplete", () => {
        animating.forEach((animation) => animation.pause());
        setConfetti(false);
        robotIsHidden = true;
      });
  };

  // Show robot
  const animateShowRobot = async () => {
    if (!robot.current) return;

    robotIsHidden = false;
    if (showRobot.confetti) {
      setConfetti(true);
    } else {
      setText({
        compliment: !showRobot.text,
        text: showRobot.text || randomCompliment(),
        nextButton: showRobot.nextButton,
      });
    }

    animating.forEach((animation) => animation.play());

    gsap
      .to(robot.current.style, {
        left: showRobot.confetti ? "10%" : "50%",
        top: showRobot.confetti ? "75%" : "50%",
        transform: "translate(-50%, -50%)",
        duration: 3,
        ease: Elastic.easeOut,
      })
      .eventCallback("onComplete", () => {
        const robotById = document.getElementById("robot");
        const confettiCannon = document.getElementById("ConfettiCannon");

        if (showRobot.confetti && confettiCannon && robotById) {
          const clientRect = confettiCannon.getBoundingClientRect();
          setFireConfettiPosition({
            x: clientRect.left * 2,
            y: clientRect.top / 2,
          });
        }
        if (!showRobot.confetti && !showRobot.text && !showRobot.nextButton)
          setShowRobot(null);
      });
  };

  // Show or hide the robot
  useEffect(() => {
    if (robot.current) {
      const runningTweens = gsap.getTweensOf(robot.current.style);
      runningTweens.forEach((tween) => tween.kill());
    }

    if (!showRobot || !robot.current) {
      if (!robotIsHidden) hideRobot();
      return;
    }
    animateShowRobot();
  }, [showRobot]);

  return (
    <div
      ref={robot}
      id="robot"
      className="robot absolute z-50 flex flex-col max-w-full"
      style={{
        left: "0%",
        top: "0%",
        transform: "translate(-100%, -100%)",
      }}
    >
      {/* Confetti cannon */}
      {confetti && (
        <div
          id="ConfettiCannon"
          className="relative w-[150px] h-[150px] rounded-xl bg-accent mb-3 rotate-[20deg] origin-bottom-left"
          style={{ clipPath: "polygon(50% 0, 0% 100%, 100% 50%)" }}
        >
          <div
            className="absolute w-full h-full bg-primary -rotate-[20deg]"
            style={{ clipPath: "polygon(40% 0, 20% 0, 70% 100%, 90% 100%)" }}
          ></div>
          <div
            className="asbolute w-full h-full bg-primary -rotate-[20deg]"
            style={{ clipPath: "polygon(0% 0, -20% 0, 30% 100%, 50% 100%)" }}
          ></div>
        </div>
      )}
      {/* Text box */}
      {!confetti && (
        <div className="relative w-max max-w-[800px] p-3 text-center min-w-[150px] rounded-xl border-2 border-accent bg-background mb-3">
          {text.compliment && (
            <h2 className={text.nextButton ? "mb-8" : ""}>{text.text}</h2>
          )}
          {!text.compliment && <p className="mb-8">{text.text}</p>}

          <div className="absolute -bottom-0.5 -right-0.5 rounded-xl">
            {(!text.compliment || text.nextButton) && (
              <button
                className={`p-1 border-2 border-solid border-accent ${
                  text.nextButton ? "rounded-l-xl" : "rounded-xl"
                }`}
                onClick={() => setShowRobot(null)}
              >
                {text.nextButton ? "Stay here" : "Got it"}
              </button>
            )}
            {text.nextButton && (
              <StepButton
                classes={
                  "p-1 rounded-r-xl border-2 border-solid border-primary"
                }
                next
              ></StepButton>
            )}
          </div>
        </div>
      )}

      {/* Robot self */}
      <div
        ref={robotSelf}
        className="flex flex-col"
        style={{ transform: "translate(25px, 0px)" }}
      >
        <div className="relative z-10 w-32 h-20 p-3 rounded-xl bg-[#D9D9D9] mx-auto">
          {/* Arm left */}
          <div className="absolute bottom-[50%] left-0 z-50 w-4 h-16 rounded-xl origin-bottom -rotate-[30deg] bg-[#D9D9D9]"></div>
          {/* Eyes */}
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
          {/* Arm right */}
          <div
            className={`absolute bottom-[50%] right-0 z-50 w-4 rounded-xl origin-bottom -rotate-[30deg] bg-[#D9D9D9] ${
              confetti ? "h-20" : "h-16"
            }`}
          ></div>
        </div>
        {/* Thruster */}
        <div
          className="relative -top-[1px] z-0 w-32 bg-accent mx-auto flex justify-center origin-top"
          style={{
            height: "80px",
            clipPath:
              "polygon(80% 0, 70% 50%, 65% 29%, 58% 83%, 54% 53%, 46% 100%, 35% 51%, 31% 14%, 28% 43%, 20% 0)",
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
