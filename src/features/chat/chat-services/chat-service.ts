"use server";
import "server-only";

import { uniqueId } from "@/features/common/util";
import { SqlQuerySpec } from "@azure/cosmos";
import { CosmosDBContainer } from "../../common/cosmos";
import { ChatMessageModel, MESSAGE_ATTRIBUTE } from "./models";

export const FindAllChats = async (chatThreadID: string) => {
  const container = await CosmosDBContainer.getInstance().getContainer();

  const querySpec: SqlQuerySpec = {
    query:
      "SELECT * FROM root r WHERE r.type=@type AND r.threadId = @threadId AND r.isDeleted=@isDeleted",
    parameters: [
      {
        name: "@type",
        value: MESSAGE_ATTRIBUTE,
      },
      {
        name: "@threadId",
        value: chatThreadID,
      },
      {
        name: "@isDeleted",
        value: false,
      },
    ],
  };

  const { resources } = await container.items
    .query<ChatMessageModel>(querySpec)
    .fetchAll();

  return resources;
};

export const FindChatMessageByID = async (id: string) => {
  const container = await CosmosDBContainer.getInstance().getContainer();

  const querySpec: SqlQuerySpec = {
    query:
      "SELECT * FROM root r WHERE r.type=@type AND r.id=@id AND r.isDeleted=@isDeleted",
    parameters: [
      {
        name: "@type",
        value: MESSAGE_ATTRIBUTE,
      },
      {
        name: "@id",
        value: id,
      },
      {
        name: "@isDeleted",
        value: false,
      },
    ],
  };


  const { resources } = await container.items
    .query<ChatMessageModel>(querySpec)
    .fetchAll();

  return resources;
};
export const CreateUserFeedbackChatId = async (
  chatMessageId: string,
  feedback: string,
  reason: string,
  ) => {
    
  try {
    const container = await CosmosDBContainer.getInstance().getContainer();
    const chatMessageModel = await FindChatMessageByID(chatMessageId);

    if (chatMessageModel.length !== 0) {
      const message = chatMessageModel[0];
      message.feedback = feedback;
      message.reason = reason;

      const itemToUpdate = {
        ...message,
      };
  
      await container.items.upsert(itemToUpdate);
      return itemToUpdate;
    }
  } catch (e: unknown) {
    console.log("There was an error in saving user feedback", e);
  }
};

export const UpsertChat = async (chatModel: ChatMessageModel) => {
  const modelToSave: ChatMessageModel = {
    ...chatModel,
    id: uniqueId(),
    createdAt: new Date(),
    type: MESSAGE_ATTRIBUTE,
    isDeleted: false,
  };

  const container = await CosmosDBContainer.getInstance().getContainer();
  await container.items.upsert(modelToSave);
};

export const insertPromptAndResponse = async (
  threadID: string,
  userQuestion: string,
  assistantResponse: string
) => {
  await UpsertChat({
    ...newChatModel(),
    content: userQuestion,
    threadId: threadID,
    role: "user",
  });
  await UpsertChat({
    ...newChatModel(),
    content: assistantResponse,
    threadId: threadID,
    role: "assistant",
  });
};

export const newChatModel = (): ChatMessageModel => {
  return {
    content: "",
    threadId: "",
    role: "user",
    userId: "",
    id: uniqueId(),
    createdAt: new Date(),
    type: MESSAGE_ATTRIBUTE,
    isDeleted: false,
    context: "",
    feedback: "",
    reason: "",
  };
};
