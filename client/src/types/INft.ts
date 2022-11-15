export interface INft {
    tokenId: string;
    name: string;
    description: string;
    image: string;
    external_url: string;
    attributes: Array<object>;
}