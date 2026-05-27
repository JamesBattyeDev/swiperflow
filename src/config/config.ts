export default {
  prefix: 'data-swf-',
  keyWithPrefix(key: string) {
    return this.prefix + key;
  },
};
