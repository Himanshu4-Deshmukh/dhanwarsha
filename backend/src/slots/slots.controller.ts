import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { CreateSlotDto, SetWinningNumberDto } from './dto/create-slot.dto';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createSlotDto: CreateSlotDto) {
    return this.slotsService.create(createSlotDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.slotsService.findAll();
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  async getActive() {
    return this.slotsService.getActiveSlot();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.slotsService.findById(id);
  }

  @Post(':id/winning-number')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async setWinningNumber(@Param('id') id: string, @Body() dto: SetWinningNumberDto) {
    return this.slotsService.setWinningNumber(id, dto);
  }

  @Get(':id/exposure')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getExposure(@Param('id') id: string) {
    return this.slotsService.getBetExposure(id);
  }
}
