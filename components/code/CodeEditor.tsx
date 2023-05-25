import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../contexts/AppContextProvider";
import ace, { Range } from "ace-builds";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";

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
  const { setUserScript, setShowRobot } = useContext(AppContext);
  const [editor, setEditor] = useState<ace.Ace.Editor | null>(null);

  // Prevents user from editing imports
  const handleExec = (event: {
    editor: ace.Ace.Editor;
    preventDefault: Function;
  }) => {
    if (!editRange) return;

    const anchor = (event.editor.session.selection as any).anchor;
    const cursor = (event.editor.session.selection as any).cursor;

    if (anchor.row < editRange.start.row || cursor.row < editRange.start.row) {
      setShowRobot({
        text: "You can't edit the imports seeing that that is not supported by Javascript",
      });
      return event.preventDefault();
    }
  };

  // Setting everything up
  const setup = () => {
    if (!editor) return;

    editor.resize();

    // If code is updated by parent component update value
    if (editor.session.getValue() !== children) editor.setValue(children, 1);

    // Remove past markers
    const prevMarkers = editor.session.getMarkers();
    if (prevMarkers) {
      const prevMarkersArr = Object.keys(prevMarkers);
      prevMarkersArr.forEach((item) => {
        editor.session.removeMarker(+item);
      });
    }

    // Highlightarea
    if (highlightArea) {
      editor.session.addMarker(
        new Range(highlightArea.startRow - 1, 0, highlightArea.endRow - 1, 1),
        "highlightArea",
        "fullLine"
      );

      editor.setAnimatedScroll(true);
      editor.gotoLine(highlightArea.startRow, 0, true);
    }

    // Scroll to line
    if (scrollToLine) {
      editor.setAnimatedScroll(true);
      editor.gotoLine(scrollToLine, 0, true);
    }

    // Adds editable range with anchors
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

  // Only setup when editor, children or highlightArea is updated
  useEffect(() => {
    setup();
  }, [editor, children, highlightArea]);

  // Applies progress to assignments and canvas
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
    if (!inline) {
      editor.commands.on("exec", handleExec);

      editor.commands.addCommand({
        name: "save",
        bindKey: { win: "Ctrl-S", mac: "Cmd-S" },
        exec: handleSave,
      });
    }

    // Inline editor padding
    if (inline) {
      const paddingLeft = 10;
      editor.renderer.setScrollMargin(8, 8, paddingLeft, 0);
      editor.renderer.scrollToX(-paddingLeft);

      editor.setOptions({ maxLines: editor.session.getLength() });
    }
    setEditor(editor);
  };

  return (
    <div className="h-full">
      {/* Editor itself */}
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
      {/* This is the save button and bar at the bottom */}
      {!inline && (
        <div className="absolute flex justify-end z-20 h-12 w-full py-1.5 bottom-0 px-4 bg-background">
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
