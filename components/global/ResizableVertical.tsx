import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  resizeTarget: "Console";
};

const ResizableVertical: React.FC<Props> = ({ children, resizeTarget }) => {
  let initialPos: number | null = null;
  let initialSize: number | null = null;
  let resizableElement: HTMLElement | null;

  useEffect(() => {
    resizableElement = document.getElementById(`Resizable${resizeTarget}`);
  });

  useEffect(() => {
    // Get saved width and apply or apply default
    const resizableHeight = Number(
      window.localStorage.getItem(`Resizable_${resizeTarget}_Width`)
    );
    if (resizableHeight && resizableElement)
      resizableElement.style.height = `${resizableHeight}px`;
    if (!resizableHeight && resizableElement && resizeTarget === "Console")
      resizableElement.style.height = `160px`;
  }, []);

  const handleResizeStart = (
    event: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const html = document.querySelector("html");
    if (html) html.style.userSelect = "none";

    initialPos = event.clientY;
    initialSize = resizableElement!.clientHeight;

    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", handleResizeEnd);
    window.addEventListener("mouseleave", handleResizeEnd);
  };

  const handleResize = (event: MouseEvent) => {
    if (!resizableElement || !resizableElement.parentElement) return;

    resizableElement.style.height = `${
      initialSize! - (event.clientY - initialPos!)
    }px`;

    window.dispatchEvent(new Event("resize"));
  };

  const handleResizeEnd = (event: MouseEvent) => {
    const html = document.querySelector("html");
    if (html) html.style.userSelect = "auto";

    initialPos = event.clientY;
    initialSize = resizableElement!.clientHeight;

    window.removeEventListener("mousemove", handleResize);
    window.removeEventListener("mouseup", handleResizeEnd);
    window.removeEventListener("mouseleave", handleResizeEnd);

    if (resizableElement!.clientHeight)
      window.localStorage.setItem(
        `Resizable_${resizeTarget}_Width`,
        JSON.stringify(resizableElement!.clientHeight)
      );
  };

  return (
    <div
      id={`Resizable${resizeTarget}`}
      className="relative w-full h-1/2 shrink-0 z-10 mt-auto"
    >
      <div className="flex flex-col w-full h-full overflow-y-auto">
        {children}
      </div>
      <div
        className="absolute flex justify-center items-center left-0 top-0 z-20 flex w-full h-[10px] cursor-row-resize bg-backgroundActive"
        onMouseDown={(event) => handleResizeStart(event)}
      >
        <div className="w-20 h-[5px] bg-background rounded-full"></div>
      </div>
    </div>
  );
};

export default ResizableVertical;
