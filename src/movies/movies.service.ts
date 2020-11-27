import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

import { Movie } from '../models';

import jsdom = require('jsdom');
const { JSDOM } = jsdom;

export enum Providers {
  Amazon = 'amazon',
  MoviesAnywhere = 'movies-anywhere'
}

@Injectable()
export class MoviesService {
  private amazonDataLocation = 'C:/temp/my-stuff-library.html';
  private moviesAnywhereDataLocation = 'C:/temp/movies-anywhere-my-movies.json';

  getMovies(provider: string): Movie[] {
    let movies: Movie[] = [];

    try {
      switch (provider) {
        case Providers.Amazon:
          movies = this.retrieveAmazonMovies();
          break;
        case Providers.MoviesAnywhere:
          movies = this.retrieveMoviesAnywhereMovies();
          break;
      }
    } catch (error) {
      console.log(`Error: getMovies(${provider})`);
      console.log(error);
    }

    return movies;
  }

  private retrieveAmazonMovies(): Movie[] {
    const movies: Movie[] = [];

    const amazonBody = readFileSync(this.amazonDataLocation, 'utf8');
    if (amazonBody) {
      const amazonPage = new JSDOM(amazonBody);
      const movieElements = amazonPage.window.document.querySelectorAll('.D0Lu_p ._1Opa2_ img');

      movieElements.forEach(elem => {
        const title = elem.getAttribute('alt') || 'NOT FOUND';
        const coverImage = elem.getAttribute('src') || 'NOT FOUND';

        movies.push({ title, coverImage, provider: Providers.Amazon });
      })
    }
    return movies;
  }

  private retrieveMoviesAnywhereMovies(): Movie[] {
    const movies: Movie[] = [];

    const moviesAnywhereBody = JSON.parse(readFileSync(this.moviesAnywhereDataLocation, 'utf8'));
    const movieCollection = moviesAnywhereBody.data?.page?.components?.find(comp => comp.title === 'My Movies');
    if (movieCollection) {
      movieCollection.paginatedItems.forEach(movieItem => {
        const title = movieItem.title || 'NOT FOUND';
        const coverImage = movieItem.image?.url || 'NOT FOUND';

        movies.push({ title, coverImage, provider: Providers.MoviesAnywhere });
      })
    }
    return movies;
  }
}
