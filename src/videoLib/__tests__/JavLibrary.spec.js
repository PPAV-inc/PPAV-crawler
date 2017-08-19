import fs from 'fs';
import AxiosMockAdapter from 'axios-mock-adapter';

import JavLibrary from '../JavLibrary';
import getCheerio from '../../getCheerio';

function setup() {
  const searchPage = fs
    .readFileSync('src/videoLib/__fixtures__/JavLib/SNIS-001-SearchPage.html')
    .toString();
  const sourcePage = fs
    .readFileSync('src/videoLib/__fixtures__/JavLib/SNIS-001-SourcePage.html')
    .toString();
  const otherSourcePage = fs
    .readFileSync('src/videoLib/__fixtures__/JavLib/WANZ-666-SourcePage.html')
    .toString();
  const searchNotFound = fs
    .readFileSync('src/videoLib/__fixtures__/JavLib/searchNotFound.html')
    .toString();

  const searchPage$ = getCheerio(searchPage);
  const sourcePage$ = getCheerio(sourcePage);
  const otherSourcePage$ = getCheerio(otherSourcePage);
  const jav = new JavLibrary();
  const httpMock = new AxiosMockAdapter(jav.http);

  return {
    jav,
    searchPage,
    sourcePage,
    searchNotFound,
    searchPage$,
    sourcePage$,
    otherSourcePage$,
    httpMock,
  };
}

it('#_isSearchPage', () => {
  const { jav, searchPage } = setup();

  expect(jav._isSearchPage(searchPage)).toBe(true);
});

it('#_hasResult', () => {
  const { jav, searchNotFound } = setup();

  expect(jav._hasResult(searchNotFound)).toBe(false);
});

it('#_getVideoUrl', () => {
  const { jav, searchPage$ } = setup();

  const code = 'SNIS-001';
  const sourceUrl = '/?v=javlijboz4';
  expect(jav._getVideoUrl(code, searchPage$)).toBe(sourceUrl);
});

describe('#_getCodePage', () => {
  it("should return sourcePage's cheerio even if get searchPage first", async () => {
    const { jav, searchPage, sourcePage, sourcePage$ } = setup();

    const code = 'SNIS-001';
    const httpMock = new AxiosMockAdapter(jav.http);
    httpMock.onGet(`/vl_searchbyid.php?keyword=${code}`).reply(200, searchPage);
    jav._hasResult = jest.fn(() => true);
    jav._isSearchPage = jest.fn(() => true);
    const url = '/?v=javlijboz4';
    jav._getVideoUrl = jest.fn(() => url);
    httpMock.onGet(url).reply(200, sourcePage);

    expect((await jav._getCodePage(code)).toString()).toEqual(
      sourcePage$.toString()
    );
  });

  it('should return sourcePage if it is sourcePage', async () => {
    const { jav, sourcePage, sourcePage$ } = setup();

    const code = 'SNIS-001';
    const httpMock = new AxiosMockAdapter(jav.http);
    httpMock.onGet(`/vl_searchbyid.php?keyword=${code}`).reply(200, sourcePage);
    jav._hasResult = jest.fn(() => true);
    jav._isSearchPage = jest.fn(() => false);

    expect((await jav._getCodePage(code)).toString()).toEqual(
      sourcePage$.toString()
    );
  });

  it('should throw error if searchPage has no result', async () => {
    const { jav, searchPage } = setup();

    const code = 'SNIS-001';
    const httpMock = new AxiosMockAdapter(jav.http);
    httpMock.onGet(`/vl_searchbyid.php?keyword=${code}`).reply(200, searchPage);
    jav._hasResult = jest.fn(() => false);

    expect(jav._getCodePage(code)).rejects.toEqual(
      new Error(`code: ${code}, video not found`)
    );
  });
});

describe('#getCodeInfo', () => {
  it('should get code infos from sourcePage', async () => {
    const { jav, sourcePage$ } = setup();

    const code = 'SNIS-001';
    jav._getCodePage = jest.fn(() => sourcePage$);

    const infos = await jav.getCodeInfos(code);
    expect(infos).toHaveProperty('id');
    expect(typeof infos.id).toBe('string');
    expect(infos).toHaveProperty('publishedAt');
    expect(infos.publishedAt).toBeInstanceOf(Date);
    expect(infos).toHaveProperty('length');
    expect(typeof infos.length).toBe('string');
    expect(infos).toHaveProperty('score');
    expect(typeof infos.score).toBe('number');
    expect(infos).toHaveProperty('tags');
    expect(infos.tags).toBeInstanceOf(Array);
  });

  it('should throw error infos if sourcePage is not same as code', async () => {
    const { jav, otherSourcePage$ } = setup();

    const code = 'SNIS-001';
    const id = 'WANZ-666';
    jav._getCodePage = jest.fn(() => otherSourcePage$);

    expect(jav.getCodeInfos(code)).rejects.toEqual(
      new Error(`code: ${code}, is not same as ${id}`)
    );
  });
});
