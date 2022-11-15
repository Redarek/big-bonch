export interface INft {
    tokenId: number;
    name: string;
    description: string;
    image: string;
    external_url: string;
    attributes: Array<object>;
}
