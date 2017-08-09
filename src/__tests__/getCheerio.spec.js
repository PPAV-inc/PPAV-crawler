import getCheerio from '../getCheerio';

jest.mock('cheerio');

const cheerio = require('cheerio');

describe('getCheerio', () => {
  it('should be defined', () => {
    expect(getCheerio).toBeDefined();
  });

  it('should return cheerio.load', () => {
    cheerio.load = jest.fn();

    getCheerio('<p>abc</p>');

    expect(cheerio.load).toBeCalledWith('<p>abc</p>');
  });
});
