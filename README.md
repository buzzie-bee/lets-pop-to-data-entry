# Lets Pop To Data Entry

To reduce api calls to fetch images for each destination I built this helper app to breeze through selecting images using the Flickr API which are licensed to allow non-commerical projects to use them. This is a bit hacky as I just wanted to get it up and running to finish the Lets Pop To project quickly.

## Finding destinations

I wrote a small python script to scrape the cached flight data from skyscanner.

This generated a json file with the same search query used in the lets pop to requests as the key along with data like the iata code for the destination and how frequently it appears as a possible destination for a flight (for prioritising the image gathering).

This data is then entered into a firebase firestore no SQL database so that the front end can read the destinations and store the selected images there.

I may upload the script to github so you can run it yourself sometime.

## Logging data

The app gathers the next image without an image URL by frequency, then queries the flickr api for images related to that destinations search query.

You can change the search query used for the flickr api request (i.e. a search for "Denpasar Airport Indonesia" should probably show images for the whole of Bali), change the ordering from flickr ('interestingness-desc' is the default as it produces interesting images, but sometimes 'relevance' to the search query produces better results).

Once images are selected you can submit them to be stored in the firestore document. Once that has successfully updated you will be redirected to an intermediary page where you can either continue logging or exit before the automatic redirect kicks in.

## Security

As this is a simple helper project I went with a KISS approach to security. Only logged in users with the user ID of myself or the people helping me log results will be able to read/write to the firestore.

## Running locally

Git clone this repo.

Create a firebase project with a firestore:
[https://firebase.google.com/docs/web/setup](https://firebase.google.com/docs/web/setup)

Sign up to flickr and register for an api key:
[https://www.flickr.com/services/apps/create/apply/](https://www.flickr.com/services/apps/create/apply/)

Add your firebase and flickr keys to a .env file with the following names:
REACT_APP_API_KEY={firebaseApiKey}
REACT_APP_AUTH_DOMAIN={firebaseAuthDomain}
REACT_APP_DATABASE_URL={firebaseDatabaseUrl}
REACT_APP_PROJECT_ID={firebaseProjectId}
REACT_APP_STORAGE_BUCKET={firebaseStorageBucket}
REACT_APP_MESSAGING_SENDER_ID={firebaseMessagingSenderId}
REACT_APP_APP_ID={firebaseAppId}
REACT_APP_FLICKR_KEY={flickrApiKey}

Next initialise your firestore with a 'locations' collection containing documents with your desired search queries.

Any queries and documents will do as long as they have an 'imgUrl' property and 'occurances' integer value.

_I may upload the python scripts I used to scrape the destinations and upload to firestore on request._

If testing locally you may not need to add security rules to your firestore but if you do then secure it based on the uid make your read,write permissions:

`request.auth.uid == "uid_person_1" || request.auth.uid == "uid_person_2";`

Now you **should** be in a position to `npm start` the project and play around with it.

As it's a hack it's not super responsive on mobile so I'd stick to desktop browsers.

## Any questions?

Get in touch with me if you have any questions about this. As I've mentioned it's just something I bashed together to make data entry for selecting images a bit better so it's not feature rich, however it's definitely a good enough mvp to let me execute my plan to source images myself.
