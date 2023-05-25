import React, { useEffect, useState } from "react";
import { Hook, Console, Decode } from "console-feed";
import { Message } from "console-feed/lib/definitions/Component";

const logSetup: Message[] = [
  { method: "log", data: ["Console:"], id: "title" },
];

const MyConsole: React.FC = () => {
  const [logs, setLogs] = useState<Message[]>([...logSetup]);

  useEffect(() => {
    let currentLogs: Message[] = [...logSetup];

    Hook(window.console, (log) => {
      const newLog = Decode(log);
      // Only display first line of error. The rest is innacurate.
      if (newLog && newLog.data && newLog.method === "error")
        newLog.data[0] = newLog.data[0].split("\n")[0];

      currentLogs.push(newLog as Message);
      setLogs([...currentLogs]);
    });
  }, []);

  return (
    <div className="w-full h-full pl-3 bg-black pb-10 pt-[10px] overflow-scroll">
      <Console filter={["log", "error"]} logs={logs} variant="dark" />
    </div>
  );
};

export default MyConsole;
