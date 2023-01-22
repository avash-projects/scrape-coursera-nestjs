import { IsNotEmpty } from "class-validator";

export class ScrapeDto {
    @IsNotEmpty()
    query: string;
}