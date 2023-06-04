import { Reducer, useReducer } from "react";

export const InitMessageStatus = <T,>(initialStatus: T) => {
  const [messageStatus, updateMessageStatus] = useReducer<
    Reducer<T, Partial<T>>
  >((currentState, updatedState) => {
    return { ...currentState, ...updatedState };
  }, initialStatus);

  return {
    messageStatus,
    updateMessageStatus,
  };
};
