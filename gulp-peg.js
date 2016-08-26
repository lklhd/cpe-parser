const path = require('path')
const gutil = require('gulp-util')
const through = require('through2')
const peg = require('pegjs')

const PLUGIN_NAME = 'gulp-peg'

module.exports = function() {
  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file)
    }

    if (file.isBuffer()) {
      file.contents = new Buffer(peg.generate(file.contents.toString(), {
        format: 'commonjs',
        output: 'source'
      }))
      file.path = gutil.replaceExtension(file.path, '.js')
      return callback(null, file)
    }

    this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Unsupported file content type'))
  })
}
