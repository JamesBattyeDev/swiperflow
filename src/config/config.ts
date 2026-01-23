export default {
  prefix: 'data-swf-',
  keyWithPrefix(key: String) {
    return this.prefix + key
  }
}