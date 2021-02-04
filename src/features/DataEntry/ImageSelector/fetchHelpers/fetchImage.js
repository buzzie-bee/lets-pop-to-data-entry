import { stringify } from 'query-string';

export const fetchImage = async ({ id, setLoading }) => {
  if (!id) {
    console.log('error no id given');
    return;
  }
  try {
    const url = 'https://www.flickr.com/services/rest/';
    const params = {
      method: 'flickr.photos.getSizes',
      api_key: process.env.REACT_APP_FLICKR_KEY,
      photo_id: id,
      format: 'json',
      nojsoncallback: 1,
    };
    const paramString = stringify(params);
    const response = await fetch(`${url}?${paramString}`);
    const imagesResponse = await response.json();

    if (imagesResponse) {
      if (imagesResponse.sizes) {
        if (imagesResponse.sizes.size) {
          if (Array.isArray(imagesResponse.sizes.size)) {
            const sizes = imagesResponse.sizes.size;
            const medium = sizes.filter((size) => size.label === 'Medium')[0];
            const url = medium.source;
            const flickrUrl = medium.url;
            const width = medium.width;
            const height = medium.height;
            const image = {
              url,
              flickrUrl,
              width,
              height,
            };
            setLoading(false);
            return image;
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
