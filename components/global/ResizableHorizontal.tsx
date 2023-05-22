import React, { useContext, useEffect } from "react";
type InputProps = {
  children?: React.ReactNode;
  resizeTarget: "Canvas" | "Code";
};
const ResizableHorizontal: React.FC<InputProps> = ({
  children,
  resizeTarget,
}) => {
  let initialPos: number | null = null;
  let initialSize: number | null = null;
  let mouseDown = false;
  let resizableElement: HTMLElement | null;

  useEffect(() => {
    resizableElement = document.getElementById(`Resizable${resizeTarget}`);

    window.removeEventListener("mousemove", handleResize);
    window.removeEventListener("mouseup", handleResizeEnd);
    window.removeEventListener("mouseleave", handleResizeEnd);

    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", handleResizeEnd);
    window.addEventListener("mouseleave", handleResizeEnd);

    const resizableWidth = Number(
      window.localStorage.getItem(`Resizable_${resizeTarget}_Width`)
    );

    if (resizableWidth && resizableElement)
      resizableElement.style.width = `${resizableWidth}px`;
    if (!resizableWidth && resizableElement && resizeTarget === "Code")
      resizableElement.style.width = `90px`;
    if (!resizableWidth && resizableElement && resizeTarget === "Canvas")
      resizableElement.style.width = `90px`;
  });

  const resize = (newSize: number) => {
    if (!resizableElement || !resizableElement.parentElement) return;
    resizableElement.style.width = `${newSize}px`;

    window.dispatchEvent(new Event("resize"));
  };

  const handleResizeStart = (
    event: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    mouseDown = true;
    initialPos = event.clientX;
    initialSize = resizableElement!.clientWidth;
  };

  const handleResize = (event: MouseEvent) => {
    if (!mouseDown) return;
    resize(initialSize! - (event.clientX - initialPos!));
  };

  const handleResizeEnd = (event: MouseEvent) => {
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
        className="absolute flex justify-center items-center left-0 top-0 z-20 flex h-full w-[10px] cursor-col-resize bg-tertary"
        onMouseDown={(event) => handleResizeStart(event)}
      >
        <div className="h-20 w-[5px] bg-background rounded-full"></div>
      </div>
    </div>
  );
};

export default ResizableHorizontal;
