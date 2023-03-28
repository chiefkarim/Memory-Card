import React, { useState, useEffect } from "react";
import "./App.css";
import uniqid from "uniqid";

function Header(props) {
  const content = [];
  content.push(
    <header>
      <h1>Memory Cards</h1>
      <div class="score">
        <h1>
          Best score:<span id="bestScore">{props.state.bestScore}</span>
        </h1>
        <h1>
          Score:<span id="score">{props.state.score}</span>
        </h1>
      </div>
    </header>
  );
  return content;
}

export default Header;

function App() {
  //fetching photos
  const [scores, setScores] = useState({ score: 0, bestScore: 0 });
  const [images, setImages] = useState({
    0: { id: uniqid(), state: false },
    1: { id: uniqid(), state: false },
    2: { id: uniqid(), state: false },
    3: { id: uniqid(), state: false },
    4: { id: uniqid(), state: false },
    5: { id: uniqid(), state: false },
    6: { id: uniqid(), state: false },
    7: { id: uniqid(), state: false },
    8: { id: uniqid(), state: false },
    9: { id: uniqid(), state: false },
  });
  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      fetch(`https://dog.ceo/api/breeds/image/random`)
        .then((res) => res.json())
        .then((data) =>
          setImages((img) => {
            return {
              ...img,
              [i]: { url: data.message, id: uniqid(), state: false },
            };
          })
        );
    }
  }, []);
  console.log(images);
  const content = [];
  function rearrange(e) {
    let id = e.currentTarget.id;
    let buffer = JSON.parse(JSON.stringify(images));

    setImages({});
    let numbuffer = [];

    for (let i = 0; i < 10; i++) {
      let random;
      do {
        random = Math.round(Math.random() * (9 - 0) + 0);
      } while (numbuffer.includes(random));
      numbuffer.push(random);
      let currentImg = JSON.parse(JSON.stringify(buffer))[random];
      if (currentImg["id"] === id) {
        setImages((img) => {
          return {
            ...img,
            [i]: {
              url: currentImg["url"],
              state: true,
              id: currentImg["id"],
            },
          };
        });
      } else {
        setImages((img) => {
          return {
            ...img,
            [i]: {
              url: currentImg["url"],
              state: currentImg["state"],
              id: currentImg["id"],
            },
          };
        });
      }
    }
  }

  for (let i = 0; i < 10; i++) {
    content.push(
      <img
        src={images[i].url || ""}
        onClick={(e) => {
          rearrange(e);
          gameLogic(e);
        }}
        id={images[i].id}
        key={images[i].id}
        alt="dogImage"
      />
    );
  }
  function gameLogic(e) {
    const id = e.currentTarget.id;
    for (let key in images) {
      if (images[key].id === id) {
        if (images[key].state === false) {
          if (scores["bestScore"] < scores["score"] + 1) {
            setScores((sc) => {
              return { score: sc["score"] + 1, bestScore: sc["score"] + 1 };
            });
            break;
          } else {
            setScores((sc) => {
              return { score: sc["score"] + 1, bestScore: scores["bestScore"] };
            });
            break;
          }
        } else if (images[key].state === true) {
          setScores((sc) => {
            return { score: 0, bestScore: scores["bestScore"] };
          });
          for (let key in images) {
            setImages((img) => {
              console.log(img[key]);
              return {
                ...img,
                [key]: {
                  url: images[key]["url"],
                  id: images[key]["id"],
                  state: false,
                },
              };
            });
          }
          break;
        }
      }
    }
    console.log(scores);
  }
  return (
    <>
      <Header state={scores} />
      <div>{content}</div>
    </>
  );
}

export { App };
