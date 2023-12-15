// write a jest test that just asserts that MAX_REP_SCORE is 20000
//
import {
  CAT_COLINKS_MAX_SCORE,
  CAT_COORDINAPE_ECOSYSTEM_MAX_SCORE,
  CAT_WEB2_MAX_SCORE,
  CAT_WEB3_MAX_SCORE,
  MAX_REP_SCORE,
} from './scoring';

describe('check rep score maxes', () => {
  it('MAX_REP_SCORE should be 20000', () => {
    expect(MAX_REP_SCORE).toEqual(20000);
  });
  it('CAT_COLINKS_MAX_SCORE should be 15000', () => {
    expect(CAT_COLINKS_MAX_SCORE).toEqual(15000);
  });
  it('CAT_WEB2_MAX_SCORE should be 1200', () => {
    expect(CAT_WEB2_MAX_SCORE).toEqual(1000);
  });
  it('CAT_WEB3_MAX_SCORE should be 500', () => {
    expect(CAT_WEB3_MAX_SCORE).toEqual(500);
  });
  it('CAT_COORDINAPE_ECOSYSTEM_MAX_SCORE should be 500', () => {
    expect(CAT_COORDINAPE_ECOSYSTEM_MAX_SCORE).toEqual(3500);
  });
});
