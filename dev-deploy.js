import ghpages from 'gh-pages';
import path from 'path';

const __filename = process.argv[1];
const __dirname = path.dirname(__filename);
const staticDir = path.resolve(__dirname, '../static');

ghpages.publish(
  path.resolve(__dirname, staticDir),
  err => {
    if (err) console.log(err);
    else console.log('published');
  }
);