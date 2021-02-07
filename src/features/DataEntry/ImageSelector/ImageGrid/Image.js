import React from 'react';

export const Image = ({ img, imgClass }) => {
  if ('url_l' in img) {
    if (img.url_l) {
      const { id, owner, ownername, url_l, title } = img;
      const flickrUrl = `https://www.flickr.com/photos/${owner}/${id}`;
      return (
        <img
          className={imgClass}
          src={url_l}
          alt={`${title} by ${ownername} from ${flickrUrl}`}
        />
      );
    }
  }
  return <></>;
};
