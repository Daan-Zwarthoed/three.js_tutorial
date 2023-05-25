import Link from "next/link";
import React, { createRef, useContext, useEffect } from "react";
import StepTitle from "../tutorialHelpers/StepTitle";
import gsap, { Power1 } from "gsap";
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
    });
    Array.from(confettiParent.current.children).forEach((child) => {
      // Acting like confetti animation
      gsap.to(child, {
        scaleX: random(0.1, 0.5),
        ...defaultRepeat(),
      });
      gsap.to(child, {
        translateX: random(6, 20) + "px",
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
      gsap.to(child, {
        rotation: random(0, 270),
        ...defaultRepeat(),
      });
      // Fly somewhere
      gsap
        .to(child, {
          x: random(400, window.innerWidth - 20),
          y: -random(20, window.innerHeight - 20),

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
              y: -30,
              duration: random(5, 10),
            })
            .eventCallback("onComplete", () => {
              // Kill all animation on complete
              const runningTweens = gsap.getTweensOf(child);
              runningTweens.forEach((tween) => {
                tween.kill();
              });
            });
        });
    });
    setTimeout(() => {
      setShowRobot(null);
    }, 1000);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowRobot({ confetti: true });
    });
  }, []);

  useEffect(() => {
    fireConfetti();
  }, [fireConfettiPosition]);

  return (
    <div className="flex flex-col justify-center items-center w-full p-5">
      <StepTitle>YOU MADE IT!!</StepTitle>
      <p className="mt-8">Congratulations you finished the tutorial!!</p>
      <Link href="/">
        <button className="bg-primary rounded-md p-3 mt-8">Back to home</button>
      </Link>
      <div ref={confettiParent}>
        {[...new Array(80)].map((number, index) => (
          <div
            className="conffeti absolute w-5 h-8"
            style={{
              backgroundColor: randomColorPicker(),
              left: "0",
              bottom: "0",
              transform: "scaleX(1)",
            }}
            key={index}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Finish;
