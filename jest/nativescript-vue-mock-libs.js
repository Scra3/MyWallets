// must mock this libs because it call android platform before mounting app
jest.mock('nativescript-barcodescanner', () => '')
jest.mock('nativescript-camera', () => '')
