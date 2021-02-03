import * as functions from 'firebase-functions';
import * as cors from 'cors';
// import * as airlines from '../airlines.json';

const corsHandler = cors({ origin: true });

const checkParams = (params: any) => {
  let searchTermCheck = false;

  try {
    if (params.searchTerm) {
      if (typeof params.searchTerm === 'string') {
        searchTermCheck = true;
      }
    }
  } catch (error) {
    // console.log(error);
    return false;
  }
  return searchTermCheck;
};

export const fetchPhotos = functions
  .region('europe-west1')
  .https.onRequest(async (request, response) => {
    corsHandler(request, response, async () => {
      functions.logger.info('Received fetch photos request', request.query);

      if (!checkParams(request.query)) {
        response.status(400).json({
          message:
            'Not all required fields were sent. Required fields: searchTerm',
          query: request.query,
        });
        return;
      }
      const { searchTerm } = request.query;

      response.status(200).json({ query: request.query, searchTerm });
      // const airlineData = airlines.find(
      //   (airline) => airline.name === airlineName
      // );

      // const airlineIata = airlineData?.iata_code;

      // if (!airlineIata) {
      //   const errorMessage = `No Iata found for airline: ${airlineName}`;
      //   functions.logger.error('Fetch Airline Logo Error:', {
      //     query: request.query,
      //     error: errorMessage,
      //   });
      //   response
      //     .status(501)
      //     .json({ query: request.query, error: errorMessage });
      //   return;
      // }

      // Airhex logo request documentation: https://airhex.com/api/logos/

      // const airHexKey =
      //   functions.config().airhex?.key || 'AIRHEX_API_KEY_NOT_FOUND';
      // const width = 300;
      // const height = 300;
      // const type = 't';

      // const baseUrl = `https://content.airhex.com/content/logos/airlines_${airlineIata}_${width}_${height}_${type}.png`;

      // const queryData = `${airlineIata}_${width}_${height}_${type}_${airHexKey}`;
      // const md5Hash = crypto.createHash('md5').update(queryData).digest('hex');

      // const imgUrl = `${baseUrl}?md5apikey=${md5Hash}`;
      // response.status(200).json({
      //   imgUrl,
      // });
      // return;
    });
  });
