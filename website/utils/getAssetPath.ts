export default function getAssetPath(assetPath: string) {
  return process.env.REPOSITORY_NAME
    ? `/${process.env.REPOSITORY_NAME}/${assetPath}`
    : `/${assetPath}`;
}
