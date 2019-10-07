import * as type from "./types";

export const groupExistsError = () => ({
    type: type.GROUP_EXISTS_ERROR,
    payload: 'error'
});

export const joinGroupError = () => ({
    type: type.JOIN_GROUP_ERROR,
    payload: 'error'
});