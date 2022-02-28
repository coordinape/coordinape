import aws from 'aws-sdk';

const s3 = new aws.S3({
  accessKeyId: process.env.IMAGES_AWS_ACCESS_KEY_ID || 'missing_env_var',
  secretAccessKey:
    process.env.IMAGES_AWS_SECRET_ACCESS_KEY || 'missing_env_var',
  endpoint: process.env.IMAGES_AWS_ENDPOINT || undefined,
  region: process.env.IMAGES_AWS_REGION || undefined,
});

const uploadImage = (Key: string, Body: Buffer) => {
  const params = {
    Key,
    Body,
    Bucket: process.env.IMAGES_AWS_BUCKET || 'coordinape',
  };
  return s3.upload(params).promise();
};

const deleteImage = (Key: string) => {
  return s3
    .deleteObject({
      Bucket: process.env.IMAGES_AWS_BUCKET || 'coordinape',
      Key,
    })
    .promise();
};

export { deleteImage, uploadImage };
