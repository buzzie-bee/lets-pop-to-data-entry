import React from 'react';

export const Image = ({ img, imgClass }) => {
  if ('imageData' in img) {
    if ('url' in img.imageData) {
      if (img.imageData.url) {
        const { url, flickrUrl } = img.imageData;
        const { title } = img;
        return (
          <img
            className={imgClass}
            src={url}
            alt={`${title} from ${flickrUrl}`}
          />
        );
      }
    }
  }
  return <></>;
};
