import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import mime from 'mime-types'

export default class JobController {
  constructor({ DB, knex, Model }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
  }

  async downloadFile({ params }, res) {
    const {
      node, id, type, attachment
    } = params
    const record = await this.DB.find(this.Model.base.getTable(node), id)
    if (!record || !record[type]) {
      throw { status: 404 }
    }
    const filename = record[type]
    const file_path = path.join(process.env.MOUNT, node, id, type, filename)
    if (!fs.existsSync(file_path)) {
      throw { status: 404 }
    }
    if (attachment) {
      res.header('Content-disposition', `attachment; filename=${filename}`)
    }
    res.header('Content-Type', mime.lookup(filename))
    const stream = fs.createReadStream(file_path)
    stream.on('error', () => {
      res.writeHead(404);
      res.end();
    });
    stream.pipe(res)
  }

  async uploadFile({ params }) {
    const {
      node, id, base64string, filename, type
    } = params
    const writeFile = Promise.promisify(fs.writeFile)
    const file_path = path.join(process.env.MOUNT, node, id, type)
    await fse.ensureDir(file_path)
    await writeFile(
      path.join(file_path, filename),
      Buffer.from(base64string.split(';').pop().replace('base64,', ''), 'base64')
    )
    await this.DB.updateById(
      this.Model.base.getTable(node),
      { id, [type]: filename }
    )
    return { success: true }
  }
}
