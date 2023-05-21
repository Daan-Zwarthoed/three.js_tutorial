import React, { useContext, useEffect } from "react";
type InputProps = {
  children?: any;
  resizeTarget: "Console";
};
const ResizableVertical: React.FC<InputProps> = ({
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

    const resizableHeight = Number(
      window.localStorage.getItem(`Resizable_${resizeTarget}_Width`)
    );

    if (resizableHeight && resizableElement)
      resizableElement.style.height = `${resizableHeight}px`;
    if (!resizableHeight && resizableElement && resizeTarget === "Console")
      resizableElement.style.height = `160px`;
  });

  const resize = (newSize: number) => {
    if (!resizableElement || !resizableElement.parentElement) return;
    resizableElement.style.height = `${newSize}px`;

    window.dispatchEvent(new Event("resize"));
  };

  const handleResizeStart = (event: any) => {
    mouseDown = true;
    initialPos = event.clientY;
    initialSize = resizableElement!.clientHeight;
  };

  const handleResize = (event: any) => {
    if (!mouseDown) return;
    resize(initialSize! - (event.clientY - initialPos!));
  };

  const handleResizeEnd = (event: any) => {
    mouseDown = false;
    initialPos = event.clientY;
    initialSize = resizableElement!.clientHeight;

    if (resizableElement!.clientHeight)
      window.localStorage.setItem(
        `Resizable_${resizeTarget}_Width`,
        JSON.stringify(resizableElement!.clientHeight)
      );
  };

  return (
    <div
      id={`Resizable${resizeTarget}`}
      className="relative w-full h-1/2 shrink-0 z-10"
    >
      <div className="flex flex-col w-full h-full overflow-y-auto">
        {children}
      </div>
      <div
        className="absolute flex justify-center items-center left-0 top-0 z-20 flex w-full h-[10px] cursor-row-resize bg-tertary"
        onMouseDown={(event) => handleResizeStart(event)}
      >
        <div className="w-20 h-[5px] bg-background rounded-full"></div>
      </div>
    </div>
  );
};

export default ResizableVertical;