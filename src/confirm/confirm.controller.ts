import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ConfirmService } from './confirm.service';
import { ApiTags } from '@nestjs/swagger';
import confirmDTO from './dtos/confirm.dto';
import { AuthGuard } from 'src/common/auth.guard';
import { AuthUser } from 'src/common/auth-user.decorator';

@ApiTags('confirm')
@Controller('confirm')
export class ConfirmController {
  constructor(private confirmService: ConfirmService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getConfirmByUserId(@AuthUser() user) {
    const userConfirmed = this.confirmService.getConfirmByUserId(user.data.id);
    return userConfirmed;
  }

  @Post()
  async createConfirm(@Body() confirm: confirmDTO) {
    const existingConfirm = await this.confirmService.getConfirmByEmail(
      confirm.email,
      confirm.event,
    );

    if (existingConfirm) {
      existingConfirm.hasAccepted = confirm.hasAccepted;
      return this.confirmService.updateConfirm(existingConfirm);
    }

    const confirmCreated = this.confirmService.createConfirm(confirm);
    return confirmCreated;
  }
}
