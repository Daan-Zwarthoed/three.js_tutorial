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
  inline?: boolean;
};

const CodeBlock: React.FC<Props> = ({
  children,
  beforeHeight,
  inputHeight,
  inline,
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
    if (!editor || !inputHeight || !beforeHeight) return;
    savedLength = editor.session.doc.getAllLines().length;
    const prevMarkers = editor.session.getMarkers();
    if (prevMarkers) {
      const prevMarkersArr = Object.keys(prevMarkers);
      prevMarkersArr.forEach((item) => {
        editor.session.removeMarker(+item);
      });
    }

    editor.session.addMarker(
      new Range(beforeHeight!, 0, inputHeight! - 1, 1),
      "editArea",
      "fullLine"
    );
    // Make it so you can only edit inside of the edit area
    // editor.commands.on("exec", (event: any) => handleExec(event));
    // if (editor.session.getValue() !== children) editor.setValue(children, 1);
  };
  useEffect(() => setup());

  const handleLoad = (loadEditor: ace.Ace.Editor) => {
    if (!inputHeight || !beforeHeight) return;
    setEditor(loadEditor);
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
        value={children}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
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
