# buss_website

Website for the Boston University Smash Society club.

# Setting Up

In the folder `src/global`, create a file named `apikeys.tsx`. In it, you should export two string consts: a Google Maps embed API key named `MAPS_KEY` and a start.gg API key named `STARTGG_KEY`.

In the file `src/global/routes.tsx`, change the const `SERVER_URL` to the URL of your development or production server.

In the folder `api`, create a file named `apikeys.py` and initialize a single string variable named `STARTGG_KEY` which contains your start.gg API key.

In the file `api/server.py`, change the values of `app.config["SERVER_NAME"]` and `app.config["CLIENT_NAME"]` to be the URLs of your server and client sides respectively.
