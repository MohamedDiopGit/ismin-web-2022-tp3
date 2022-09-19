import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { BookDto } from "./interface/Book.dto";

@Module({
    imports: [HttpModule],
    providers: [BookDto],
  })
  export class BookModule {}