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
  scrollToLine?: number;
};
let editRange: ace.Ace.Range;
const CodeBlock: React.FC<Props> = ({
  children,
  beforeHeight,
  inputHeight,
  inline,
  highlightArea,
  scrollToLine,
}) => {
  const { setUserScript } = useContext(AppContext);
  const [editor, setEditor] = useState<ace.Ace.Editor | null>(null);
  let fromSetChange = false;

  const setup = () => {
    if (!editor) return;

    editor.resize();

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

    if (scrollToLine) {
      editor.setAnimatedScroll(true);
      editor.gotoLine(scrollToLine, 0, true);
    }

    if (beforeHeight && inputHeight) {
      const importRange = new Range(0, 0, beforeHeight - 1, 0);
      editor.session.addMarker(importRange, "importsArea", "fullLine");

      editRange = new Range(beforeHeight, 0, inputHeight - 1, 0);
      const startAnchor = editor.session.doc.createAnchor(
        editRange.start.row,
        editRange.start.column
      );
      editRange.start = startAnchor as unknown as ace.Ace.Point;
      const endAnchor = editor.session.doc.createAnchor(
        editRange.end.row,
        editRange.end.column
      );
      editRange.end = endAnchor as unknown as ace.Ace.Point;
    }
  };
  useEffect(() => {
    setup();
  }, [editor, children, highlightArea]);

  const handleSave = (editor: ace.Ace.Editor | null) => {
    if (!editRange || !editor) return;

    setUserScript(
      editor &&
        editor.session
          .getLines(editRange.start.row, editRange.end.row - 1)
          .join("\n")
    );
  };

  const handleLoad = (editor: ace.Ace.Editor) => {
    editor.commands.addCommand({
      name: "save",
      bindKey: { win: "Ctrl-S", mac: "Cmd-S" },
      exec: handleSave,
    });

    if (inline) editor.setOptions({ maxLines: editor.session.getLength() + 1 });
    setEditor(editor);
  };

  return (
    <div className="h-full">
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
        onLoad={(ace) => handleLoad(ace)}
      />
      {!inline && (
        <div className="absolute z-40 h-10 w-full py-0.5 bottom-0 px-4 bg-background">
          <button
            onClick={() => handleSave(editor)}
            className="h-fit border-2 border-primary px-1 py-0.5 rounded-md "
          >
            Save
          </button>
        </div>
      )}
    </div>
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
