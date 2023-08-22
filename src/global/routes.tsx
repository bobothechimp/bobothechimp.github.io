// CLIENT SIDE - PUBLIC
export const HOME = "/";
export const ABOUT = "/about";
export const WHERE_WHEN = "/about#wherewhen";
export const RULES = "/about#rules";
export const TOURNAMENTS = "/tournaments";
export const PLAYERS = "/players";

// CLIENT SIDE - ADMIN
export const DATA_MANAGER = "/admin/datamanager";

// SERVER SIDE
const SERVER_URL = "http://localhost:5000"; // Change for deployment
export const SERVER_GET_SEASONS = SERVER_URL + "/seasons";
export const SERVER_ADD_SEASON = SERVER_URL + "/seasons/add";
export const SERVER_DELETE_SEASON = SERVER_URL + "/seasons/delete";
export const SERVER_GET_TOURNAMENTS = SERVER_URL + "/tournaments";
export const SERVER_TOURNAMENTS_FROM_SEASON = (season) =>
  SERVER_URL + "/seasons/" + season + "/tournaments";
export const SERVER_ADD_TOURNAMENT = SERVER_URL + "/tournaments/add";
export const SERVER_DELETE_TOURNAMENT = SERVER_URL + "/tournaments/delete";
export const SERVER_GET_EVENTS = SERVER_URL + "/events";
export const SERVER_EVENTS_FROM_SEASON = (season) =>
  SERVER_URL + "/seasons/" + season + "/events";
export const SERVER_EVENTS_FROM_TOURNAMENT = (tournament) =>
  SERVER_URL + "/tournaments/" + tournament + "/events";
export const SERVER_ADD_EVENT = SERVER_URL + "/events/add";
export const SERVER_DELETE_EVENT = SERVER_URL + "/events/delete";
