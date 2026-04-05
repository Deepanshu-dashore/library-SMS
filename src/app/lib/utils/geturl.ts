export class getUrls {
  static getUrl(url: string, resource_type: string | undefined = "image") {
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${resource_type}/upload/${url}`;
  }
}
