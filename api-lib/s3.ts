import aws from "aws-sdk";

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'missing_env_var',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'missing_env_var',
  endpoint: process.env.AWS_ENDPOINT ? process.env.AWS_ENDPOINT : undefined,
});

const uploadImage = (Key: string, Body: Buffer) => {
  const p = {
    Key,
    Body,
    Bucket: process.env.AWS_BUCKET_IMAGES || "coordinape",
  };
  return s3.upload(p).promise();
};

const deleteImage = (Key: string) => {
  return s3
    .deleteObject({
      Bucket: process.env.AWS_BUCKET_IMAGES || "coordinape",
      Key,
    })
    .promise();
};

export {
  deleteImage,
  uploadImage,
};