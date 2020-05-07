// it uses to mock all libraries using android

global.android = jest.fn()

jest.mock('nativescript-barcodescanner', () => jest.fn())

jest.mock('nativescript-camera', () => jest.fn())
jest.mock('nativescript-sqlite', () => jest.fn())
jest.mock('nativescript-plugin-firebase', () => {
  return {
    analytics: {
      setScreenName: jest.fn(() => Promise.resolve()),
      logEvent: jest.fn(() => Promise.resolve())
    }
  }
})