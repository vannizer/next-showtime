import { propOr, anyPass, isEmpty, isNil, pipe, filter, join, toUpper } from 'ramda'
import React from 'react'
import {
  Card,
  MovieLayout,
  MovieDescription,
  MovieTitle,
  MoviePoster,
  MovieShowtimes,
  Showtime,
  MovieInfo,
} from './style'
import LinkHighlight from '../LinkHighlight'
import { generateKeyWrapper } from '../../lib/helpers'

const getShowtimes = propOr([], 'showtimes')
const displayPostfix = postfix => data => (data == null ? '' : `${data} ${postfix}`)
const displayDuration = displayPostfix('mins')
const googleSearch = (name = '') => {
  const encodedName = name.split(' ').join('+')
  return `https://www.google.co.th/search?q=${encodedName}`
}

const isValue = anyPass([isEmpty, isNil])
const notValue = data => !isValue(data)

const displaySeperateWith = seperator => pipe(filter(notValue), join(seperator))
const displayWithHyphen = displaySeperateWith(' - ')

const displayImdb = obj =>
  (notValue(obj) ? (
    <LinkHighlight href={`http://www.imdb.com/title/${obj.id}`}>
      imdb: {obj.rating}/10
    </LinkHighlight>
  ) : null)

MovieCard.defaultProps = {
  data: {},
}
function MovieCard({ data }) {
  const showtimes = generateKeyWrapper(getShowtimes(data))

  return (
    <Card>
      <MovieLayout>
        <MoviePoster src={data.movie_poster}>
          <img src={data.movie_poster} alt="" />
        </MoviePoster>
        <MovieDescription>
          <MovieTitle>
            <LinkHighlight href={googleSearch(data.movie_title)} target="_blank">
              {data.movie_title}
            </LinkHighlight>
          </MovieTitle>
          <MovieInfo>
            <div>{displayWithHyphen([displayDuration(data.movie_duration), data.technology])}</div>
            <div>{displayWithHyphen([toUpper(data.audio), data.cinema])}</div>
            <div>{displayImdb(data.imdb)}</div>
          </MovieInfo>
          <MovieShowtimes>
            {showtimes.map(showtime => <Showtime key={showtime.id}>{showtime.value}</Showtime>)}
          </MovieShowtimes>
        </MovieDescription>
      </MovieLayout>
    </Card>
  )
}

export default MovieCard
