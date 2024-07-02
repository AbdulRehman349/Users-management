import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateProfileDto } from './create-profile.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    deleted?: boolean;
}
