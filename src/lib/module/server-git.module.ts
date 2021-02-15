import { Module } from "@nestjs/common";
import { GrepService } from "../service/grep.service";

@Module({
    exports: [GrepService],
    providers: [GrepService],
})
export class ServerGitModule { }