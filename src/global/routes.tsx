export const HOME = "/";
export const ABOUT = "/about";
export const WHERE_WHEN = "/about#wherewhen";
export const RULES = "/about#rules";
export const TOURNAMENTS = "/tournaments";
export const PLAYERS = "/players";

export const DATA_MANAGER = "/admin/datamanager";

const SERVER_URL = "http://localhost:5000"; // Change for deployment
export const SERVER_ADD_SEASON = SERVER_URL + "/seasons/add";
export const SERVER_DELETE_SEASON = SERVER_URL + "/seasons/delete";
export const SERVER_ADD_TOURNAMENT = SERVER_URL + "/tournaments/add";
export const SERVER_DELETE_TOURNAMENT = SERVER_URL + "/tournaments/delete";
export const SERVER_ADD_EVENT = SERVER_URL + "/events/add";
export const SERVER_DELETE_EVENT = SERVER_URL + "/events/delete";
