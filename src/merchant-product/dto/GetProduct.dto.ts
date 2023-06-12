import { MerchantProduct } from "src/typeorm";
import { LoadImageUrl } from "src/types/image.url.interface";


export class GetProductDto extends MerchantProduct{

    existingImages?: LoadImageUrl[];


}