import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../contexts/AppContextProvider";
import ace, { Range } from "ace-builds";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ace-builds/src-noconflict/theme-gruvbox_dark_hard";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-github";
type Props = {
  children: string;
  beforeHeight?: number;
  inputHeight?: number;
};

const CodeBlock: React.FC<Props> = ({
  children,
  beforeHeight,
  inputHeight,
}) => {
  const { setUserScript } = useContext(AppContext);
  let timeout: NodeJS.Timeout | null = null;

  const handleLoad = (ace: ace.Ace.Editor) => {
    if (!inputHeight || !beforeHeight) return;
    const lengthOnLoad = ace.session.doc.getAllLines().length;

    ace.session.addMarker(
      new Range(beforeHeight!, 0, inputHeight! - 1, 1),
      "editArea",
      "fullLine"
    );

    ace.session.on("change", function () {
      const length = ace.session.doc.getAllLines().length;
      // Add row back if person deletes row
      if (length < lengthOnLoad)
        ace.session.insert(
          {
            row: ace.getCursorPosition().row + 1,
            column: 0,
          },
          "\n"
        );

      // Remove row if person adds one
      if (length > lengthOnLoad)
        ace.session.removeFullLines(inputHeight, inputHeight);
      // Move cursor back
      if (beforeHeight && ace.getCursorPosition().row < beforeHeight) {
        ace.moveCursorTo(beforeHeight, 0);
        ace.selection.setAnchor(beforeHeight, 0);
      }

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setUserScript(
          ace.session.getLines(beforeHeight, inputHeight - 1).join("\n")
        );
      }, 500);
    });

    // Make it so you can only edit inside of the edit area
    ace.commands.on("exec", function (event) {
      const anchor = (ace.session.selection as any).anchor;
      const cursor = (ace.session.selection as any).cursor;
      if (
        anchor.row < beforeHeight ||
        cursor.row < beforeHeight ||
        anchor.row > inputHeight - 1 ||
        cursor.row > inputHeight - 1 ||
        (cursor.row === inputHeight - 1 &&
          typeof event.args === "string" &&
          event.args === "\n")
      )
        (event as any).preventDefault();

      // } else if (typeof event.args === "string" && event.args === "\n") {
      //   const linesReverse = ace.session
      //     .getLines(beforeHeight, inputHeight - 1)
      //     .reverse();
      //   console.log(linesReverse);

      //   linesReverse.some((line, index) => {
      //     if (!line) {
      //       console.log(index);

      //       console.log(inputHeight - index);

      //       ace.session.removeFullLines(
      //         inputHeight - index - 1,
      //         inputHeight - index - 1
      //       );

      //       return true;
      //     }
      //   });
      // }
    });
  };

  return (
    <div>
      <AceEditor
        mode="javascript"
        theme="gruvbox"
        name="UNIQUE_ID_OF_DIV"
        fontSize={15}
        width={"100%"}
        height={"100%"}
        style={{ position: "absolute", top: "0" }}
        defaultValue={children}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          showPrintMargin: false,
        }}
        onLoad={(ace) => handleLoad(ace)}
      />
    </div>
  );
};

export default CodeBlock;
