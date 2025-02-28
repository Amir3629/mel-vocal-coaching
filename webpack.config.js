const path = require('path');

module.exports = {
    entry: './js/index.js', // Entry point for your application
    output: {
        filename: 'bundle.js', // Output bundle file
        path: path.resolve(__dirname, 'build'), // Output directory
    },
    mode: 'development', // Set the mode to development
    module: {
        rules: [
            {
                test: /\.js$/, // Apply this rule to .js files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Use Babel to transpile JavaScript
                },
            },
        ],
    },
}; 