import * as type from "./types";

export const setStoryContent = (key, payload) => {
  return {
    type: type.SET_STORY_PARAMS,
    key,
    payload
  };
};
