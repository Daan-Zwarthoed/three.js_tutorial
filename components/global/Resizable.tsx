import React, { useContext, useEffect } from "react";
type InputProps = {
  children?: any;
  resizeTarget: "Canvas" | "Code";
};
// Resizable element needs id Resizable%NAME% and neighbour needs id Resizable%NAME%Neighbour
const Resizable: React.FC<InputProps> = ({ children, resizeTarget }) => {
  let initialPos: number | null = null;
  let initialSize: number | null = null;
  let mouseDown = false;
  let resizableElement: HTMLElement | null;
  let resizableElementNeighbour: HTMLElement | null;

  useEffect(() => {
    window.addEventListener("mousemove", (event) => handleResize(event));
    window.addEventListener("mouseup", (event) => handleResizeEnd(event));
    window.addEventListener("mouseleave", (event) => handleResizeEnd(event));
    window.addEventListener("resize", (event) => handleWindowResize(event));

    resizableElement = document.getElementById(`Resizable${resizeTarget}`);
    resizableElementNeighbour = document.getElementById(
      `Resizable${resizeTarget}Neighbour`
    );

    const resizableWidth = Number(
      window.localStorage.getItem(`Resizable_${resizeTarget}_Width`)
    );
    if (resizableWidth && resizableElement)
      resizableElement.style.width = `${resizableWidth}px`;
    if (!resizableWidth && resizableElement && resizeTarget === "Canvas")
      resizableElement.style.width = `25%`;
  });

  const resize = (newSize: number) => {
    resizableElementNeighbour!.style.width = `${
      resizableElementNeighbour!.clientWidth +
      resizableElement!.clientWidth -
      newSize
    }px`;
    resizableElement!.style.width = `${newSize}px`;

    window.dispatchEvent(new Event("resize"));
  };

  const handleResizeStart = (event: any) => {
    mouseDown = true;
    initialPos = event.clientX;
    initialSize = resizableElement!.clientWidth;
  };

  const handleWindowResize = (event: any) => {
    if (
      !resizableElement ||
      !resizableElement.parentElement ||
      !resizableElementNeighbour
    )
      return;
    const difference =
      resizableElement.parentElement.clientWidth -
      (resizableElement.clientWidth + resizableElementNeighbour.clientWidth);
    if (difference === 0) return;
    resizableElement!.style.width = `${
      resizableElement!.clientWidth + difference / 2
    }px`;
  };

  const handleResize = (event: any) => {
    if (!mouseDown) return;
    resize(initialSize! - (event.clientX - initialPos!));
  };

  const handleResizeEnd = (event: any) => {
    mouseDown = false;
    initialPos = event.clientX;
    initialSize = resizableElement!.clientWidth;
    if (resizableElement!.clientWidth)
      window.localStorage.setItem(
        `Resizable_${resizeTarget}_Width`,
        JSON.stringify(resizableElement!.clientWidth)
      );
  };

  return (
    <div
      id={`Resizable${resizeTarget}`}
      className="relative h-full w-1/2 shrink-0 "
    >
      <div className="flex flex-col w-full h-full overflow-y-auto">
        {children}
      </div>
      <div
        className="absolute flex justify-center items-center left-0 top-0 z-20 flex h-full w-[10px] cursor-col-resize bg-slate-700"
        onMouseDown={(event) => handleResizeStart(event)}
      >
        <div className="h-20 w-[5px] bg-primary rounded-full"></div>
      </div>
    </div>
  );
};

export default Resizable;
