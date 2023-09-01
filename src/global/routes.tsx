// CLIENT SIDE - PUBLIC
export const HOME = "/";
export const ABOUT = "/about";
export const WHERE_WHEN = "/about#wherewhen";
export const RULES = "/about#rules";
export const TOURNAMENTS = "/tournaments";
export const PLAYERS = "/players";

// CLIENT SIDE - ADMIN
export const DATA_MANAGER = "/admin/datamanager";

// CLIENT SIDE - SOCIAL MEDIA
export const ULTBRAWL_TWITTER = "https://twitter.com/Smash_BU";
export const ULTBRAWL_YOUTUBE = "https://www.youtube.com/@busmash9476";
export const ULTBRAWL_TWITCH = "https://www.twitch.tv/busmash";
export const MELEE_TWITTER = "https://twitter.com/bu_melee";
export const MELEE_YOUTUBE = "https://www.youtube.com/@bumelee1202";
export const MELEE_TWITCH = "https://www.twitch.tv/bu_melee";
export const DISCORD = "https://discord.gg/VNUuZNRR"; // Will expire unless server settings are changed
export const GITHUB = "https://github.com/bobothechimp/buss_website";

// CLIENT SIDE - 3RD PARTY APIS
export const MAPS_EMBED_CAS =
  "https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ0YVyj_B544kR3tGFwmE0yz4&key=";

// SERVER SIDE
const SERVER_URL = "http://localhost:5000"; // Change for deployment
export const SERVER_GET_SEASONS = SERVER_URL + "/seasons";
export const SERVER_ADD_SEASON = SERVER_URL + "/seasons/add";
export const SERVER_DELETE_SEASON = SERVER_URL + "/seasons/delete";
export const SERVER_GET_TOURNAMENTS = SERVER_URL + "/tournaments";
export const SERVER_GET_LATEST_TOURNAMENT = SERVER_URL + "/tournaments/latest";
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
export const SERVER_GET_PLAYERS = SERVER_URL + "/players";
export const SERVER_RECALCULATE_PLAYERS = SERVER_URL + "/players/recalculate";
