import { FC } from "react";
import { useChatContext } from "./chat-context";
import { ChatStyleSelector } from "./chat-empty-state/chat-style-selector";
import { ChatSensitivitySelector } from "./chat-empty-state/chat-sensitivity-selector";
import { ChatTypeSelector } from "./chat-empty-state/chat-type-selector";

interface Prop {}

export const ChatHeader: FC<Prop> = (props) => {
  const { chatBody } = useChatContext();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <ChatTypeSelector disable={true} />
        <ChatSensitivitySelector disable={true} />
        <ChatStyleSelector disable={true} />
      </div>
      <div className="flex gap-2 h-2">
        <p className="text-xs">{chatBody.chatOverFileName}</p>
      </div>
    </div>
  );
};
