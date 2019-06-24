import path from 'path';

export default {
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'index.js',
    publicPath: '/'
  },
  mode: 'production',
  entry: './src/index.js',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }
};
