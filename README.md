## Project Name: 
Social Playlist
 
- [Live app](https://social-playlist.netlify.com)
- [Heroku-endpoint](https://still-fortress-90057.herokuapp.com)
- [Heroku-git](https://git.heroku.com/still-fortress-90057.git)
- [Client-Repo](https://github.com/thinkful-ei-heron/SocialPlaylist-Client)
- [Server-Repo](https://github.com/thinkful-ei-heron/SocialPlaylist-server)

## Contributors :
 - Daniel Bright, https://github.com/Brahyt
 - LaZandrea 'Zee' Celestine, https://github.com/zeecelest
 - Julio Hernandez, https://github.com/hernandez-crypto
 - Wesley Jacobs, https://github.com/wjacobs71086
 - Glaiza Wagner, https://github.com/glaizawagner

## API Endpoints :
POST/api/spots
- Adds a 'spot' to a playlist.  

GET/api/spots/:id 
- Returns details from a specific 'spot'.

DELETE/api/spots/:id 
- Deletes record from the 'spots table.

PATCH/api/spots/:id 
- Allows user to edit 'spots'.

POST/api/lists/like/:list_id 
- Toggles favorite for that list.

GET/api/users/:name 
- Returns user with name 

GET/api/usr/lists/:id 
- Returns with all the lists created by user.

## Summary (what user does or what app enables for users)
The user is able to create an account and/or log in and create 'Social Playlists' that showcase their favorite local 'spots.  Users can select to make their 'playlists' private or share with other 'Listers.'  Users are able to view a map of their current location that also shows how close they are to a 'spot' on a 'playlist.'  Users my like other 'playlists', as well as 'spots' on a particular 'playlist'.  Users may also delete and edit their 'spots' and 'playlists'.

## Technology Used: 
Node | Express | PostgreSQL | GeoCode | Bcryptjs | JWT | Morgan | Chai | Supertest

Deployed in Heroku