export const robustPath = __dirname.includes('/dist')
  ? function (path) {
      return `${__dirname}/../src/${path}`;
    }
  : function (path) {
      return `${__dirname}/${path}`;
    };
