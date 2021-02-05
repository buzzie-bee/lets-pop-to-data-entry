import { stringify } from 'query-string';

export const fetchImageIds = async ({
  searchQuery,
  page,
  setTotalResults,
  setImages,
  images,
}) => {
  try {
    const url = 'https://www.flickr.com/services/rest/';
    const params = {
      method: 'flickr.photos.search',
      text: searchQuery,
      api_key: process.env.REACT_APP_FLICKR_KEY,
      format: 'json',
      nojsoncallback: 1,
      license: '1,2,3,4,5,6,7,9,10',
      sort: 'interestingness-desc',
      accuracy: '11',
      safe_search: '1',
      content_type: '1',
      media: 'photos',
      per_page: 20,
      page: page,
    };
    const paramString = stringify(params);
    const response = await fetch(`${url}?${paramString}`);
    const imagesResponse = await response.json();

    if (imagesResponse) {
      if (imagesResponse.photos) {
        if (imagesResponse.photos.total) {
          setTotalResults(imagesResponse.photos.total);
        }
        if (imagesResponse.photos.photo) {
          if (Array.isArray(imagesResponse.photos.photo)) {
            const newPhotos = imagesResponse.photos.photo;
            console.log('setting images!');
            console.log('prev img => ', images);
            console.log('new imgs => ', [...images, ...newPhotos]);
            setImages([...images, ...newPhotos]);
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
