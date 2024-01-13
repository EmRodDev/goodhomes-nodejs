import path from 'path';

export default {
    mode: 'development',
    entry: {
        map: './src/js/map.js',
        showMap: './src/js/showMap.js',
        addImage: './src/js/addImage.js',
        homeMap: './src/js/homeMap.js',
        changeState: './src/js/changeState.js',
        sideMenu: './src/js/sideMenu.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}