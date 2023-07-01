export const SCREEN_WIDTH = {
  desktopLarge: 1440,
  desktopMedium: 1366,
  desktopSmall: 1200,
  tabletLarge: 1024,
  tabletSmall: 768,
  mobileLarge: 720,
  mobileMedium: 432,
};

/*
  0                       432                      720                       768                      1024                    1200                     1366                     1440                      +∞
  |------------------------|------------------------|-------------------------|------------------------|------------------------|------------------------|------------------------|------------------------|
  |   isMobileSmallWidth   |   isMobileMediumWidth  |   isMobileLargeWidth    |   isTabletSmallWidth   |   isTabletLargeWidth   |   isDesktopSmallWidth  |  isDesktopMediumWidth  |  isDesktopLargeWidth   |
  |---------------------------------------------------------------------------|                                                 |                                                                          |
                            isMobileWidth                                     |-------------------------------------------------|                                                                          |
                                                                                                 isTabletWidth                  |--------------------------------------------------------------------------|
                                                                                                                                                               isDesktopWidth
*/

interface GetWidthParams {
  width: number;
}

interface SIZE {
  getIsMobileWidth: (obj: GetWidthParams) => boolean;
  getIsTabletSmallWidth: (obj: GetWidthParams) => boolean;
}

export const SIZE: SIZE = {
  getIsMobileWidth: ({ width }) => width < SCREEN_WIDTH.tabletSmall,
  getIsTabletSmallWidth: ({ width }) =>
    width < SCREEN_WIDTH.tabletLarge && width >= SCREEN_WIDTH.tabletSmall,
};
