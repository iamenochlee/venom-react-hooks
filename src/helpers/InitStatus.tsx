import { Reducer, useReducer } from "react";

export const InitStatus = <T,>(initialStatus: T) => {
  const [status, updateStatus] = useReducer<Reducer<T, Partial<T>>>(
    (currentState, updatedState) => {
      return { ...currentState, ...updatedState };
    },
    initialStatus
  );

  return {
    status,
    updateStatus,
  };
};
