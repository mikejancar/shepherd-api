import { Controller, Get, Param } from '@nestjs/common';

import { Movie } from '../models';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) { }

  @Get(':provider')
  getMoviesFromProvider(@Param('provider') provider: string): Movie[] {
    return this.moviesService.getMovies(provider);
  }
}
