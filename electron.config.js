
module.exports = {
  main: 'electron/main.js',
  productName: 'Eliva Hardware Manager',
  appId: 'com.eliva.hardware',
  directories: {
    output: 'dist_electron',
    app: 'dist'
  },
  files: [
    'dist/**/*',
    'electron/**/*'
  ],
  extraResources: [
    {
      from: 'electron',
      to: 'electron'
    }
  ],
  mac: {
    category: 'public.app-category.business',
    target: ['dmg', 'zip']
  },
  win: {
    target: ['nsis']
  },
  linux: {
    target: ['AppImage', 'deb']
  }
};
