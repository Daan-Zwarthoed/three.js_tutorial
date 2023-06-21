import Link from "next/link";
import React, { createRef, useContext, useEffect } from "react";
import StepTitle from "../tutorialHelpers/StepTitle";
import gsap, { Power1, Sine } from "gsap";
import SlowMo from "gsap/EasePack";

import AppContext from "../../contexts/AppContextProvider";

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

const randomColors = ["yellow", "red", "green", "orange", "lightblue"];
const randomColorPicker = () => {
  return randomColors[Math.floor(Math.random() * randomColors.length)];
};

const defaultRepeat = () => {
  return {
    duration: random(1, 3),
    repeat: -1,
    yoyo: true,
    ease: Power1.easeInOut,
  };
};

const Finish: React.FC = () => {
  const { setShowRobot, fireConfettiPosition } = useContext(AppContext);
  const confettiParent = createRef<HTMLDivElement>();

  const fireConfetti = () => {
    if (!confettiParent.current || !fireConfettiPosition) return;

    // Set from where confetti will fly
    gsap.set(confettiParent.current.children, {
      x: fireConfettiPosition.x,
      y: -fireConfettiPosition.y,
      left: 0,
      bottom: 0,
      scaleX: 1,
    });
    Array.from(confettiParent.current.children).forEach((child) => {
      gsap.set(child, {
        backgroundColor: randomColorPicker(),
      });
      // Acting like confetti animation
      gsap.to(child, {
        scaleX: random(0.1, 0.5),
        ...defaultRepeat(),
      });
      gsap.to(child, {
        rotateX: random(0, 270),
        ...defaultRepeat(),
      });
      gsap.to(child, {
        rotateY: random(0, 270),
        ...defaultRepeat(),
      });
      gsap.to(child, {
        rotateZ: random(0, 270),
        ...defaultRepeat(),
      });
      // Fly somewhere
      gsap
        .to(child, {
          x: random(400, window.innerWidth - 20),
          y: -random(40, window.innerHeight - 20),

          duration: 1,
        })
        .eventCallback("onComplete", () => {
          // Sway left to right
          gsap.to(child, {
            x: "+=" + (Math.round(random(0, 1)) ? "-" : "") + random(40, 100),
            ...defaultRepeat(),
          });
          // Go down
          gsap
            .to(child, {
              y: 0,
              ease: Sine.easeIn,
              duration: random(5, 11),
            })
            .eventCallback("onComplete", () => {
              // Kill all animation on complete
              setShowRobot(null);
              const runningTweens = gsap.getTweensOf(child);
              runningTweens.forEach((tween) => {
                tween.kill();
              });
            });
        });
    });
  };

  // Activate the robot to fly in
  useEffect(() => {
    setTimeout(() => {
      setShowRobot({ confetti: true });
    });
  }, []);

  // Fire the confetti if the fire position is returned from the robot
  useEffect(() => {
    fireConfetti();
  }, [fireConfettiPosition]);

  return (
    <div className="flex flex-col justify-center items-center w-full p-5">
      <StepTitle>YOU MADE IT!!</StepTitle>
      <p className="mt-p">Congratulations you finished the tutorial!!</p>
      <Link href="/">
        <button className="bg-accent rounded-md p-3 mt-p">Back to home</button>
      </Link>
      <div ref={confettiParent}>
        {[...new Array(80)].map((_, index) => (
          <div className="absolute w-5 h-8" key={index}></div>
        ))}
      </div>
    </div>
  );
};

export default Finish;
