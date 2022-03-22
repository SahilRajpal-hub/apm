const bucketName = "apm_device_kpi"; // another one is apm_device_kpi
const filePath = "./test.kpi";

const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  keyFilename: "innovate5g-phoenix-key.json",
  projectId: "innovate5g-phoenix",
});
async function uploadFile(filepath, destFileName) {
  await storage.bucket(bucketName).upload(filePath, {
    destination: destFileName,
  });
  console.log(`${filePath} uploaded to ${bucketName}`);
}

setInterval(() => {
  const filename = "logs_";
  uploadFile(filename + Date.now()).catch(console.error);
}, 200);
