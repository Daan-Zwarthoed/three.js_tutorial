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
let range: ace.Ace.Range;
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
  let fromSetChange = false;
  const handleChange = () => {
    if (!editor || !inputHeight || !beforeHeight || fromSetChange) return;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (range) {
        setUserScript(
          editor &&
            editor.session
              .getLines(range.start.row, range.end.row - 1)
              .join("\n")
        );
      }
    }, 500);
  };

  const setup = () => {
    if (!editor) return;

    // Make it so you can only edit inside of the edit area
    // editor.commands.on("exec", (event: any) => handleExec(event));
    fromSetChange = true;
    if (editor.session.getValue() !== children) editor.setValue(children, 1);
    fromSetChange = false;

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

      editor.setAnimatedScroll(true);
      editor.gotoLine(highlightArea.startRow, 0, true);
    }
    if (beforeHeight && inputHeight) {
      range = new Range(beforeHeight, 0, inputHeight - 1, 0);
      const startAnchor = editor.session.doc.createAnchor(
        range.start.row,
        range.start.column
      );
      range.start = startAnchor as unknown as ace.Ace.Point;
      const endAnchor = editor.session.doc.createAnchor(
        range.end.row,
        range.end.column
      );
      range.end = endAnchor as unknown as ace.Ace.Point;

      editor.session.addMarker(range, "editArea", "fullLine");
    }
  };
  useEffect(() => {
    setup();
  }, [editor, children, highlightArea]);

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
      defaultValue={children}
      editorProps={{ animatedScroll: true }}
      setOptions={{
        useWorker: false,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        showPrintMargin: false,
        highlightActiveLine: !inline,
        highlightSelectedWord: !inline,
        showGutter: !inline,
        showLineNumbers: !inline,
        readOnly: inline,
        autoScrollEditorIntoView: true,
      }}
      onChange={() => handleChange()}
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
