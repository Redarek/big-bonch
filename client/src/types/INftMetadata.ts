interface attributes {
    trait_type: string,
    value: string,
}
export interface INftMetadata {
    name: string;
    description: string;
    image: string;
    tokenId?: string;
    _id:string;
    attributes: attributes[];
}
// export interface INftMetadataFetched {
//     name: string;
//     description: string;
//     image: string;
//     tokenId: string
//     attributes: Array<object>;
// }
