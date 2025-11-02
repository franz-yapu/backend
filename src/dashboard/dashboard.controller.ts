import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard() {
    return this.dashboardService.getDashboard();
  }

   @Get('curso/:id')
  async getDashboardPorCurso(@Param('id') id: string) {
    return this.dashboardService.getDashboardPorCurso(id);
  }
}
