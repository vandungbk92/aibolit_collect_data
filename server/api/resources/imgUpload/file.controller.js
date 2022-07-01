import path from 'path';
export default {
  async uploadImage(req, res) {
    try {
      const { filename } = req.file;
      return res.json({ filename: filename });
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async getFileByName(req, res) {
    let fileNm = req.params.fileNm;
    let str = '';
    let arrStr = fileNm.split("---");
    arrStr.map(e => {
      str += '/'+e;
    })
    return res.sendFile(path.join(process.cwd(), './server/uploads/' + str));
  },

};
