import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../contexts/AppContextProvider";
import ace, { Range } from "ace-builds";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-dracula";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-github";
type Props = {
  children: string;
  beforeHeight?: number;
  inputHeight?: number;
  inline?: boolean;
  highlightArea?: {
    startRow: number;
    endRow: number;
  };
};

const CodeBlock: React.FC<Props> = ({
  children,
  beforeHeight,
  inputHeight,
  inline,
  highlightArea,
}) => {
  const { setUserScript } = useContext(AppContext);
  let timeout: NodeJS.Timeout | null = null;
  const [editor, setEditor] = useState<ace.Ace.Editor | null>(null);

  let savedLength = 0;
  const handleChange = () => {
    if (!editor || !inputHeight || !beforeHeight) return;

    // const length = editor.session.doc.getAllLines().length;
    // // Add row back if person deletes row
    // if (length < savedLength)
    //   editor.session.insert(
    //     {
    //       row: editor.getCursorPosition().row + 1,
    //       column: 0,
    //     },
    //     "\n"
    //   );

    // // Remove row if person adds one
    // if (length > savedLength)
    //   editor.session.removeFullLines(inputHeight, inputHeight);
    // // Move cursor back
    // if (beforeHeight && editor.getCursorPosition().row < beforeHeight) {
    //   editor.moveCursorTo(beforeHeight, 0);
    //   editor.selection.setAnchor(beforeHeight, 0);
    // }

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      setUserScript(
        editor &&
          editor.session.getLines(beforeHeight, inputHeight - 1).join("\n")
      );
    }, 500);
  };

  const setup = () => {
    if (!editor) return;
    savedLength = editor.session.doc.getAllLines().length;

    // Make it so you can only edit inside of the edit area
    // editor.commands.on("exec", (event: any) => handleExec(event));
    // if (editor.session.getValue() !== children) editor.setValue(children, 1);
    const prevMarkers = editor.session.getMarkers();
    if (prevMarkers) {
      const prevMarkersArr = Object.keys(prevMarkers);
      prevMarkersArr.forEach((item) => {
        editor.session.removeMarker(+item);
      });
    }
    if (highlightArea) {
      editor.session.addMarker(
        new Range(highlightArea.startRow - 1, 0, highlightArea.endRow - 1, 1),
        "highlightArea",
        "fullLine"
      );
      editor.scrollToLine(highlightArea.startRow, true, true, function () {});
    }

    if (inputHeight && beforeHeight)
      editor.session.addMarker(
        new Range(beforeHeight, 0, inputHeight - 1, 1),
        "editArea",
        "fullLine"
      );
  };
  useEffect(() => setup());

  const handleLoad = (editor: ace.Ace.Editor) => {
    setEditor(editor);
  };

  return (
    <AceEditor
      mode="javascript"
      theme="dracula"
      name="AceEditor"
      fontSize={15}
      width={"100%"}
      height={"100%"}
      style={{ position: "absolute", top: "0" }}
      value={children}
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        useWorker: false,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        showPrintMargin: false,
        highlightActiveLine: !inline,
        highlightSelectedWord: !inline,
        showGutter: !inline,
        showLineNumbers: !inline,
        autoScrollEditorIntoView: true,
      }}
      onChange={(value, event) => handleChange()}
      onLoad={(ace) => handleLoad(ace)}
    />
  );
};

export default CodeBlock;

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

// const handleExec = (event: {
//   editor?: ace.Ace.Editor;
//   command?: ace.Ace.Command;
//   args: any;
//   preventDefault: Function;
// }) => {
//   console.log(inputHeight);
//   if (!editor || !inputHeight || !beforeHeight) return;

//   const anchor = (editor.session.selection as any).anchor;
//   const cursor = (editor.session.selection as any).cursor;

//   if (
//     anchor.row < beforeHeight ||
//     cursor.row < beforeHeight ||
//     anchor.row > inputHeight - 1 ||
//     cursor.row > inputHeight - 1 ||
//     (cursor.row === inputHeight - 1 &&
//       typeof event.args === "string" &&
//       event.args === "\n")
//   )
//     return event.preventDefault();
// };
