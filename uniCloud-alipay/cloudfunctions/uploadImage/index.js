// 'use strict';
// exports.main = async (event, context) => {
// 	let { cloudPath, dataUrl } = event;
// 	if (!dataUrl) return { code: -1, msg: '图片数据不能为空' };
// 	// dataUrl 格式：data:image/png;base64,xxxxxxxxx
// 	const match = dataUrl.match(/^data:(image\/[\w\+\.]+);base64,(.+)$/);
// 	if (!match) return { code: -1, msg: '图片格式无效' };
// 	const base64 = match[2];
// 	const buffer = Buffer.from(base64, 'base64');
// 	if (!cloudPath) {
// 		const ext = match[1].split('/')[1] || 'png';
// 		cloudPath = `upload/${Date.now()}.${ext}`;
// 	}
// 	try {
// 		const res = await uniCloud.uploadFile({
// 			cloudPath,
// 			fileContent: buffer
// 		});
// 		return { code: 0, msg: 'ok', fileID: res.fileID, url: res.url };
// 	} catch (e) {
// 		return { code: -1, msg: e.message || '上传失败' };
// 	}
// };

'use strict';
exports.main = async (event, context) => {
  let { cloudPath, dataUrl } = event;
  if (!dataUrl) return { code: -1, msg: '图片数据不能为空' };
  // dataUrl 格式: data:image/png;base64,xxxxxxxxx
  const match = dataUrl.match(/^data:(image\/[\w+\.]+);base64,(.+)$/);
  if (!match) return { code: -1, msg: '图片格式无效' };
  const base64 = match[2];
  const buffer = Buffer.from(base64, 'base64');
  if (!cloudPath) {
    const ext = match[1].split('/')[1] || 'png';
    cloudPath = `upload/${Date.now()}.${ext}`;
  }
  try {
    const res = await uniCloud.uploadFile({
      cloudPath,
      fileContent: buffer
    });
    // fileID 可能是 cloud:// 格式，无法直接在浏览器中显示，需用 getTempFileURL 换取 https 访问地址
    let url = res.fileID;
    if (url && url.indexOf('cloud://') === 0) {
      const urlRes = await uniCloud.getTempFileURL({
        fileList: [res.fileID]
      });
      const fileItem = urlRes.fileList && urlRes.fileList[0];
      url = (fileItem && (fileItem.tempFileURL || fileItem.url)) || url;
    }
    return { code: 0, msg: 'ok', fileID: res.fileID, url };
  } catch (e) {
    return { code: -1, msg: e.message || '上传失败' };
  }
};
