import { Middleware } from "redux";

export const logger: Middleware = (store) => (next) => (action) => {
  console.group(action.type);
  console.info("dispatching", action);
  console.log("Action", action);
  let result = next(action);
  console.log("next state", store.getState());
  return result;
};
