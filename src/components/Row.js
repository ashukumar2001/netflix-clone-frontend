import React, { useEffect, useState } from "react";
import Youtube from "react-youtube";
import { YTSearcher } from "ytsearcher";
import "./Row.css";
import axios from "../axios";
const searcher = new YTSearcher("AIzaSyD4WvZQB-2GpktSeXEOX32deaDT26uHDJ4");

const base_url_poster = "https://image.tmdb.org/t/p/original";
const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const [trailerId, setTrailerId] = useState("");
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "290",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      enablejsapi: 1,
      origin: "http://webeast.me",
    },
  };

  return (
    <div className="row">
      {/* Title */}
      <h2 className="row__title">{title}</h2>
      <div className="row__posters">
        {/* Container -> posters */}
        {movies.map((movie) => {
          const {
            backdrop_path,
            poster_path,
            name,
            id,
            title,
            original_title,
          } = movie;
          return (
            <img
              onClick={async () => {
                if (trailerId) {
                  setTrailerId("");
                } else {
                  try {
                    const res = await searcher.search(
                      `${title || original_title || name} trailer`,
                      {
                        type: "video",
                      }
                    );
                    setTrailerId(res.first.id);
                  } catch (error) {
                    console.log(error);
                  }
                }
              }}
              key={id}
              className={`row__poster ${isLargeRow && "row__poster--large"}`}
              src={`${base_url_poster}${
                isLargeRow ? poster_path : backdrop_path
              }`}
              alt={name}
            />
          );
        })}
      </div>

      {trailerId && <Youtube videoId={trailerId} opts={opts} />}
    </div>
  );
};

export default Row;
