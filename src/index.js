import * as use from '@tensorflow-models/universal-sentence-encoder';
import {
  interpolateReds
} from 'd3-scale-chromatic';
import 'babel-polyfill'
import {split, Syntax} from "sentence-splitter";

let sentences = [

];
let embeddings, model;
let embeddingsLoaded = false
const init = async () => {
  model = await use.load();

  document.querySelector('#loading').style.display = 'none';



}



const calculateSimilarity = async () => {
  let scores = []

  sentences.push(document.getElementById('test1').value);

  embeddings = await model.embed(sentences);
  console.log(embeddings)
  embeddingsLoaded = true;

  for (let i = 0; i < sentences.length - 1; i++) {


    let indexofLast = sentences.length - 1
    const sentenceI = embeddings.slice([i, 0], [1]);
    const sentenceJ = embeddings.slice([indexofLast, 0], [1]);
    const sentenceITranspose = false;
    const sentenceJTransepose = true;
    const score =
      sentenceI.matMul(sentenceJ, sentenceITranspose, sentenceJTransepose)
      .dataSync();
    scores.push(score)

  }

  console.log(scores);
  let scoreAverage = getArrayAverage(scores)
  let scoreCount = 0;
  for(let j=0; j<scores.length; j++) {
    if (scores[j] >= 0.45) {
      scoreCount+=1
      console.log(scoreCount, "scorecount")
    } else if(scores[j] < 0.45) {

    }
  }

  if(scoreCount > 2) {
    document.getElementById('score').innerHTML = `This statement has a strong correlation to the values, with a score of ${scoreAverage}`

  } else if(scoreCount === 1) {
    document.getElementById('score').innerHTML = `This statement has a correlation to the values,  with a score of ${scoreAverage}`

  } else if(scoreCount === 0) {
    document.getElementById('score').innerHTML = `This statement has no correlation to the values,  with a score of ${scoreAverage}`

  }
  sentences.pop()
}

function getArrayAverage(arr) {
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    sum += arr[i][0]; //don't forget to add the base
  }

  var avg = sum / arr.length;

  return avg;
}

function logSubmit(event) {

  setSentences();
  console.log(sentences)
  renderSentences();


  event.preventDefault();
}

const form = document.getElementById('submit');

form.addEventListener('click', logSubmit);


document.getElementById('statement').addEventListener('click', calculateSimilarity)
init();


const renderSentences = () => {
  sentences.forEach((sentence, i) => {
    const sentenceDom = document.createElement('div');
    sentenceDom.textContent = `${i + 1}) ${sentence}`;
    document.querySelector('#sentences-container').appendChild(sentenceDom);
  });
};

const setSentences = () => {
  //get text from input
  let fullText = document.getElementById('characterValues').value.toLowerCase()
  let processedSentences = split(fullText)

  for(let i=0; i<processedSentences.length; i++) {
    if(processedSentences[i].type === "Sentence") {
      sentences.push(processedSentences[i].raw)
    }
  }
  console.log(sentences)
}